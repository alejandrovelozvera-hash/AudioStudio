"use client";

import { useRef } from "react";
import { useEditorStore } from "@/lib/store";
import { transcribeAudio } from "@/lib/api";

/**
 * TransportBar.tsx
 * ----------------
 * Barra superior del editor: subir audio, disparar la transcripción,
 * y mostrar el estado general (idle / procesando / listo).
 */
export default function TransportBar() {
  const inputRef = useRef<HTMLInputElement>(null);

  const status = useEditorStore((s) => s.status);
  const setStatus = useEditorStore((s) => s.setStatus);
  const setAudioUrl = useEditorStore((s) => s.setAudioUrl);
  const setAudioFile = useEditorStore((s) => s.setAudioFile);
  const setWords = useEditorStore((s) => s.setWords);

  const handleFile = async (file: File) => {
    setStatus("uploading");
    setAudioFile(file);
    setAudioUrl(URL.createObjectURL(file));

    try {
      setStatus("processing");
      const transcription = await transcribeAudio(file);

      setWords(
        transcription.words.map((w, i) => ({
          id: `${i}-${w.start}`,
          word: w.word,
          start: w.start,
          end: w.end,
          deleted: false,
        }))
      );
      setStatus("done");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <header className="flex items-center justify-between border-b border-studio-line px-6 py-4">
      <div className="flex items-center gap-3">
        <span className="font-display text-lg font-medium tracking-tight text-studio-bone">
          Studio<span className="text-studio-signal">AI</span>
        </span>
        <StatusPill status={status} />
      </div>

      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        <button
          onClick={() => inputRef.current?.click()}
          className="rounded-md bg-studio-signal px-4 py-2 text-sm font-medium text-studio-bg transition-opacity hover:opacity-90"
        >
          Subir audio
        </button>
      </div>
    </header>
  );
}

function StatusPill({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    idle: { label: "En espera", className: "text-studio-dim border-studio-line" },
    uploading: { label: "Subiendo…", className: "text-studio-processing border-studio-processing" },
    processing: { label: "Transcribiendo…", className: "text-studio-processing border-studio-processing" },
    done: { label: "Listo", className: "text-studio-signal border-studio-signal" },
    error: { label: "Error", className: "text-studio-cut border-studio-cut" },
  };
  const c = config[status] ?? config.idle;

  return (
    <span className={`rounded-full border px-2.5 py-0.5 font-mono text-xs ${c.className}`}>
      {c.label}
    </span>
  );
}
