"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WORDS = ["Hola", "esto", "eh", "es", "una", "prueba"];
const REMOVED_INDEX = 2;
const STAGE_DURATION = 2200;

type Stage = 0 | 1 | 2 | 3;

/**
 * ProcessAnimation.tsx
 * ---------------------
 * Storyboard animado en bucle de 4 etapas, cada una mapeada a un paso de
 * "Como funciona": grabar -> transcribir -> editar texto -> limpiar audio.
 * Se auto-avanza sola, dando una demostracion visual sin necesidad de
 * audio real ni interaccion del usuario.
 */
export default function ProcessAnimation() {
  const [stage, setStage] = useState<Stage>(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStage((s) => ((s + 1) % 4) as Stage);
    }, STAGE_DURATION);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="rounded-lg border border-studio-line bg-studio-panel p-8">
      <div className="mb-6 flex h-32 items-center justify-center">
        <AnimatePresence mode="wait">
          {stage === 0 && <RawWaveform key="raw" />}
          {stage === 1 && <TranscribingText key="transcribing" />}
          {stage === 2 && <EditingText key="editing" />}
          {stage === 3 && <CleanWaveform key="clean" />}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              stage === i ? "w-8 bg-studio-signal" : "w-1.5 bg-studio-line"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function RawWaveform() {
  const bars = Array.from({ length: 28 }, (_, i) => i);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center gap-1"
    >
      {bars.map((i) => (
        <motion.div
          key={i}
          className="w-1.5 rounded-full bg-studio-dim"
          animate={{ height: [6, 14 + ((i * 37) % 40), 6] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.03 }}
        />
      ))}
    </motion.div>
  );
}

function TranscribingText() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-wrap items-center justify-center gap-2 font-serif text-2xl text-studio-bone"
    >
      {WORDS.map((w, i) => (
        <motion.span
          key={w}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15 }}
        >
          {w}
        </motion.span>
      ))}
    </motion.div>
  );
}

function EditingText() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-wrap items-center justify-center gap-2 font-serif text-2xl"
    >
      {WORDS.map((w, i) => (
        <motion.span
          key={w}
          animate={
            i === REMOVED_INDEX
              ? { color: "#FB6B54", opacity: 0.4, textDecoration: "line-through" }
              : { color: "#EAE6DE" }
          }
          transition={{ delay: i === REMOVED_INDEX ? 0.6 : 0 }}
        >
          {w}
        </motion.span>
      ))}
    </motion.div>
  );
}

function CleanWaveform() {
  const bars = Array.from({ length: 24 }, (_, i) => i);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center gap-1"
    >
      {bars.map((i) => (
        <motion.div
          key={i}
          className="w-1.5 rounded-full bg-studio-signal"
          animate={{ height: [10, 18 + ((i * 23) % 24), 10] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.02 }}
        />
      ))}
    </motion.div>
  );
}