import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Nav />
      <Hero />
      <WhatIsIt />
      <Features />
      <HowItWorks />
      <FinalCta />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
      <span className="font-display text-lg font-medium tracking-tight text-studio-bone">
        Studio<span className="text-studio-signal">AI</span>
      </span>
      <Link href="/editor/demo" className="rounded-full border border-studio-line px-4 py-1.5 text-sm text-studio-bone transition-colors hover:border-studio-signal hover:text-studio-signal">
        Abrir editor
      </Link>
    </header>
  );
}

function Hero() {
  return (
    <section className="mx-auto max-w-4xl px-6 pb-20 pt-16 text-center">
      <p className="mb-4 font-mono text-xs uppercase tracking-widest text-studio-signal">
        Grabacion - Mejora con IA - Edicion basada en texto
      </p>
      <h1 className="mb-6 font-display text-5xl font-medium leading-tight tracking-tight text-studio-bone sm:text-6xl">
        Tu voz, con calidad de estudio.
      </h1>
      <p className="mx-auto mb-10 max-w-2xl font-serif text-xl italic text-studio-dim">
        StudioAI limpia el ruido de fondo, repara el timbre de tu voz y te deja editar el audio simplemente borrando palabras del texto.
      </p>
      <div className="flex items-center justify-center gap-4">
        <Link href="/editor/demo" className="rounded-md bg-studio-signal px-6 py-3 text-sm font-medium text-studio-bg transition-opacity hover:opacity-90">
          Probar el editor
        </Link>
        <Link href="/#como-funciona" className="rounded-md border border-studio-line px-6 py-3 text-sm text-studio-bone transition-colors hover:border-studio-signal hover:text-studio-signal">
          Ver como funciona
        </Link>
      </div>
    </section>
  );
}

function WhatIsIt() {
  return (
    <section className="border-y border-studio-line bg-studio-panel">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <h2 className="mb-4 font-display text-sm font-medium uppercase tracking-widest text-studio-signal">
          Que es StudioAI
        </h2>
        <p className="font-serif text-2xl leading-relaxed text-studio-bone">
          Es una herramienta de grabacion y edicion de audio que usa inteligencia artificial para hacer el trabajo pesado por ti: elimina el ruido de fondo, nivela el volumen automaticamente y transcribe todo lo que dices, para que edites tu audio con la misma facilidad con la que editas un texto.
        </p>
      </div>
    </section>
  );
}

const FEATURES = [
  { title: "Mejora de audio con IA", description: "Elimina ruido de fondo, reverb de sala y nivela el volumen automaticamente al estandar de podcast, con un clic." },
  { title: "Edicion basada en texto", description: "Transcribimos tu audio automaticamente. Borra una palabra del texto y el fragmento correspondiente desaparece del audio." },
  { title: "Calidad de estudio", description: "Todo el procesamiento exporta en 48kHz / 24-bit, el estandar profesional de post-produccion de audio." },
];

function Features() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="mb-12 text-center font-display text-3xl font-medium tracking-tight text-studio-bone">
        Que puedes hacer
      </h2>
      <div className="grid gap-6 sm:grid-cols-3">
        {FEATURES.map((f) => (
          <div key={f.title} className="rounded-lg border border-studio-line bg-studio-panel p-6 transition-colors hover:border-studio-signal/50">
            <h3 className="mb-2 font-display text-lg font-medium text-studio-bone">{f.title}</h3>
            <p className="text-sm leading-relaxed text-studio-dim">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const STEPS = [
  { n: "01", title: "Sube tu audio", description: "Cualquier grabacion: voz, podcast, entrevista." },
  { n: "02", title: "Se transcribe solo", description: "En segundos aparece el texto, palabra por palabra, sincronizado con el audio." },
  { n: "03", title: "Edita el texto", description: "Borra una palabra y ese tramo se elimina del audio, sin tocar una forma de onda." },
  { n: "04", title: "Aplica la mejora IA", description: "Un clic limpia el ruido y nivela el volumen a calidad de estudio." },
];

function HowItWorks() {
  return (
    <section id="como-funciona" className="border-y border-studio-line bg-studio-panel">
      <div className="mx-auto max-w-4xl px-6 py-20">
        <h2 className="mb-12 text-center font-display text-3xl font-medium tracking-tight text-studio-bone">
          Como funciona
        </h2>
        <div className="space-y-8">
          {STEPS.map((s) => (
            <div key={s.n} className="flex gap-6">
              <span className="font-mono text-2xl text-studio-signal">{s.n}</span>
              <div>
                <h3 className="mb-1 font-display text-base font-medium text-studio-bone">{s.title}</h3>
                <p className="text-sm text-studio-dim">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h2 className="mb-4 font-display text-3xl font-medium tracking-tight text-studio-bone">
        Empieza en segundos
      </h2>
      <p className="mb-8 text-studio-dim">
        No necesitas cuenta ni instalar nada. Sube un audio y prueba el editor ahora mismo.
      </p>
      <Link href="/editor/demo" className="inline-block rounded-md bg-studio-signal px-8 py-3 text-sm font-medium text-studio-bg transition-opacity hover:opacity-90">
        Abrir el editor
      </Link>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-studio-line px-6 py-8 text-center">
      <p className="font-mono text-xs text-studio-dim">
        StudioAI, grabacion, mejora y edicion de audio con IA
      </p>
    </footer>
  );
}