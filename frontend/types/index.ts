export interface Word {
  id: string;       // índice/uuid estable para React keys
  word: string;
  start: number;    // segundos
  end: number;       // segundos
  deleted: boolean;  // true si el usuario lo borró del texto (soft-delete)
}

export interface TranscriptionResult {
  text: string;
  words: { word: string; start: number; end: number }[];
  detected_language: string;
}

export type ProcessingStatus = "idle" | "uploading" | "processing" | "done" | "error";

export interface EnhanceJobStatus {
  status: "processing" | "done" | "error";
  output_path?: string;
  error?: string;
}
