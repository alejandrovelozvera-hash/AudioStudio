"use client";

import { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js";
import { useEditorStore } from "@/lib/store";

/**
 * Waveform.tsx
 * ------------
 * Renderiza la forma de onda del audio. Las palabras marcadas como
 * "deleted" en el store se pintan como regiones semitransparentes color
 * "cut" sobre el waveform, dando feedback visual inmediato de qué se
 * eliminó, sin necesidad de recortar el audio real todavía.
 */
export default function Waveform() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const regionsRef = useRef<RegionsPlugin | null>(null);

  const audioUrl = useEditorStore((s) => s.audioUrl);
  const words = useEditorStore((s) => s.words);
  const hoveredWordId = useEditorStore((s) => s.hoveredWordId);
  const setCurrentTime = useEditorStore((s) => s.setCurrentTime);

  // Inicializa WaveSurfer una sola vez que hay audio
  useEffect(() => {
    if (!containerRef.current || !audioUrl) return;

    const regions = RegionsPlugin.create();

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "#8A8781",
      progressColor: "#5EEAD4",
      cursorColor: "#EAE6DE",
      height: 96,
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      url: audioUrl,
      plugins: [regions],
    });

    ws.on("timeupdate", (t) => setCurrentTime(t));

    wavesurferRef.current = ws;
    regionsRef.current = regions;

    return () => {
      ws.destroy();
    };
  }, [audioUrl, setCurrentTime]);

  // Redibuja las regiones de "corte" cada vez que cambian las palabras borradas
  useEffect(() => {
    const regions = regionsRef.current;
    if (!regions) return;

    regions.clearRegions();

    words
      .filter((w) => w.deleted)
      .forEach((w) => {
        regions.addRegion({
          start: w.start,
          end: w.end,
          color: "rgba(251, 107, 84, 0.35)", // studio-cut con transparencia
          drag: false,
          resize: false,
        });
      });

    // Resalta en el waveform la palabra que se está "hovering" en el texto
    if (hoveredWordId) {
      const hovered = words.find((w) => w.id === hoveredWordId && !w.deleted);
      if (hovered) {
        regions.addRegion({
          start: hovered.start,
          end: hovered.end,
          color: "rgba(94, 234, 212, 0.25)", // studio-signal con transparencia
          drag: false,
          resize: false,
        });
      }
    }
  }, [words, hoveredWordId]);

  const handlePlayPause = () => wavesurferRef.current?.playPause();

  return (
    <div className="rounded-lg border border-studio-line bg-studio-panel p-4">
      <div className="mb-3 flex items-center gap-3">
        <button
          onClick={handlePlayPause}
          className="rounded-full border border-studio-line px-4 py-1.5 text-sm text-studio-bone transition-colors hover:border-studio-signal hover:text-studio-signal"
        >
          Reproducir / Pausar
        </button>
        <span className="font-mono text-xs text-studio-dim">
          Las zonas coral marcan lo que se eliminó del texto
        </span>
      </div>
      <div ref={containerRef} />
    </div>
  );
}
