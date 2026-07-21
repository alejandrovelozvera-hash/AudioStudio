# Frontend — Next.js + Electron

## Estructura sugerida

```
frontend/
├── app/
│   ├── editor/[projectId]/page.tsx   # Editor principal (waveform + texto)
│   └── record/[sessionId]/page.tsx   # Sala de grabación remota
├── components/
│   ├── Waveform.tsx                  # Wrapper de WaveSurfer.js
│   ├── TextEditor.tsx                # Editor de texto sincronizado con audio
│   └── RecordingControls.tsx
├── lib/
│   ├── api.ts                        # Cliente HTTP hacia el backend FastAPI
│   └── mediaRecorder.ts              # Lógica de grabación local (double-ender)
└── electron/
    ├── main.ts                       # Proceso principal de Electron
    └── preload.ts
```

## Integración WaveSurfer.js + edición de texto

- `WaveSurfer.js` se usa con el plugin `regions` para resaltar visualmente
  qué rango de la onda corresponde a qué palabra seleccionada en el texto.
- Cuando el usuario borra una palabra en el `<TextEditor>`, no se borra
  audio inmediatamente: se marca esa palabra como `deleted: true` en el
  estado local (Zustand). El preview se logra silenciando ese rango en
  tiempo real (ganancia a 0 durante el rango) — el render final (con
  crossfades reales) solo se pide al backend (`/api/edit/render`) al exportar.

## Grabación local (double-ender) en el navegador

```ts
// lib/mediaRecorder.ts (resumen conceptual)
const stream = await navigator.mediaDevices.getUserMedia({ audio: {
  echoCancellation: false,   // NO usar el AEC del navegador: queremos la señal
  noiseSuppression: false,   // cruda; el "enhance" lo hace nuestro backend con IA
  autoGainControl: false,
  sampleRate: 48000,
}});

const recorder = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" });
recorder.ondataavailable = (e) => uploadChunkToS3(e.data); // cada N segundos
```

Es intencional desactivar `echoCancellation`/`noiseSuppression` del navegador:
degradan la señal cruda que luego el pipeline de IA (DeepFilterNet3 +
Resemble Enhance) puede limpiar de forma muy superior.

## Electron

El mismo build de Next.js (`next build && next export`, o modo standalone)
se sirve dentro de una `BrowserWindow` de Electron. La única lógica exclusiva
de escritorio es el acceso a dispositivos de audio de baja latencia vía
`navigator.mediaDevices` (igual funciona en Electron) y, opcionalmente,
guardado directo a disco local sin pasar por el navegador.
