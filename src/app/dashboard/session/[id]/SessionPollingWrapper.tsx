"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSessionPolling } from "@/hooks/useSession";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Mic2 } from "lucide-react";

const STEPS = [
  "Transcribing your pitch with Whisper…",
  "Analyzing verbal delivery and pacing…",
  "Evaluating story structure…",
  "Interpreting body language data…",
  "Synthesizing coaching feedback…",
];

export function SessionPollingWrapper({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const { status } = useSessionPolling(sessionId);

  useEffect(() => {
    if (status === "complete" || status === "failed") {
      router.refresh();
    }
  }, [status, router]);

  // Cycle through steps to give visual progress feel
  const stepIndex = Math.floor(Date.now() / 4000) % STEPS.length;

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="pt-8 pb-8 text-center space-y-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto">
            <Mic2 className="h-8 w-8 text-primary animate-pulse" />
          </div>

          <div>
            <h2 className="text-xl font-semibold">Analyzing your pitch</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Our AI is reviewing your delivery, structure, and body language.
              This usually takes 30–60 seconds.
            </p>
          </div>

          <div className="space-y-2">
            <Progress value={null} className="h-2 animate-pulse" />
            <p className="text-xs text-muted-foreground">{STEPS[stepIndex]}</p>
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
