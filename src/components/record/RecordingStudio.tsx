"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useRecording } from "@/hooks/useRecording";
import { useUpload } from "@/hooks/useUpload";
// import { useMediaPipe } from "@/hooks/useMediaPipe";
import { useTranscription } from "@/hooks/useTranscription";
import { useRecordingStore } from "@/store/recordingStore";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import {
  Video,
  StopCircle,
  RotateCcw,
  Upload,
  Mic,
  AlertCircle,
  Sparkles,
} from "lucide-react";

interface RecordingStudioProps {
  maxSeconds: number;
  canRecord: boolean;
  onUpgradeNeeded: () => void;
  goal?: string | null;
  mode?: "authenticated" | "anonymous";
  onAuthRequired?: () => void;
}

export function RecordingStudio({
  maxSeconds,
  canRecord,
  onUpgradeNeeded,
  goal,
  mode = "authenticated",
  onAuthRequired,
}: RecordingStudioProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const reviewVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const { phase, countdownValue, recordingSeconds, videoUrl, error } =
    useRecordingStore();

  const { initCamera, startCountdown, stopRecording, retake, getStream } =
    useRecording(maxSeconds);
  const { upload, uploading } = useUpload();
  const { transcript } = useTranscription();
  // MediaPipe disabled for now — Pro feature, fix later
  const mediaPipeReady = false;

  // Wire live stream to video element
  useEffect(() => {
    const stream = getStream();
    if (videoRef.current && stream && videoRef.current.srcObject !== stream) {
      videoRef.current.srcObject = stream;
    }
    streamRef.current = stream;
  }, [phase, getStream]);

  // Wire review video
  useEffect(() => {
    if (reviewVideoRef.current && videoUrl) {
      reviewVideoRef.current.src = videoUrl;
    }
  }, [videoUrl]);

  async function handleUseThis() {
    if (mode === "anonymous" && onAuthRequired) {
      onAuthRequired();
      return;
    }
    console.log("[RecordingStudio] Uploading with transcript length:", transcript.length, "transcript:", transcript.slice(0, 200));
    const result = await upload("Untitled Pitch", transcript);
    if (result) {
      router.push(`/dashboard/session/${result.sessionId}`);
    }
  }

  const pct = (recordingSeconds / maxSeconds) * 100;
  const timeLeft = maxSeconds - recordingSeconds;
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timeDisplay = `${mins}:${secs.toString().padStart(2, "0")}`;

  const isStartDisabled = !goal && mode === "authenticated";

  // ── IDLE ──────────────────────────────────────────────────────────────────
  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center justify-center gap-6 rounded-2xl border border-dashed py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Video className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Ready to pitch?</h2>
          <p className="mt-1 text-muted-foreground">
            You have {Math.floor(maxSeconds / 60)}m {maxSeconds % 60 > 0 ? `${maxSeconds % 60}s` : ""} max.
            We&apos;ll analyze your delivery, story, and confidence.
          </p>
        </div>
        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}
        <Button
          size="lg"
          onClick={canRecord ? initCamera : onUpgradeNeeded}
          disabled={isStartDisabled}
          className="gap-2"
        >
          <Mic className="h-4 w-4" />
          {canRecord
            ? isStartDisabled
              ? "Select a pitch type first"
              : error
                ? "Try again"
                : "Start recording"
            : "Upgrade to record"}
        </Button>
      </div>
    );
  }

  // ── UPLOADING / PROCESSING ─────────────────────────────────────────────────
  if (phase === "uploading" || uploading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border py-20 text-center">
        <LoadingSpinner className="h-10 w-10" />
        <div>
          <h2 className="text-xl font-semibold">Uploading your pitch…</h2>
          <p className="text-muted-foreground">This will only take a moment.</p>
        </div>
      </div>
    );
  }

  // ── REVIEW ─────────────────────────────────────────────────────────────────
  if (phase === "review") {
    return (
      <div className="space-y-4">
        <div className="overflow-hidden rounded-2xl bg-black">
          <video
            ref={reviewVideoRef}
            controls
            playsInline
            className="w-full max-h-[480px] mx-auto block"
          />
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={retake} className="flex-1 gap-2">
            <RotateCcw className="h-4 w-4" />
            Retake
          </Button>
          <Button onClick={handleUseThis} disabled={uploading} className="flex-1 gap-2">
            {uploading ? (
              <LoadingSpinner className="h-4 w-4" />
            ) : mode === "anonymous" ? (
              <Sparkles className="h-4 w-4" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {mode === "anonymous" ? "See my results" : "Use this pitch"}
          </Button>
        </div>
        {error && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}
      </div>
    );
  }

  // ── COUNTDOWN / READY / RECORDING ─────────────────────────────────────────
  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full max-h-[480px] mx-auto block scale-x-[-1]"
        />

        {/* Countdown overlay */}
        {phase === "countdown" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <span className="text-8xl font-bold text-white drop-shadow-lg">
              {countdownValue}
            </span>
          </div>
        )}

        {/* Recording indicator */}
        {phase === "recording" && (
          <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm font-medium text-white">{timeDisplay}</span>
          </div>
        )}

        {/* MediaPipe status */}
        {phase === "ready" && mediaPipeReady && (
          <div className="absolute bottom-4 left-4 rounded-full bg-black/60 px-3 py-1 text-xs text-green-400">
            Body language tracking ready
          </div>
        )}
      </div>

      {/* Time progress bar */}
      {phase === "recording" && (
        <div className="space-y-1">
          <Progress value={pct} className="h-2" />
          <p className="text-xs text-muted-foreground text-right">{timeDisplay} remaining</p>
        </div>
      )}

      <div className="flex gap-3">
        {phase === "ready" && (
          <>
            <Button variant="outline" onClick={retake} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={startCountdown} className="flex-1 gap-2">
              <Mic className="h-4 w-4" />
              Start (5s countdown)
            </Button>
          </>
        )}

        {phase === "countdown" && (
          <Button variant="outline" onClick={retake} className="w-full">
            Cancel
          </Button>
        )}

        {phase === "recording" && (
          <Button
            variant="destructive"
            onClick={stopRecording}
            className="w-full gap-2"
            size="lg"
          >
            <StopCircle className="h-5 w-5" />
            Stop recording
          </Button>
        )}
      </div>
    </div>
  );
}
