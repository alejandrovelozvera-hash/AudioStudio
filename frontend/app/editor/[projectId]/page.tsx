"use client";

import TransportBar from "@/components/TransportBar";
import Waveform from "@/components/Waveform";
import TextEditor from "@/components/TextEditor";
import EnhancePanel from "@/components/EnhancePanel";
import { useEditorStore } from "@/lib/store";

export default function EditorPage() {
  const audioUrl = useEditorStore((s) => s.audioUrl);
  const audioFile = useEditorStore((s) => s.audioFile);

  return (
    <div className="min-h-screen">
      <TransportBar />

      <main className="mx-auto flex max-w-6xl gap-6 px-6 py-8">
        <div className="flex-1 space-y-6">
          {audioUrl && <Waveform />}
          <TextEditor />
        </div>

        <EnhancePanel audioFile={audioFile} />
      </main>
    </div>
  );
}
