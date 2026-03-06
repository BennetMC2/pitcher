"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSessionPolling } from "@/hooks/useSession";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Circle, Loader2, Lightbulb, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const PIPELINE_STEPS = [
  { key: "transcribing", label: "Transcribing speech", description: "Converting audio to text with Whisper" },
  { key: "analyzing", label: "Analyzing delivery", description: "Evaluating verbal, story, and body language" },
  { key: "synthesizing", label: "Building coaching plan", description: "AI coach synthesizing personalized tips" },
  { key: "saving", label: "Saving results", description: "Writing your feedback report" },
];

const PITCH_TIPS = [
  "The best pitches start with a problem the audience personally cares about.",
  "Speaking at 130-160 WPM is the sweet spot for clarity and energy.",
  "Eye contact for 60%+ of your pitch builds trust and authority.",
  "The strongest closings include a specific, concrete ask.",
  "Pausing for 1-2 seconds after a key point makes it land harder.",
  "Founders who practice 3+ times score 40% higher on average.",
  "Your first 7 seconds determine if people keep listening.",
];

function StepIcon({ state }: { state: "done" | "active" | "pending" }) {
  if (state === "done") return <CheckCircle2 className="h-5 w-5 text-green-500" />;
  if (state === "active") return <Loader2 className="h-5 w-5 text-primary animate-spin" />;
  return <Circle className="h-5 w-5 text-muted-foreground/40" />;
}

export function SessionPollingWrapper({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const { status, analysisStep, error, pollFailures } = useSessionPolling(sessionId);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    if (status === "complete" || status === "failed") {
      router.refresh();
    }
  }, [status, router]);

  // Rotate tips
  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((i) => (i + 1) % PITCH_TIPS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Prevent accidental navigation
  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const currentStepIndex = PIPELINE_STEPS.findIndex((s) => s.key === analysisStep);

  // Poll failure state
  if (pollFailures >= 3) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-8 pb-8 text-center space-y-4">
            <AlertCircle className="h-10 w-10 text-destructive mx-auto" />
            <h2 className="text-xl font-semibold">Connection lost</h2>
            <p className="text-sm text-muted-foreground">
              We couldn&apos;t reach the server. Your analysis is still running in the background.
            </p>
            <Button onClick={() => window.location.reload()}>
              Refresh page
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="pt-8 pb-8 space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Analyzing your pitch</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              This usually takes 30–60 seconds.
            </p>
          </div>

          {/* Stepper */}
          <div className="space-y-1">
            {PIPELINE_STEPS.map((step, i) => {
              const state =
                i < currentStepIndex
                  ? "done"
                  : i === currentStepIndex
                  ? "active"
                  : "pending";

              return (
                <div key={step.key} className="flex items-center gap-3 py-2">
                  <StepIcon state={state} />
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${state === "pending" ? "text-muted-foreground/50" : ""}`}>
                      {step.label}
                    </p>
                    {state === "active" && (
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pitch tip carousel */}
          <div className="rounded-lg bg-primary/5 border border-primary/10 p-3">
            <div className="flex items-start gap-2">
              <Lightbulb className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-primary mb-0.5">Did you know?</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {PITCH_TIPS[tipIndex]}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <LoadingSpinner className="h-3.5 w-3.5" />
            Powered by Claude AI + Whisper
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
