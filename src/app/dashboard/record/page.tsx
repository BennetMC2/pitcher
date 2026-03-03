"use client";

import { useState, useEffect } from "react";
import { useSubscription } from "@/hooks/useSubscription";
import { RecordingStudio } from "@/components/record/RecordingStudio";
import { GoalSelector } from "@/components/record/GoalSelector";
import { PreRecordingTips } from "@/components/record/PreRecordingTips";
import { UpgradeModal } from "@/components/shared/UpgradeModal";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Coins } from "lucide-react";
import { useRecordingStore } from "@/store/recordingStore";
import type { PitchGoal } from "@/lib/constants";

export default function RecordPage() {
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const { canRecord, maxSeconds, nextPitchIsPaid, loading } = useSubscription();
  const reset = useRecordingStore((s) => s.reset);
  const goal = useRecordingStore((s) => s.goal);
  const setGoal = useRecordingStore((s) => s.setGoal);

  // Reset recording state when navigating to this page
  useEffect(() => {
    reset();
  }, [reset]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Record your pitch</h1>
          <p className="text-muted-foreground">
            Deliver your elevator pitch to the camera. You have{" "}
            {Math.floor(maxSeconds / 60)} minute
            {maxSeconds >= 120 ? "s" : ""} max.
          </p>
          {nextPitchIsPaid && (
            <Badge variant="secondary" className="mt-2 gap-1.5">
              <Coins className="h-3 w-3 text-yellow-500" />
              This pitch uses 1 credit
            </Badge>
          )}
        </div>

        <GoalSelector selected={goal} onSelect={setGoal} />

        {goal && <PreRecordingTips goal={goal} />}

        <RecordingStudio
          maxSeconds={maxSeconds}
          canRecord={canRecord}
          onUpgradeNeeded={() => setUpgradeOpen(true)}
          goal={goal}
        />
      </div>

      <UpgradeModal open={upgradeOpen} onOpenChange={setUpgradeOpen} />
    </>
  );
}
