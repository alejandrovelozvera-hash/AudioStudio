"use client";

import { useState } from "react";
import { enhanceAudio, waitForEnhance } from "@/lib/api";

/**
 * EnhancePanel.tsx
 * -----------------
 * Panel para disparar el pipeline de "Enhance Speech" (denoise + reparación
 * de timbre + normalización de volumen) sobre el audio actual.
 */
export default function EnhancePanel({ audioFile }: { audioFile: File | null }) {
  const [targetLufs, setTargetLufs] = useState(-16);
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleEnhance = async () => {
    if (!audioFile) return;
    setStatus("processing");
    try {
      const { job_id } = await enhanceAudio(audioFile, targetLufs);
      await waitForEnhance(job_id);
      setResultUrl(`${process.env.NEXT_PUBLIC_API_URL}/api/enhance/download/${job_id}`);
      setStatus("done");
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  };

  return (
    <aside className="w-72 shrink-0 rounded-lg border border-studio-line bg-studio-panel p-5">
      <h2 className="mb-1 font-display text-sm font-medium text-studio-bone">Mejorar audio</h2>
      <p className="mb-5 text-xs text-studio-dim">
        Elimina ruido de fondo, reverb de sala y nivela el volumen automáticamente.
      </p>

      <label className="mb-1 block font-mono text-xs text-studio-dim">
        Nivel objetivo (LUFS)
      </label>
      <input
        type="range"
        min={-24}
        max={-12}
        step={1}
        value={targetLufs}
        onChange={(e) => setTargetLufs(Number(e.target.value))}
        className="mb-1 w-full accent-studio-signal"
      />
      <div className="mb-5 font-mono text-xs text-studio-bone">{targetLufs} LUFS</div>

      <button
        onClick={handleEnhance}
        disabled={!audioFile || status === "processing"}
        className="w-full rounded-md bg-studio-signal py-2 text-sm font-medium text-studio-bg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {status === "processing" ? "Procesando…" : "Aplicar mejora IA"}
      </button>

      {status === "error" && (
        <p className="mt-3 text-xs text-studio-cut">
          No se pudo procesar el audio. Intenta de nuevo.
        </p>
      )}

      {status === "done" && resultUrl && (
        <a
          href={resultUrl}
          download
          className="mt-3 block text-center text-xs text-studio-signal underline underline-offset-4"
        >
          Descargar audio mejorado
        </a>
      )}
    </aside>
  );
}
