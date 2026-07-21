"use client";

import { useEditorStore } from "@/lib/store";
import { Word } from "@/types";

/**
 * TextEditor.tsx
 * --------------
 * El corazón de la "edición basada en texto". Cada palabra es un token
 * clickeable: un clic la marca como eliminada (soft-delete, tachada +
 * atenuada) y automáticamente resalta su rango correspondiente en el
 * waveform (vía el store compartido). Un pequeño "hilo" vertical bajo
 * cada palabra referencia visualmente su timestamp exacto — la idea de
 * que el texto y el audio son la misma cosa vista desde dos ángulos.
 */
export default function TextEditor() {
  const words = useEditorStore((s) => s.words);
  const hoveredWordId = useEditorStore((s) => s.hoveredWordId);
  const toggleWordDeleted = useEditorStore((s) => s.toggleWordDeleted);
  const setHoveredWordId = useEditorStore((s) => s.setHoveredWordId);

  if (words.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-studio-line p-10 text-center">
        <p className="font-serif text-lg italic text-studio-dim">
          Sube un audio para transcribirlo. El texto aparecerá aquí, editable.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-studio-line bg-studio-panel p-6">
      <p className="mb-4 font-mono text-xs uppercase tracking-wide text-studio-dim">
        Transcripción — clic en una palabra para eliminarla del audio
      </p>
      <div className="flex flex-wrap gap-x-1 gap-y-3 font-serif text-xl leading-relaxed">
        {words.map((w) => (
          <WordToken
            key={w.id}
            word={w}
            isHovered={hoveredWordId === w.id}
            onToggle={() => toggleWordDeleted(w.id)}
            onHover={(hovering) => setHoveredWordId(hovering ? w.id : null)}
          />
        ))}
      </div>
    </div>
  );
}

function WordToken({
  word,
  isHovered,
  onToggle,
  onHover,
}: {
  word: Word;
  isHovered: boolean;
  onToggle: () => void;
  onHover: (hovering: boolean) => void;
}) {
  return (
    <button
      onClick={onToggle}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      className="group relative inline-flex flex-col items-center px-0.5 transition-colors"
      title={`${word.start.toFixed(2)}s – ${word.end.toFixed(2)}s`}
    >
      <span
        className={[
          "transition-all",
          word.deleted
            ? "text-studio-cut/50 line-through decoration-studio-cut"
            : isHovered
              ? "text-studio-signal"
              : "text-studio-bone group-hover:text-studio-signal/80",
        ].join(" ")}
      >
        {word.word}
      </span>

      {/* El "hilo" que conecta visualmente la palabra con su posición temporal */}
      <span
        className={[
          "mt-1 h-2 w-px transition-colors",
          word.deleted ? "bg-studio-cut/40" : isHovered ? "bg-studio-signal" : "bg-studio-line",
        ].join(" ")}
      />
    </button>
  );
}
