"use client";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FREE_PITCH_LIMIT } from "@/lib/constants";
import { Coins } from "lucide-react";

interface UsageBadgeProps {
  pitchesUsed: number;
  credits: number;
}

export function UsageBadge({ pitchesUsed, credits }: UsageBadgeProps) {
  const freeRemaining = Math.max(0, FREE_PITCH_LIMIT - pitchesUsed);
  const hasFreeLeft = freeRemaining > 0;

  if (hasFreeLeft) {
    const pct = (pitchesUsed / FREE_PITCH_LIMIT) * 100;
    return (
      <div className="flex items-center gap-3">
        <div className="min-w-[120px]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">
              {freeRemaining} free pitch{freeRemaining !== 1 ? "es" : ""} left
            </span>
            <span className="text-xs text-muted-foreground">
              {pitchesUsed}/{FREE_PITCH_LIMIT}
            </span>
          </div>
          <Progress value={pct} className="h-1.5" />
        </div>
      </div>
    );
  }

  if (credits > 0) {
    return (
      <Badge variant="secondary" className="gap-1">
        <Coins className="h-3 w-3 text-yellow-500" />
        {credits} credit{credits !== 1 ? "s" : ""}
      </Badge>
    );
  }

  return (
    <Badge variant="destructive" className="text-xs">
      No pitches left
    </Badge>
  );
}
