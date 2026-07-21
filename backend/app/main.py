"""
main.py
-------
Entry point de la API. Levantar con:
    uvicorn app.main:app --reload --port 8000
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import enhance_router, transcribe_router, edit_router

app = FastAPI(
    title="StudioAI Backend",
    description="API de procesamiento de audio con IA",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(enhance_router.router)
app.include_router(transcribe_router.router)
app.include_router(edit_router.router)


@app.get("/health")
async def health_check():
    return {"status": "ok"}