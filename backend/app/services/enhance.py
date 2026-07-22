"""
enhance.py
----------
Pipeline de mejora de audio, optimizado para poca RAM (Railway 512MB).
Limita hilos de PyTorch y libera memoria activamente tras cada trabajo.
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
_device = "cpu"

_df_model = None
_df_state = None


def _load_deepfilternet():
    global _df_model, _df_state
    if _df_model is None:
        from df.enhance import init_df
        _df_model, _df_state, _ = init_df()
    return _df_model, _df_state


def _apply_deepfilternet(audio: np.ndarray, sr: int) -> np.ndarray:
    from df.enhance import enhance as df_enhance
    import torch as t

    model, state = _load_deepfilternet()
    audio_tensor = t.from_numpy(audio).unsqueeze(0)
    enhanced = df_enhance(model, state, audio_tensor)
    return enhanced.squeeze(0).cpu().numpy()


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