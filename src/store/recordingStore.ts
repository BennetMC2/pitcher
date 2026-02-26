import { create } from "zustand";
import type { RecordingPhase, MediaPipeFrameData } from "@/types/feedback.types";

interface RecordingStore {
  phase: RecordingPhase;
  countdownValue: number;
  recordingSeconds: number;
  videoBlob: Blob | null;
  videoUrl: string | null;
  mediaPipeFrames: MediaPipeFrameData[];
  sessionId: string | null;
  error: string | null;

  setPhase: (phase: RecordingPhase) => void;
  setCountdownValue: (v: number) => void;
  setRecordingSeconds: (v: number) => void;
  setVideoBlob: (blob: Blob, url: string) => void;
  addFrame: (frame: MediaPipeFrameData) => void;
  setSessionId: (id: string) => void;
  setError: (err: string | null) => void;
  reset: () => void;
}

const initialState = {
  phase: "idle" as RecordingPhase,
  countdownValue: 5,
  recordingSeconds: 0,
  videoBlob: null,
  videoUrl: null,
  mediaPipeFrames: [],
  sessionId: null,
  error: null,
};

export const useRecordingStore = create<RecordingStore>((set) => ({
  ...initialState,

  setPhase: (phase) => set({ phase }),
  setCountdownValue: (v) => set({ countdownValue: v }),
  setRecordingSeconds: (v) => set({ recordingSeconds: v }),
  setVideoBlob: (blob, url) => set({ videoBlob: blob, videoUrl: url }),
  addFrame: (frame) =>
    set((state) => ({
      mediaPipeFrames: [...state.mediaPipeFrames, frame],
    })),
  setSessionId: (id) => set({ sessionId: id }),
  setError: (err) => set({ error: err }),
  reset: () => set(initialState),
}));
