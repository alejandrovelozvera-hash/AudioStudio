"use client";

import { motion } from "framer-motion";

/**
 * EditorMockup.tsx
 * -----------------
 * Ilustracion estilizada del editor real (no una captura), para darle
 * al landing una vista previa de la herramienta sin depender de screenshots
 * que se desactualizan cada vez que cambia el diseno real.
 */
export default function EditorMockup() {
  const words = ["Hola", "a", "todos", "eh", "bienvenidos", "al", "podcast"];

  return (
    <div className="overflow-hidden rounded-xl border border-studio-line bg-studio-panel shadow-2xl shadow-studio-signal/5">
      <div className="flex items-center gap-2 border-b border-studio-line px-4 py-3">
        <div className="h-2.5 w-2.5 rounded-full bg-studio-cut/60" />
        <div className="h-2.5 w-2.5 rounded-full bg-studio-processing/60" />
        <div className="h-2.5 w-2.5 rounded-full bg-studio-signal/60" />
        <span className="ml-3 font-mono text-xs text-studio-dim">studioai.app/editor</span>
      </div>

      <div className="space-y-6 p-6">
        <div className="flex h-16 items-end justify-center gap-1">
          {Array.from({ length: 32 }, (_, i) => (
            <motion.div
              key={i}
              className="w-1 rounded-full bg-studio-dim"
              animate={{ height: [4, 8 + ((i * 17) % 36), 4] }}
              transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.02 }}
            />
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-x-2 gap-y-2 font-serif text-lg">
          {words.map((w, i) => (
            <span
              key={w}
              className={i === 3 ? "text-studio-cut/50 line-through" : "text-studio-bone"}
            >
              {w}
            </span>
          ))}
        </div>

        <div className="flex justify-center">
          <span className="rounded-md bg-studio-signal px-5 py-2 text-xs font-medium text-studio-bg">
            Aplicar mejora IA
          </span>
        </div>
      </div>
    </div>
  );
}