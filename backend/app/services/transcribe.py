"""
transcribe.py
-------------
Transcripcion con faster-whisper. El modelo se carga y se libera de la
RAM en cada uso, para evitar que conviva en memoria junto con el modelo
de enhance en entornos con poca RAM (Railway free tier: 512MB).
"""

import gc
from faster_whisper import WhisperModel

MODEL_SIZE = "small"


def transcribe_with_word_timestamps(audio_path: str, language: str | None = "es") -> dict:
    model = WhisperModel(MODEL_SIZE, device="cpu", compute_type="int8")

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

    del model
    gc.collect()

    return result