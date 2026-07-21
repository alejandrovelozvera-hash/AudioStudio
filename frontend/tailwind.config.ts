import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        studio: {
          bg: "#0B0B0C",        // fondo principal, casi negro
          panel: "#141416",     // paneles ligeramente elevados
          line: "#232326",      // divisores, bordes sutiles
          bone: "#EAE6DE",      // texto principal, hueso cálido
          dim: "#8A8781",       // texto secundario
          signal: "#5EEAD4",    // acento principal (waveform / activo)
          cut: "#FB6B54",       // palabra eliminada / corte
          processing: "#F5B759", // estado "procesando IA"
        },
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        serif: ["var(--font-newsreader)", "serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
