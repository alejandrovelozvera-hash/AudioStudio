"""
transcribe_router.py
---------------------
Endpoint para obtener la transcripción con timestamps por palabra,
usada por el editor de texto del frontend.
"""

import os
import uuid
from fastapi import APIRouter, UploadFile, File

from app.services.transcribe import transcribe_with_word_timestamps

router = APIRouter(prefix="/api/transcribe", tags=["transcribe"])

UPLOAD_DIR = "/tmp/studioai/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("")
async def transcribe_audio(file: UploadFile = File(...), language: str = "es"):
    """
    Transcribe el audio subido y devuelve el texto junto con los timestamps
    de cada palabra, listos para alimentar el editor de texto del frontend.
    """
    temp_path = os.path.join(UPLOAD_DIR, f"{uuid.uuid4()}_{file.filename}")
    with open(temp_path, "wb") as f:
        f.write(await file.read())

    result = transcribe_with_word_timestamps(temp_path, language=language)
    return result
