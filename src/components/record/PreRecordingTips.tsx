"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Lightbulb, X } from "lucide-react";
import type { PitchGoal } from "@/lib/constants";
import { getStructureConfig, getGoalLabel } from "@/lib/goalConfig";

const TIPS_SEEN_KEY = "nailed-it-tips-seen";

interface PreRecordingTipsProps {
  goal: PitchGoal;
}

export function PreRecordingTips({ goal }: PreRecordingTipsProps) {
  const [dismissed, setDismissed] = useState(false);
  const [open, setOpen] = useState(true);
  const config = getStructureConfig(goal);
  const label = getGoalLabel(goal);

  // Auto-collapse for returning users
  useEffect(() => {
    const seen = localStorage.getItem(TIPS_SEEN_KEY);
    if (seen) setOpen(false);
  }, []);

  function handleDismiss() {
    setDismissed(true);
    localStorage.setItem(TIPS_SEEN_KEY, "true");
  }

  if (dismissed) return null;

  return (
    <div className="rounded-xl border bg-primary/5 border-primary/20">
      <div className="flex items-center">
        <button
          type="button"
          onClick={() => {
            setOpen(!open);
            localStorage.setItem(TIPS_SEEN_KEY, "true");
          }}
          className="flex flex-1 items-center justify-between px-4 py-3 text-left"
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
        <button
          type="button"
          onClick={handleDismiss}
          className="px-3 py-3 text-muted-foreground hover:text-foreground"
          title="Dismiss tips"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
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
