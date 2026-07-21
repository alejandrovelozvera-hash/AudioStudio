"""
edit_router.py
---------------
Recibe la EDL construida por el frontend (a partir de qué palabras el
usuario dejó/borró en el editor de texto) y renderiza el audio final.
"""

import os
from fastapi import APIRouter
from fastapi.responses import FileResponse

from app.services.text_edit import EditDecisionList, render_edl_to_audio

router = APIRouter(prefix="/api/edit", tags=["edit"])

OUTPUT_DIR = "/tmp/studioai/outputs"
os.makedirs(OUTPUT_DIR, exist_ok=True)


@router.post("/render")
async def render_edit(source_audio_path: str, edl: EditDecisionList):
    """
    Args:
        source_audio_path: ruta (en el servidor) del audio original ya subido
        edl: rangos de tiempo a conservar, generados por el frontend a partir
             de las palabras que el usuario dejó en el texto tras editar
    """
    output_path = os.path.join(OUTPUT_DIR, "edited_render.wav")
    render_edl_to_audio(source_audio_path, edl, output_path)

    return FileResponse(output_path, media_type="audio/wav", filename="edited_render.wav")
