"""
enhance_router.py
------------------
Expone el pipeline de enhance como endpoint HTTP. La inferencia se ejecuta
en un job en segundo plano (BackgroundTasks aquí como ejemplo simple; en
producción usar Celery/RQ + worker con GPU dedicada, ver worker.py).
"""

import uuid
import os
from fastapi import APIRouter, UploadFile, File, BackgroundTasks, HTTPException
from fastapi.responses import FileResponse

from app.services.enhance import enhance_speech_file

router = APIRouter(prefix="/api/enhance", tags=["enhance"])

UPLOAD_DIR = "/tmp/studioai/uploads"
OUTPUT_DIR = "/tmp/studioai/outputs"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Registro en memoria del estado de los jobs (en producción: Redis)
_jobs: dict[str, dict] = {}


def _run_enhance_job(job_id: str, input_path: str, output_path: str, target_lufs: float):
    try:
        enhance_speech_file(input_path, output_path, target_lufs=target_lufs)
        _jobs[job_id] = {"status": "done", "output_path": output_path}
    except Exception as e:
        _jobs[job_id] = {"status": "error", "error": str(e)}


@router.post("")
async def enhance_audio(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    target_lufs: float = -16.0,
):
    """Sube un audio y encola el job de mejora (denoise + enhance + normalize)."""
    job_id = str(uuid.uuid4())
    input_path = os.path.join(UPLOAD_DIR, f"{job_id}_{file.filename}")
    output_path = os.path.join(OUTPUT_DIR, f"{job_id}_enhanced.wav")

    with open(input_path, "wb") as f:
        f.write(await file.read())

    _jobs[job_id] = {"status": "processing"}
    background_tasks.add_task(_run_enhance_job, job_id, input_path, output_path, target_lufs)

    return {"job_id": job_id, "status": "processing"}


@router.get("/jobs/{job_id}")
async def get_job_status(job_id: str):
    job = _jobs.get(job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Job no encontrado")
    return job


@router.get("/download/{job_id}")
async def download_enhanced_audio(job_id: str):
    job = _jobs.get(job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Job no encontrado")
    if job.get("status") != "done":
        raise HTTPException(status_code=409, detail="El job todavía no ha terminado")

    return FileResponse(
        job["output_path"],
        media_type="audio/wav",
        filename=f"{job_id}_enhanced.wav",
    )
