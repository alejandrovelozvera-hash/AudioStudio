"""
enhance.py
----------
Pipeline de "Enhance Speech". Cascada:
  1. DeepFilterNet3   -> elimina ruido de fondo estacionario
  2. Resemble Enhance -> denoise profundo + timbre (OPCIONAL, se omite si no esta instalado)
  3. pyloudnorm       -> normaliza el volumen
  4. Exporta a 48kHz / 24-bit PCM
"""

import numpy as np
import torch
import pyloudnorm as pyln

from app.core.audio_utils import (
    load_audio_mono,
    save_audio_studio_quality,
    STUDIO_SAMPLE_RATE,
)

DEFAULT_TARGET_LUFS = -16.0
_device = "cuda" if torch.cuda.is_available() else "cpu"

_df_model = None
_df_state = None
_resemble_enhance_fn = None
_resemble_denoise_fn = None


def _load_deepfilternet():
    global _df_model, _df_state
    if _df_model is None:
        from df.enhance import init_df
        _df_model, _df_state, _ = init_df()
    return _df_model, _df_state


def _load_resemble_enhance():
    global _resemble_enhance_fn, _resemble_denoise_fn
    if _resemble_enhance_fn is None:
        try:
            from resemble_enhance.enhancer.inference import denoise, enhance
            _resemble_denoise_fn = denoise
            _resemble_enhance_fn = enhance
        except ImportError:
            return None, None
    return _resemble_denoise_fn, _resemble_enhance_fn


def _apply_deepfilternet(audio: np.ndarray, sr: int) -> np.ndarray:
    from df.enhance import enhance as df_enhance
    import torch as t

    model, state = _load_deepfilternet()
    audio_tensor = t.from_numpy(audio).unsqueeze(0)
    enhanced = df_enhance(model, state, audio_tensor)
    return enhanced.squeeze(0).cpu().numpy()


def _apply_resemble_enhance(audio: np.ndarray, sr: int):
    denoise_fn, enhance_fn = _load_resemble_enhance()
    if denoise_fn is None:
        return audio, sr

    audio_tensor = torch.from_numpy(audio)
    denoised, new_sr = denoise_fn(audio_tensor, sr, device=_device)
    enhanced, final_sr = enhance_fn(
        denoised, new_sr, device=_device,
        nfe=64, solver="midpoint", lambd=0.9, tau=0.5,
    )
    return enhanced.cpu().numpy(), final_sr


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

    audio, sr = _apply_resemble_enhance(audio, sr)
    audio = _normalize_loudness(audio, sr, target_lufs)

    return save_audio_studio_quality(audio, output_path, sample_rate=sr)