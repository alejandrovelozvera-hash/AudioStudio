"""
transcribe.py
-------------
Transcripcion con timestamps por palabra usando faster-whisper.
Usa el modelo "small" (multilingue) en vez de distil-large-v3 para
reducir drasticamente el uso de RAM (necesario en Railway con 512MB).
"""

from faster_whisper import WhisperModel
import gc

MODEL_SIZE = "small"

_model = None


def _get_model() -> WhisperModel:
    global _model
    if _model is None:
        _model = WhisperModel(MODEL_SIZE, device="cpu", compute_type="int8")
    return _model


def transcribe_with_word_timestamps(audio_path: str, language: str | None = "es") -> dict:
    model = _get_model()

    segments, info = model.transcribe(
        audio_path,
        language=language,
        word_timestamps=True,
        vad_filter=True,
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

    result = {
        "text": " ".join(full_text_parts),
        "words": all_words,
        "detected_language": info.language,
    }

    gc.collect()
    return result