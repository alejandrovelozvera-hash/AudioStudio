"""
worker.py
---------
Worker de Celery para producción: procesa los jobs de IA (enhance) en una
cola separada, idealmente en una máquina con GPU dedicada, para no bloquear
la API principal ni competir por recursos con requests HTTP normales.

Levantar con:
    celery -A worker worker --loglevel=info --concurrency=1

(concurrency=1 es intencional: los modelos de IA usan VRAM, correr varios
en paralelo en la misma GPU normalmente satura la memoria)
"""

from celery import Celery

from app.services.enhance import enhance_speech_file

celery_app = Celery(
    "studioai_worker",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/0",
)


@celery_app.task(name="tasks.enhance_audio")
def enhance_audio_task(input_path: str, output_path: str, target_lufs: float = -16.0) -> str:
    return enhance_speech_file(input_path, output_path, target_lufs=target_lufs)
