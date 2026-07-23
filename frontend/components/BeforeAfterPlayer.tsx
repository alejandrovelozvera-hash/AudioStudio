"use client";

import { useRef, useState } from "react";

/**
 * BeforeAfterPlayer.tsx
 * -----------------------
 * Reproductor comparativo: un solo boton de play que alterna entre el
 * clip "ruidoso" y el clip "mejorado" del mismo audio, para que la
 * persona escuche la diferencia real en lugar de solo leer sobre ella.
 * Requiere dos archivos en /public/audio: noisy-sample.mp3 y clean-sample.mp3
 */
export default function BeforeAfterPlayer() {
  const [mode, setMode] = useState<"noisy" | "clean">("noisy");
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const src = mode === "noisy" ? "/audio/noisy-sample.mp3" : "/audio/clean-sample.mp3";

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  const switchMode = (next: "noisy" | "clean") => {
    const wasPlaying = playing;
    const time = audioRef.current?.currentTime ?? 0;
    setMode(next);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.currentTime = time;
        if (wasPlaying) audioRef.current.play();
      }
    }, 50);
  };

  return (
    <div className="rounded-lg border border-studio-line bg-studio-panel p-6">
      <audio
        ref={audioRef}
        src={src}
        onEnded={() => setPlaying(false)}
      />
      <div className="mb-5 flex items-center justify-center gap-3">
        <button
          onClick={() => switchMode("noisy")}
          className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
            mode === "noisy"
              ? "bg-studio-cut/20 text-studio-cut"
              : "text-studio-dim hover:text-studio-bone"
          }`}
        >
          Original
        </button>
        <button
          onClick={() => switchMode("clean")}
          className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
            mode === "clean"
              ? "bg-studio-signal/20 text-studio-signal"
              : "text-studio-dim hover:text-studio-bone"
          }`}
        >
          Con StudioAI
        </button>
      </div>

      <div className="flex items-center justify-center">
        <button
          onClick={togglePlay}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-studio-signal text-studio-bg transition-transform hover:scale-105"
          aria-label={playing ? "Pausar" : "Reproducir"}
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
      </div>

      <p className="mt-4 text-center font-mono text-xs text-studio-dim">
        Mismo audio, antes y despues de aplicar la mejora IA
      </p>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
      <path d="M4 2.5v13l11-6.5-11-6.5z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
      <rect x="4" y="3" width="3.5" height="12" />
      <rect x="10.5" y="3" width="3.5" height="12" />
    </svg>
  );
}