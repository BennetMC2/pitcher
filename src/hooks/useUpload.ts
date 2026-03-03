"use client";

import { useState } from "react";
import { useRecordingStore } from "@/store/recordingStore";

interface UploadResult {
  sessionId: string;
}

export function useUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { videoBlob, mediaPipeFrames, recordingSeconds, goal, setSessionId, setPhase, setError: storeSetError } =
    useRecordingStore();

  async function upload(title = "Untitled Pitch", browserTranscript?: string): Promise<UploadResult | null> {
    // Read from store directly to avoid stale closure (e.g. resume flow sets blob then calls upload immediately)
    const currentState = useRecordingStore.getState();
    const blob = currentState.videoBlob;
    const currentGoal = currentState.goal;
    const currentDuration = currentState.recordingSeconds;

    if (!blob) {
      setError("No recording to upload");
      return null;
    }

    setUploading(true);
    setError(null);

    try {
      // 1. Create session + get signed upload URL
      const sessionRes = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, duration_seconds: currentDuration, goal: currentGoal ?? "startup_pitch" }),
      });

      if (!sessionRes.ok) {
        const err = await sessionRes.json();
        throw new Error(err.error ?? "Failed to create session");
      }

      const { sessionId, uploadUrl, videoPath } = await sessionRes.json();
      setSessionId(sessionId);

      // 2. Upload video directly to Supabase Storage
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": "video/webm" },
        body: blob,
      });

      if (!uploadRes.ok) throw new Error("Video upload failed");

      // 3. Upload body language JSON
      if (mediaPipeFrames.length > 0) {
        const blRes = await fetch("/api/upload/body-language", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, frames: mediaPipeFrames }),
        });
        if (!blRes.ok) console.warn("Body language upload failed (non-fatal)");
      }

      // 4. Trigger analysis (returns 202, pipeline runs in background via after())
      await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, videoPath, browserTranscript }),
      });

      setPhase("processing");
      return { sessionId };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      setError(msg);
      storeSetError(msg);
      return null;
    } finally {
      setUploading(false);
    }
  }

  return { upload, uploading, error };
}
