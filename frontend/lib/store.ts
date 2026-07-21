import { create } from "zustand";
import { Word, ProcessingStatus } from "@/types";

interface EditorState {
  audioUrl: string | null;
  audioFile: File | null;
  words: Word[];
  currentTime: number;
  hoveredWordId: string | null;
  status: ProcessingStatus;

  setAudioFile: (file: File) => void;
  setAudioUrl: (url: string) => void;
  setWords: (words: Word[]) => void;
  setCurrentTime: (t: number) => void;
  setHoveredWordId: (id: string | null) => void;
  setStatus: (s: ProcessingStatus) => void;
  toggleWordDeleted: (id: string) => void;

  /** Devuelve los rangos [start, end] de las palabras NO borradas, fusionando contiguas */
  getKeepRanges: () => { start: number; end: number }[];
}

export const useEditorStore = create<EditorState>((set, get) => ({
  audioUrl: null,
  audioFile: null,
  words: [],
  currentTime: 0,
  hoveredWordId: null,
  status: "idle",

  setAudioFile: (file) => set({ audioFile: file }),
  setAudioUrl: (url) => set({ audioUrl: url }),
  setWords: (words) => set({ words }),
  setCurrentTime: (t) => set({ currentTime: t }),
  setHoveredWordId: (id) => set({ hoveredWordId: id }),
  setStatus: (s) => set({ status: s }),

  toggleWordDeleted: (id) =>
    set((state) => ({
      words: state.words.map((w) => (w.id === id ? { ...w, deleted: !w.deleted } : w)),
    })),

  getKeepRanges: () => {
    const kept = get().words.filter((w) => !w.deleted);
    const ranges: { start: number; end: number }[] = [];

    for (const w of kept) {
      const last = ranges[ranges.length - 1];
      if (last && Math.abs(w.start - last.end) < 0.05) {
        last.end = w.end;
      } else {
        ranges.push({ start: w.start, end: w.end });
      }
    }
    return ranges;
  },
}));
