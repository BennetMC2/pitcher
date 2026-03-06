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
  Camera,
  Shield,
  Monitor,
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

  const { phase, countdownValue, recordingSeconds, videoUrl, error, uploadProgress, uploadError } =
    useRecordingStore();

  const { initCamera, startCountdown, startImmediate, skipCountdown, stopRecording, retake, getStream } =
    useRecording(maxSeconds);
  const { upload, retryUpload, uploading } = useUpload();
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

  // Wire review video — seek to 0.001s to force first frame render (avoids black screen)
  useEffect(() => {
    if (reviewVideoRef.current && videoUrl) {
      reviewVideoRef.current.src = videoUrl;
      reviewVideoRef.current.currentTime = 0.001;
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

  function getCameraErrorInfo(code: string) {
    const isChrome = typeof navigator !== "undefined" && /Chrome/.test(navigator.userAgent) && !/Edg/.test(navigator.userAgent);
    const isSafari = typeof navigator !== "undefined" && /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);

    switch (code) {
      case "denied":
        return {
          title: "Camera access blocked",
          steps: isChrome
            ? ["Click the lock icon in the address bar", "Set Camera and Microphone to \"Allow\"", "Reload this page"]
            : isSafari
            ? ["Go to Safari → Settings → Websites → Camera", "Set this site to \"Allow\"", "Reload this page"]
            : ["Check your browser settings for camera permissions", "Set Camera and Microphone to \"Allow\"", "Reload this page"],
        };
      case "in_use":
        return {
          title: "Camera is busy",
          steps: ["Close other apps or tabs using your camera", "Tap \"Try again\" below"],
        };
      case "no_camera":
        return {
          title: "No camera found",
          steps: [
            "Make sure a camera is connected",
            "On Mac: System Settings → Privacy & Security → Camera → enable your browser",
            "Restart your browser and try again",
          ],
        };
      case "no_devices":
        return {
          title: "No camera or microphone found",
          steps: [
            "On Mac: System Settings → Privacy & Security → Camera (and Microphone) → enable your browser",
            "Restart your browser",
          ],
        };
      default:
        return {
          title: "Could not access camera",
          steps: ["Close other apps using the camera", "Tap \"Try again\" below"],
        };
    }
  }

  const pct = (recordingSeconds / maxSeconds) * 100;
  const timeLeft = maxSeconds - recordingSeconds;
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timeDisplay = `${mins}:${secs.toString().padStart(2, "0")}`;
  const timerColor = pct < 60 ? "text-green-400" : pct < 85 ? "text-yellow-400" : "text-red-400";
  const progressColor = pct < 60 ? "" : pct < 85 ? "[&>div]:bg-yellow-500" : "[&>div]:bg-red-500";

  const isStartDisabled = !goal && mode === "authenticated";

  // ── CONNECTING (shimmer placeholder) ──────────────────────────────────────
  if (phase === "connecting") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border py-20 text-center">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Camera className="h-8 w-8 text-primary" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Starting camera…</h2>
          <p className="text-sm text-muted-foreground">
            Allow camera access when prompted by your browser.
          </p>
        </div>
        <div className="w-full max-w-xs">
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full w-1/3 rounded-full bg-primary/40 animate-[shimmer_1.5s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>
    );
  }

  // ── IDLE ──────────────────────────────────────────────────────────────────
  if (phase === "idle") {
    const errorInfo = error ? getCameraErrorInfo(error) : null;

    return (
      <div className="flex flex-col items-center justify-center gap-6 rounded-2xl border border-dashed py-20 text-center">
        {errorInfo ? (
          <>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 border border-amber-200">
              <Shield className="h-8 w-8 text-amber-500" />
            </div>
            <div className="max-w-sm">
              <h2 className="text-xl font-semibold">{errorInfo.title}</h2>
              <ol className="mt-3 space-y-2 text-left text-sm text-muted-foreground">
                {errorInfo.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
            <Button size="lg" onClick={initCamera} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Try again
            </Button>
          </>
        ) : (
          <>
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
                  : "Start recording"
                : "Upgrade to record"}
            </Button>
          </>
        )}
      </div>
    );
  }

  // ── UPLOADING / PROCESSING ─────────────────────────────────────────────────
  if (phase === "uploading" || uploading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border py-20 text-center">
        {uploadError ? (
          <>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Upload failed</h2>
              <p className="mt-1 text-sm text-muted-foreground max-w-xs">
                {uploadError}
              </p>
            </div>
            <Button
              onClick={() => retryUpload("Untitled Pitch", transcript)}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Retry upload
            </Button>
          </>
        ) : (
          <>
            <LoadingSpinner className="h-10 w-10" />
            <div>
              <h2 className="text-xl font-semibold">Uploading your pitch…</h2>
              <p className="text-muted-foreground">This will only take a moment.</p>
            </div>
            <div className="w-full max-w-xs space-y-1">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-xs text-muted-foreground">{uploadProgress}%</p>
            </div>
          </>
        )}
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
            preload="metadata"
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
          className="w-full aspect-video max-h-[480px] mx-auto block scale-x-[-1] object-cover"
        />

        {/* Countdown overlay */}
        {phase === "countdown" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 gap-4">
            <span className="text-8xl font-bold text-white drop-shadow-lg">
              {countdownValue}
            </span>
            <button
              type="button"
              onClick={skipCountdown}
              className="text-sm text-white/70 hover:text-white transition-colors underline underline-offset-2"
            >
              Skip countdown
            </button>
          </div>
        )}

        {/* Recording indicator */}
        {phase === "recording" && (
          <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className={`text-sm font-medium ${timerColor}`}>{timeDisplay}</span>
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
          <Progress value={pct} className={`h-2 ${progressColor}`} />
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
            <Button variant="outline" onClick={startImmediate} className="gap-2">
              <Mic className="h-4 w-4" />
              Start now
            </Button>
            <Button onClick={startCountdown} className="flex-1 gap-2">
              <Mic className="h-4 w-4" />
              5s countdown
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
