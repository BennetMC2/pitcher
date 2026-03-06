"use client";

import { useState } from "react";
import { useRecordingStore } from "@/store/recordingStore";

interface UploadResult {
  sessionId: string;
}

const MAX_RETRIES = 3;
const RETRY_DELAYS = [1000, 2000, 4000]; // exponential backoff

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = MAX_RETRIES
): Promise<Response> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, options);
      if (res.ok || attempt === retries) return res;
      // Retry on 5xx server errors
      if (res.status >= 500) {
        await new Promise((r) => setTimeout(r, RETRY_DELAYS[attempt] ?? 4000));
        continue;
      }
      return res; // 4xx errors are not retryable
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise((r) => setTimeout(r, RETRY_DELAYS[attempt] ?? 4000));
    }
  }
  throw new Error("Upload failed after retries");
}

export function useUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    videoBlob,
    mediaPipeFrames,
    recordingSeconds,
    goal,
    setSessionId,
    setPhase,
    setError: storeSetError,
    setUploadProgress,
    setUploadError,
  } = useRecordingStore();

  async function upload(
    title = "Untitled Pitch",
    browserTranscript?: string
  ): Promise<UploadResult | null> {
    // Read from store directly to avoid stale closure
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
    setUploadError(null);
    setUploadProgress(0);

    try {
      // Step 1: Create session + get signed upload URL (10%)
      setUploadProgress(10);
      const sessionRes = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          duration_seconds: currentDuration,
          goal: currentGoal ?? "startup_pitch",
        }),
      });

      if (!sessionRes.ok) {
        const err = await sessionRes.json();
        throw new Error(err.error ?? "Failed to create session");
      }

      const { sessionId, uploadUrl } = await sessionRes.json();
      setSessionId(sessionId);
      setUploadProgress(20);

      // Step 2: Upload video to Supabase Storage with retry (20% → 70%)
      const uploadRes = await fetchWithRetry(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": "video/webm" },
        body: blob,
      });

      if (!uploadRes.ok) throw new Error("Video upload failed after retries");
      setUploadProgress(70);

      // Step 3: Upload body language JSON (70% → 80%)
      if (mediaPipeFrames.length > 0) {
        const blRes = await fetch("/api/upload/body-language", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, frames: mediaPipeFrames }),
        });
        if (!blRes.ok) console.warn("Body language upload failed (non-fatal)");
      }
      setUploadProgress(80);

      // Step 4: Trigger analysis (80% → 100%)
      await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, browserTranscript }),
      });

      setUploadProgress(100);
      setPhase("processing");
      return { sessionId };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      setError(msg);
      storeSetError(msg);
      setUploadError(msg);
      return null;
    } finally {
      setUploading(false);
    }
  }

  async function retryUpload(
    title = "Untitled Pitch",
    browserTranscript?: string
  ): Promise<UploadResult | null> {
    setUploadError(null);
    storeSetError(null);
    return upload(title, browserTranscript);
  }

  return { upload, retryUpload, uploading, error };
}
