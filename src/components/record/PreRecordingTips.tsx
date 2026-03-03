"use client";

import { useState } from "react";
import { ChevronDown, Lightbulb } from "lucide-react";
import type { PitchGoal } from "@/lib/constants";
import { getStructureConfig, getGoalLabel } from "@/lib/goalConfig";

interface PreRecordingTipsProps {
  goal: PitchGoal;
}

export function PreRecordingTips({ goal }: PreRecordingTipsProps) {
  const [open, setOpen] = useState(true);
  const config = getStructureConfig(goal);
  const label = getGoalLabel(goal);

  return (
    <div className="rounded-xl border bg-primary/5 border-primary/20">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">
            Tips for your {label.toLowerCase()}
          </span>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="border-t border-primary/10 px-4 py-3 space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Open with an emotional hook
          </p>
          <ul className="space-y-2">
            {config.hookTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground/70 pt-1">
            A strong hook in the first 7 seconds dramatically improves your score.
          </p>
        </div>
      )}
    </div>
  );
}
