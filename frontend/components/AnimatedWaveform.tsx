"use client";

import { motion } from "framer-motion";

export default function AnimatedWaveform() {
  const bars = Array.from({ length: 40 }, (_, i) => i);

  return (
    <div className="flex h-24 items-center justify-center gap-1">
      {bars.map((i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full bg-studio-signal"
          initial={{ height: 8 }}
          animate={{
            height: [8, 20 + Math.sin(i * 0.5) * 40 + 20, 8],
          }}
          transition={{
            duration: 1.6 + (i % 5) * 0.15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.04,
          }}
        />
      ))}
    </div>
  );
}