import Link from "next/link";
import AnimatedWaveform from "@/components/AnimatedWaveform";
import ProcessAnimation from "@/components/ProcessAnimation";
import BeforeAfterPlayer from "@/components/BeforeAfterPlayer";
import EditorMockup from "@/components/EditorMockup";
import Reveal from "@/components/Reveal";
import StickyNav from "@/components/StickyNav";

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <StickyNav />
      <Hero />
      <Credibility />
      <BeforeAfter />
      <WhatIsIt />
      <EditorPreview />
      <Features />
      <HowItWorks />
      <FinalCta />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative mx-auto max-w-4xl px-6 pb-8 pt-20 text-center">
      <div
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full opacity-20 blur-[120px]"
        style={{ background: "radial-gradient(circle, #5EEAD4 0%, transparent 70%)" }}
      />
      <Reveal>
        <p className="mb-4 font-mono text-xs uppercase tracking-widest text-studio-signal">
          Grabacion - Mejora con IA - Edicion basada en texto
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <h1 className="mb-6 font-display text-5xl font-medium leading-tight tracking-tight text-studio-bone sm:text-6xl">
          Tu voz, con calidad de estudio.
        </h1>
      </Reveal>
      <Reveal delay={0.2}>
        <p className="mx-auto mb-10 max-w-2xl font-serif text-xl italic text-studio-dim">
          Graba una entrevista con el ruido de la calle de fondo. StudioAI lo limpia,
          te deja editar borrando palabras del texto, y exporta con calidad de estudio.
        </p>
      </Reveal>
      <Reveal delay={0.3}>
        <div className="mb-4 flex items-center justify-center gap-4">
          <Link href="/editor/demo" className="rounded-md bg-studio-signal px-6 py-3 text-sm font-medium text-studio-bg transition-transform hover:scale-105 hover:opacity-90">
            Probar el editor
          </Link>
          <Link href="/#como-funciona" className="rounded-md border border-studio-line px-6 py-3 text-sm text-studio-bone transition-colors hover:border-studio-signal hover:text-studio-signal">
            Ver como funciona
          </Link>
        </div>
      </Reveal>
      <Reveal delay={0.4}>
        <AnimatedWaveform />
      </Reveal>
    </section>
  );
}

function Credibility() {
  return (
    <section className="mx-auto max-w-2xl px-6 pb-16 text-center">
      <Reveal>
        <p className="font-serif text-base italic text-studio-dim">
          Hecho por Alejandro Veloz, cineasta y desarrollador. Nacio de la
          necesidad real de limpiar audio de entrevistas y documentales
          grabados en condiciones lejos de un estudio.
        </p>
      </Reveal>
    </section>
  );
}

function BeforeAfter() {
  return (
    <section className="border-y border-studio-line bg-studio-panel">
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <Reveal>
          <h2 className="mb-3 font-display text-3xl font-medium tracking-tight text-studio-bone">
            Escucha la diferencia
          </h2>
          <p className="mb-10 text-studio-dim">
            No lo describimos, lo escuchas. Este es el mismo clip, antes y despues.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <BeforeAfterPlayer />
        </Reveal>
      </div>
    </section>
  );
}

function WhatIsIt() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <Reveal>
        <h2 className="mb-4 font-display text-sm font-medium uppercase tracking-widest text-studio-signal">
          Por que existe StudioAI
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="font-serif text-2xl leading-relaxed text-studio-bone">
          Grabar en condiciones perfectas casi nunca es posible: hay ruido de
          calle, eco de sala, volumen desnivelado entre tomas. StudioAI hace
          el trabajo de post-produccion que normalmente le tomaria horas a un
          editor de audio, y te deja corregir el contenido con la misma
          facilidad con la que editas un documento de texto.
        </p>
      </Reveal>
    </section>
  );
}

function EditorPreview() {
  return (
    <section className="border-y border-studio-line bg-studio-panel">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center">
        <Reveal>
          <h2 className="mb-4 font-display text-3xl font-medium tracking-tight text-studio-bone">
            Un editor que se siente como un documento
          </h2>
          <p className="text-studio-dim">
            Cada palabra transcrita esta conectada a su posicion exacta en el
            audio. Borra una palabra del texto y ese fragmento desaparece del
            audio, con un pequeno cruce suave para que no se note el corte.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <EditorMockup />
        </Reveal>
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
      <Reveal>
        <h2 className="mb-12 text-center font-display text-3xl font-medium tracking-tight text-studio-bone">
          Que puedes hacer
        </h2>
      </Reveal>
      <div className="grid gap-6 sm:grid-cols-3">
        {FEATURES.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.12}>
            <div className="h-full rounded-lg border border-studio-line bg-studio-panel p-6 transition-all hover:-translate-y-1 hover:border-studio-signal/50">
              <h3 className="mb-2 font-display text-lg font-medium text-studio-bone">{f.title}</h3>
              <p className="text-sm leading-relaxed text-studio-dim">{f.description}</p>
            </div>
          </Reveal>
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
      <div className="mx-auto max-w-5xl px-6 py-20">
        <Reveal>
          <h2 className="mb-12 text-center font-display text-3xl font-medium tracking-tight text-studio-bone">
            Como funciona
          </h2>
        </Reveal>
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className="space-y-8">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.1}>
                <div className="flex gap-6">
                  <span className="font-mono text-2xl text-studio-signal">{s.n}</span>
                  <div>
                    <h3 className="mb-1 font-display text-base font-medium text-studio-bone">{s.title}</h3>
                    <p className="text-sm text-studio-dim">{s.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <ProcessAnimation />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24 text-center">
      <Reveal>
        <h2 className="mb-4 font-display text-3xl font-medium tracking-tight text-studio-bone">
          Empieza en segundos
        </h2>
        <p className="mb-8 text-studio-dim">
          Gratis por ahora. No necesitas cuenta ni instalar nada.
        </p>
        <Link href="/editor/demo" className="inline-block rounded-md bg-studio-signal px-8 py-3 text-sm font-medium text-studio-bg transition-transform hover:scale-105 hover:opacity-90">
          Abrir el editor
        </Link>
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-studio-line px-6 py-8 text-center">
      <p className="font-mono text-xs text-studio-dim">
        StudioAI, hecho por Alejandro Veloz
      </p>
    </footer>
  );
}