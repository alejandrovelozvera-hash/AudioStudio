"""
text_edit.py
------------
Motor de "edición basada en texto". El frontend nunca envía audio recortado
directamente: envía una EDL (Edit Decision List) — la lista de rangos de
tiempo que SÍ deben conservarse — derivada de qué palabras el usuario dejó
en el texto. Este servicio renderiza el audio final a partir de esa EDL,
de forma no destructiva (el original nunca se modifica).
"""

from pydantic import BaseModel

from app.core.audio_utils import (
    load_audio_mono,
    save_audio_studio_quality,
    crossfade_concat,
    STUDIO_SAMPLE_RATE,
)


class TimeRange(BaseModel):
    start: float  # segundos
    end: float    # segundos


class EditDecisionList(BaseModel):
    """
    Lista de rangos de tiempo, en orden, que deben mantenerse en el
    render final. Todo lo que NO está en esta lista se considera "borrado".
    """
    keep_ranges: list[TimeRange]


def words_to_edl(all_words: list[dict], kept_word_indices: set[int]) -> EditDecisionList:
    """
    Convierte una selección de palabras (las que el usuario dejó tras editar
    el texto) en una EDL de rangos de tiempo a conservar, fusionando palabras
    consecutivas en un solo rango continuo.

    Args:
        all_words: lista completa de palabras con timestamps (salida de transcribe.py)
        kept_word_indices: índices (posición en all_words) de las palabras que
                            el usuario NO borró del texto

    Returns:
        EditDecisionList con los rangos fusionados y ordenados.
    """
    sorted_indices = sorted(kept_word_indices)
    ranges: list[TimeRange] = []

    for idx in sorted_indices:
        word = all_words[idx]
        if ranges and abs(word["start"] - ranges[-1].end) < 0.05:
            # Palabra contigua a la anterior conservada -> extiende el rango actual
            ranges[-1].end = word["end"]
        else:
            ranges.append(TimeRange(start=word["start"], end=word["end"]))

    return EditDecisionList(keep_ranges=ranges)


def render_edl_to_audio(source_audio_path: str, edl: EditDecisionList, output_path: str) -> str:
    """
    Renderiza el audio final aplicando la EDL: extrae solo los rangos marcados
    como "keep" y los une con crossfades cortos para evitar clicks perceptibles.

    Args:
        source_audio_path: ruta al audio original (sin cortar)
        edl: la lista de rangos a conservar
        output_path: ruta de salida del render (.wav, 48kHz/24-bit)

    Returns:
        La ruta del archivo renderizado.
    """
    audio, sr = load_audio_mono(source_audio_path, target_sr=STUDIO_SAMPLE_RATE)

    segments = []
    for r in edl.keep_ranges:
        start_sample = int(r.start * sr)
        end_sample = int(r.end * sr)
        segments.append(audio[start_sample:end_sample])

    final_audio = crossfade_concat(segments, sample_rate=sr, fade_ms=10.0)

    return save_audio_studio_quality(final_audio, output_path, sample_rate=sr)
