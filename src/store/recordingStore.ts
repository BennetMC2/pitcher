import { create } from "zustand";
import type { RecordingPhase, MediaPipeFrameData } from "@/types/feedback.types";
import type { PitchGoal } from "@/lib/constants";

interface RecordingStore {
  phase: RecordingPhase;
  countdownValue: number;
  recordingSeconds: number;
  videoBlob: Blob | null;
  videoUrl: string | null;
  mediaPipeFrames: MediaPipeFrameData[];
  sessionId: string | null;
  error: string | null;
  goal: PitchGoal | null;

  setPhase: (phase: RecordingPhase) => void;
  setCountdownValue: (v: number) => void;
  setRecordingSeconds: (v: number) => void;
  setVideoBlob: (blob: Blob, url: string) => void;
  addFrame: (frame: MediaPipeFrameData) => void;
  setSessionId: (id: string) => void;
  setError: (err: string | null) => void;
  setGoal: (goal: PitchGoal) => void;
  reset: () => void;
}

const initialState = {
  phase: "idle" as RecordingPhase,
  countdownValue: 5,
  recordingSeconds: 0,
  videoBlob: null as Blob | null,
  videoUrl: null as string | null,
  mediaPipeFrames: [] as MediaPipeFrameData[],
  sessionId: null as string | null,
  error: null as string | null,
  goal: null as PitchGoal | null,
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
  setGoal: (goal) => set({ goal }),
  reset: () => set(initialState),
}));
