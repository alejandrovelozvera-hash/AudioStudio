"""
transcribe.py
-------------
Transcripción con timestamps a nivel de palabra usando faster-whisper.
Esta es la base de la "edición basada en texto": cada palabra devuelta
trae su rango [start, end] en segundos, que el frontend usa para mapear
texto -> audio.
"""

from faster_whisper import WhisperModel

# distil-large-v3: ~6x más rápido que large-v3 con accuracy casi idéntico.
# Usar "large-v3" si se prioriza precisión máxima sobre velocidad.
MODEL_SIZE = "distil-large-v3"

_model = None


def _get_model() -> WhisperModel:
    global _model
    if _model is None:
        # compute_type="float16" si hay GPU; "int8" en CPU para mayor velocidad
        import torch
        device = "cuda" if torch.cuda.is_available() else "cpu"
        compute_type = "float16" if device == "cuda" else "int8"
        _model = WhisperModel(MODEL_SIZE, device=device, compute_type=compute_type)
    return _model


def transcribe_with_word_timestamps(audio_path: str, language: str | None = "es") -> dict:
    """
    Transcribe un archivo de audio y devuelve texto + timestamps por palabra.

    Args:
        audio_path: ruta al archivo de audio
        language: código de idioma ("es", "en", etc.) o None para auto-detectar

    Returns:
        {
          "text": "transcripción completa...",
          "words": [
              {"word": "Hola", "start": 0.0, "end": 0.32},
              {"word": "mundo", "start": 0.35, "end": 0.71},
              ...
          ]
        }
    """
    model = _get_model()

    segments, info = model.transcribe(
        audio_path,
        language=language,
        word_timestamps=True,   # clave para la edición basada en texto
        vad_filter=True,        # filtra silencios usando Voice Activity Detection
    )

    all_words = []
    full_text_parts = []

    for segment in segments:
        full_text_parts.append(segment.text.strip())
        if segment.words:
            for w in segment.words:
                all_words.append({
                    "word": w.word.strip(),
                    "start": round(w.start, 3),
                    "end": round(w.end, 3),
                })

    return {
        "text": " ".join(full_text_parts),
        "words": all_words,
        "detected_language": info.language,
    }
