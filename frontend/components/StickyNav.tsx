"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * StickyNav.tsx
 * -------------
 * Barra de navegacion fija que gana fondo con blur al hacer scroll,
 * en vez de quedarse siempre transparente o siempre solida.
 */
export default function StickyNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-studio-line bg-studio-bg/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <span className="font-display text-lg font-medium tracking-tight text-studio-bone">
          Studio<span className="text-studio-signal">AI</span>
        </span>
        <Link
          href="/editor/demo"
          className="rounded-full border border-studio-line px-4 py-1.5 text-sm text-studio-bone transition-colors hover:border-studio-signal hover:text-studio-signal"
        >
          Abrir editor
        </Link>
      </div>
    </header>
  );
}