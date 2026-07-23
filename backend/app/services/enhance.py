"""
enhance.py
----------
Pipeline de mejora de audio. El modelo DeepFilterNet3 se carga y se
libera de la RAM en cada uso (no se mantiene cacheado), para evitar
que conviva en memoria junto con el modelo de transcripcion en
entornos con poca RAM (Railway free tier: 512MB).
"""

import gc
import numpy as np
import torch
import pyloudnorm as pyln

from app.core.audio_utils import (
    load_audio_mono,
    save_audio_studio_quality,
    STUDIO_SAMPLE_RATE,
)

torch.set_num_threads(1)

DEFAULT_TARGET_LUFS = -16.0


def _apply_deepfilternet(audio: np.ndarray, sr: int) -> np.ndarray:
    """Carga DeepFilterNet3, procesa el audio, y libera el modelo de inmediato."""
    from df.enhance import init_df, enhance as df_enhance

    model, state, _ = init_df()

    audio_tensor = torch.from_numpy(audio).unsqueeze(0)
    enhanced = df_enhance(model, state, audio_tensor)
    result = enhanced.squeeze(0).cpu().numpy()

    del model, state, audio_tensor, enhanced
    gc.collect()

    return result


def _normalize_loudness(audio: np.ndarray, sr: int, target_lufs: float = DEFAULT_TARGET_LUFS) -> np.ndarray:
    meter = pyln.Meter(sr)
    current_loudness = meter.integrated_loudness(audio)
    if current_loudness == float("-inf"):
        return audio
    return pyln.normalize.loudness(audio, current_loudness, target_lufs)


def enhance_speech_file(
    input_path: str,
    output_path: str,
    target_lufs: float = DEFAULT_TARGET_LUFS,
    skip_deepfilternet: bool = False,
) -> str:
    audio, sr = load_audio_mono(input_path, target_sr=STUDIO_SAMPLE_RATE)

    if not skip_deepfilternet:
        audio = _apply_deepfilternet(audio, sr)

    audio = _normalize_loudness(audio, sr, target_lufs)

    result = save_audio_studio_quality(audio, output_path, sample_rate=sr)

    del audio
    gc.collect()

    return result