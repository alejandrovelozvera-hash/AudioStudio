# StudioAI — Clon funcional de Adobe Podcast (Enhance + Text Edit + Remote Recording)

Guía de arquitectura, stack y backend inicial funcional.

## 1. Estructura del proyecto

```
audio-studio-ai/
├── backend/
│   ├── app/
│   │   ├── main.py                  # Entry point FastAPI
│   │   ├── core/
│   │   │   ├── config.py            # Settings (env vars)
│   │   │   └── audio_utils.py       # Carga/exporta audio 48kHz 24-bit
│   │   ├── services/
│   │   │   ├── enhance.py           # Pipeline de mejora de voz (IA)
│   │   │   ├── transcribe.py        # Whisper -> texto + timestamps por palabra
│   │   │   └── text_edit.py         # Motor de edición basada en texto (EDL)
│   │   ├── routers/
│   │   │   ├── enhance_router.py    # POST /api/enhance
│   │   │   ├── transcribe_router.py # POST /api/transcribe
│   │   │   └── edit_router.py       # POST /api/edit/render
│   │   └── models_weights/          # (aquí se descargan los pesos de los modelos)
│   ├── requirements.txt
│   └── worker.py                    # Worker Celery/RQ para jobs pesados (GPU)
└── frontend-notes/
    └── ARCHITECTURE.md              # Notas de integración frontend (Next.js/Electron)
```

## 2. Paso a paso para levantar el backend

```bash
cd backend
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Descargar modelo de enhancement (Resemble Enhance) — se descarga automáticamente
# la primera vez que se usa, o manualmente:
python -c "from resemble_enhance.enhancer.inference import denoise, enhance"

# Levantar Redis (para la cola de jobs de IA, necesario porque la inferencia
# tarda varios segundos y no debe bloquear el request HTTP)
docker run -d -p 6379:6379 redis

# Levantar el worker que ejecuta los modelos en GPU
python worker.py

# Levantar la API
uvicorn app.main:app --reload --port 8000
```

## 3. Flujo de "Enhance Speech" (equivalente a Adobe)

1. Cliente sube el .wav → `POST /api/enhance` → se encola un job (no se procesa en el request, porque la inferencia con GPU puede tardar 10-40s dependiendo de la duración).
2. El worker ejecuta el pipeline en cascada:
   - **DeepFilterNet3**: elimina ruido de fondo estacionario (aire acondicionado, hum, hiss).
   - **Resemble Enhance** (etapa denoise + etapa enhance): elimina reverb de sala y "repara" el timbre de la voz, similar al resultado de Adobe.
   - **pyloudnorm**: normaliza a -16 LUFS (estándar de podcast) o -19 LUFS (diálogo/voice-over).
   - Resample final a 48kHz / 24-bit PCM con `soundfile`.
3. Cliente hace polling a `GET /api/jobs/{job_id}` hasta `status: done`, luego descarga el resultado.

## 4. Flujo de "Text-based editing"

1. `POST /api/transcribe` con el audio → usa `faster-whisper` con `word_timestamps=True`.
2. Devuelve JSON con cada palabra y su `[start, end]` en segundos.
3. El frontend renderiza el texto; cuando el usuario borra una palabra, el frontend
   envía el rango de tiempo correspondiente a `POST /api/edit/render` como parte
   de una **EDL (Edit Decision List)**: lista de rangos de tiempo que SÍ se deben conservar.
4. El backend nunca corta el audio original — solo al exportar, concatena los
   segmentos de la EDL con crossfades cortos (5-15ms) para evitar clicks.

## 5. Grabación remota (double-ender) — notas de arquitectura

- Cada participante graba **localmente** en su navegador con `MediaRecorder`
  (formato WAV o Opus sin comprimir agresivamente) — nunca depende de la calidad
  de la llamada.
- Cada 5-10 segundos, el chunk se sube a almacenamiento (S3/R2) vía **presigned URL**,
  para no perder la grabación si se corta internet.
- WebRTC (ej. LiveKit o mediasoup) se usa SOLO para el audio de monitoreo en vivo
  entre participantes — puede ir comprimido, no importa, no es lo que se usa
  para el resultado final.
- Al terminar, un worker descarga todos los chunks de cada participante y los
  alinea por timestamp de servidor (reloj compartido sincronizado vía NTP en el
  cliente) o, más robusto, por un "clap sync" (pico de energía compartido al
  inicio de la grabación, igual que en producción de cine/video).

## 6. Modelos recomendados (resumen)

| Tarea | Modelo | Repo |
|---|---|---|
| Denoise rápido | DeepFilterNet3 | Rikorose/DeepFilterNet |
| Enhance de calidad (voz) | Resemble Enhance | resemble-ai/resemble-enhance |
| Transcripción + timestamps | faster-whisper (large-v3 / distil-large-v3) | SYSTRAN/faster-whisper |
| Normalización de loudness | pyloudnorm | csteinmetz1/pyloudnorm |

## 7. Frontend — Editor (Next.js + WaveSurfer.js)

Ya implementado en `frontend/`. Para levantarlo:

```bash
cd frontend
npm install
cp .env.local.example .env.local   # apunta al backend en localhost:8000
npm run dev
```

Abre `http://localhost:3000/editor/demo`.

**Sistema de diseño:** fondo casi negro (#0B0B0C), acento cian-señal (#5EEAD4)
para lo activo/reproduciendo, coral (#FB6B54) para lo eliminado. Tipografía
`Space Grotesk` en la UI y `Newsreader` (serif) en el texto transcrito editable
— la idea es que el texto se sienta como un documento, no como un panel de control.

**Componentes clave:**
- `components/TransportBar.tsx` — sube el audio y dispara la transcripción
- `components/Waveform.tsx` — WaveSurfer.js + plugin de regiones para marcar visualmente los cortes
- `components/TextEditor.tsx` — el editor de texto: clic en una palabra = la marca como eliminada, y resalta su rango en el waveform (soft-delete, no destructivo)
- `components/EnhancePanel.tsx` — dispara el pipeline de IA (`/api/enhance`) y hace polling hasta que el job termina
- `lib/store.ts` — estado global (Zustand): palabras, audio actual, qué se borró

**Pendiente para conectar el ciclo completo de edición:** falta el botón "Exportar"
que tome `getKeepRanges()` del store y lo envíe a `POST /api/edit/render` del
backend para generar el archivo final ya cortado. Es el siguiente paso natural.

Ver también `frontend-notes/ARCHITECTURE.md` para las notas de grabación remota y Electron.
