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
  CheckCircle2,
  Loader2,
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
      <div className="flex flex-col items-center justify-center gap-6 rounded-3xl bg-card clay-shadow py-24 text-center">
        <div className="relative h-20 w-20">
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse" />
          <div className="absolute inset-2 rounded-full bg-primary/5" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Camera className="h-9 w-9 text-primary" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold">Starting camera...</h2>
          <p className="mt-1 text-sm text-muted-foreground max-w-xs mx-auto">
            Allow camera and microphone access when prompted by your browser.
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
      <div className="flex flex-col items-center justify-center gap-6 rounded-3xl bg-card clay-shadow py-24 text-center">
        {errorInfo ? (
          <>
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 border-2 border-amber-200">
              <Shield className="h-9 w-9 text-amber-500" />
            </div>
            <div className="max-w-sm">
              <h2 className="text-xl font-bold">{errorInfo.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">Follow these steps to fix it:</p>
              <ol className="mt-4 space-y-3 text-left text-sm">
                {errorInfo.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                      {i + 1}
                    </span>
                    <span className="text-muted-foreground pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            <Button size="lg" onClick={initCamera} className="gap-2 mt-2 shadow-sm">
              <RotateCcw className="h-4 w-4" />
              Try again
            </Button>
          </>
        ) : (
          <>
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <Video className="h-9 w-9 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Ready to pitch?</h2>
              <p className="mt-2 text-muted-foreground max-w-sm mx-auto">
                You have {Math.floor(maxSeconds / 60)}m{maxSeconds % 60 > 0 ? ` ${maxSeconds % 60}s` : ""} max.
                We&apos;ll analyze your delivery, story, and confidence.
              </p>
            </div>
            <Button
              size="lg"
              onClick={canRecord ? initCamera : onUpgradeNeeded}
              disabled={isStartDisabled}
              className="gap-2 shadow-lg shadow-primary/20 h-12 px-8 text-base"
            >
              <Mic className="h-5 w-5" />
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
    const steps = [
      { label: "Uploading video", done: uploadProgress >= 100 },
      { label: "Transcribing speech", done: false },
      { label: "Analyzing delivery", done: false },
      { label: "Generating feedback", done: false },
    ];

    return (
      <div className="flex flex-col items-center justify-center gap-6 rounded-3xl bg-card clay-shadow py-24 text-center">
        {uploadError ? (
          <>
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 border-2 border-destructive/20">
              <AlertCircle className="h-9 w-9 text-destructive" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Upload failed</h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-xs">
                {uploadError}
              </p>
            </div>
            <Button
              onClick={() => retryUpload("Untitled Pitch", transcript)}
              className="gap-2 shadow-sm"
              size="lg"
            >
              <RotateCcw className="h-4 w-4" />
              Retry upload
            </Button>
          </>
        ) : (
          <>
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <Loader2 className="h-9 w-9 text-primary animate-spin" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold">Analyzing your pitch...</h2>
              <p className="text-muted-foreground mt-1">This will only take a moment.</p>
            </div>
            <div className="w-full max-w-sm space-y-4">
              <div className="space-y-1">
                <Progress value={uploadProgress} className="h-2.5" />
                <p className="text-xs text-muted-foreground text-right">{uploadProgress}%</p>
              </div>
              {/* Step checklist */}
              <div className="text-left space-y-2">
                {steps.map((step, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    {step.done ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                    ) : i === 0 ? (
                      <Loader2 className="h-4 w-4 text-primary animate-spin shrink-0" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-muted-foreground/20 shrink-0" />
                    )}
                    <span className={step.done ? "text-foreground" : i === 0 ? "text-foreground font-medium" : "text-muted-foreground"}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
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
        <div className="overflow-hidden rounded-3xl clay-shadow-lg bg-black">
          <video
            ref={reviewVideoRef}
            controls
            playsInline
            preload="metadata"
            className="w-full max-h-[480px] mx-auto block"
          />
        </div>
        <p className="text-sm text-center text-muted-foreground">
          Review your pitch, then submit for AI analysis.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={retake} className="flex-1 gap-2 h-11 shadow-sm">
            <RotateCcw className="h-4 w-4" />
            Retake
          </Button>
          <Button onClick={handleUseThis} disabled={uploading} className="flex-1 gap-2 h-11 shadow-lg shadow-primary/20">
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
      <div className="relative overflow-hidden rounded-3xl bg-[#A3C1D4]/20 clay-shadow p-3">
      <div className="relative overflow-hidden rounded-2xl bg-muted/10">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full aspect-video max-h-[480px] mx-auto block scale-x-[-1] object-cover bg-muted"
        />

        {/* Countdown overlay */}
        {phase === "countdown" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm gap-4">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-white/10 animate-ping" style={{ animationDuration: "1s" }} />
              <span className="relative text-8xl font-extrabold text-white drop-shadow-lg">
                {countdownValue}
              </span>
            </div>
            <button
              type="button"
              onClick={skipCountdown}
              className="text-sm text-white/60 hover:text-white transition-colors underline underline-offset-2"
            >
              Skip countdown
            </button>
          </div>
        )}

        {/* Recording indicator */}
        {phase === "recording" && (
          <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-black/70 backdrop-blur-sm px-4 py-2 shadow-lg">
            <span className="h-3 w-3 rounded-full bg-red-500 animate-pulse shadow-lg shadow-red-500/50" />
            <span className={`text-sm font-bold ${timerColor}`}>{timeDisplay}</span>
          </div>
        )}

        {/* MediaPipe status */}
        {phase === "ready" && mediaPipeReady && (
          <div className="absolute bottom-4 left-4 rounded-full bg-black/60 backdrop-blur-sm px-3 py-1.5 text-xs text-green-400 font-medium flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
            Body language tracking ready
          </div>
        )}
      </div>
      </div>

      {/* Time progress bar */}
      {phase === "recording" && (
        <div className="space-y-1">
          <Progress value={pct} className={`h-2.5 ${progressColor}`} />
          <p className="text-xs text-muted-foreground text-right font-medium">{timeDisplay} remaining</p>
        </div>
      )}

      <div className="flex gap-3">
        {phase === "ready" && (
          <>
            <Button variant="outline" onClick={retake} className="gap-2 shadow-sm">
              <RotateCcw className="h-4 w-4" />
              Cancel
            </Button>
            <Button variant="outline" onClick={startImmediate} className="gap-2 shadow-sm">
              <Mic className="h-4 w-4" />
              Start now
            </Button>
            <Button onClick={startCountdown} className="flex-1 gap-2 h-11 shadow-lg shadow-primary/20">
              <Mic className="h-4 w-4" />
              5s countdown
            </Button>
          </>
        )}

        {phase === "countdown" && (
          <Button variant="outline" onClick={retake} className="w-full h-11">
            Cancel
          </Button>
        )}

        {phase === "recording" && (
          <Button
            variant="destructive"
            onClick={stopRecording}
            className="w-full gap-2 h-12 shadow-lg"
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
