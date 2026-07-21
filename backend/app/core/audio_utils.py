"""
audio_utils.py
---------------
Utilidades base para cargar y exportar audio en calidad "estudio":
48kHz, 24-bit PCM. Centraliza el manejo de sample rate y bit depth
para que todos los servicios (enhance, transcribe, edit) usen el
mismo formato de trabajo internamente.
"""

import numpy as np
import soundfile as sf
import librosa

STUDIO_SAMPLE_RATE = 48000
STUDIO_SUBTYPE = "PCM_24"  # 24-bit PCM


def load_audio_mono(path: str, target_sr: int = STUDIO_SAMPLE_RATE) -> tuple[np.ndarray, int]:
    """
    Carga un archivo de audio, lo convierte a mono y lo resamplea
    a la tasa de muestreo objetivo (por defecto 48kHz).

    Returns:
        (audio, sample_rate): np.ndarray float32 en rango [-1, 1], y el sample rate.
    """
    audio, sr = librosa.load(path, sr=None, mono=True)

    if sr != target_sr:
        audio = librosa.resample(audio, orig_sr=sr, target_sr=target_sr)
        sr = target_sr

    return audio.astype(np.float32), sr


def save_audio_studio_quality(audio: np.ndarray, out_path: str, sample_rate: int = STUDIO_SAMPLE_RATE) -> str:
    """
    Exporta un array de audio a disco en 48kHz / 24-bit PCM (.wav).

    Args:
        audio: array float32 normalizado en [-1, 1]
        out_path: ruta de salida (.wav)
        sample_rate: sample rate de salida

    Returns:
        La ruta del archivo escrito.
    """
    # Aseguramos que no haya clipping antes de exportar
    peak = np.max(np.abs(audio)) if audio.size > 0 else 0.0
    if peak > 1.0:
        audio = audio / peak * 0.98  # deja un pequeño headroom

    sf.write(out_path, audio, sample_rate, subtype=STUDIO_SUBTYPE)
    return out_path


def crossfade_concat(segments: list[np.ndarray], sample_rate: int, fade_ms: float = 10.0) -> np.ndarray:
    """
    Concatena una lista de segmentos de audio aplicando un crossfade corto
    entre cada uno, para evitar "clicks" al hacer cortes (usado por el
    motor de edición basada en texto).

    Args:
        segments: lista de arrays de audio (float32) a unir en orden
        sample_rate: sample rate de los segmentos (deben coincidir)
        fade_ms: duración del crossfade en milisegundos

    Returns:
        Un único array de audio con todos los segmentos unidos.
    """
    if not segments:
        return np.array([], dtype=np.float32)

    fade_samples = int(sample_rate * fade_ms / 1000)
    result = segments[0].copy()

    for seg in segments[1:]:
        if fade_samples > 0 and len(result) >= fade_samples and len(seg) >= fade_samples:
            fade_out = np.linspace(1.0, 0.0, fade_samples)
            fade_in = np.linspace(0.0, 1.0, fade_samples)

            tail = result[-fade_samples:] * fade_out
            head = seg[:fade_samples] * fade_in
            crossfaded = tail + head

            result = np.concatenate([result[:-fade_samples], crossfaded, seg[fade_samples:]])
        else:
            # Segmento muy corto para crossfade, concatenamos directo
            result = np.concatenate([result, seg])

    return result
