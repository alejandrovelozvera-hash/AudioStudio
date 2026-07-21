import { TranscriptionResult, EnhanceJobStatus } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function transcribeAudio(file: File, language = "es"): Promise<TranscriptionResult> {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${API_BASE}/api/transcribe?language=${language}`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) throw new Error("Fallo la transcripción");
  return res.json();
}

export async function enhanceAudio(file: File, targetLufs = -16): Promise<{ job_id: string }> {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${API_BASE}/api/enhance?target_lufs=${targetLufs}`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) throw new Error("Fallo al encolar el job de mejora");
  return res.json();
}

export async function pollEnhanceJob(jobId: string): Promise<EnhanceJobStatus> {
  const res = await fetch(`${API_BASE}/api/enhance/jobs/${jobId}`);
  if (!res.ok) throw new Error("Job no encontrado");
  return res.json();
}

/**
 * Hace polling del job de enhance hasta que termine (done o error).
 * Uso: const result = await waitForEnhance(jobId)
 */
export async function waitForEnhance(jobId: string, intervalMs = 1500): Promise<EnhanceJobStatus> {
  return new Promise((resolve, reject) => {
    const tick = async () => {
      try {
        const status = await pollEnhanceJob(jobId);
        if (status.status === "done") return resolve(status);
        if (status.status === "error") return reject(new Error(status.error));
        setTimeout(tick, intervalMs);
      } catch (e) {
        reject(e);
      }
    };
    tick();
  });
}
