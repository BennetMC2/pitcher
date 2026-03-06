"use client";

import { Badge } from "@/components/ui/badge";
import { PITCH_GOALS } from "@/lib/goalConfig";
import type { PitchGoal } from "@/lib/constants";

interface GoalSelectorProps {
  selected: PitchGoal | null;
  onSelect: (goal: PitchGoal) => void;
}

export function GoalSelector({ selected, onSelect }: GoalSelectorProps) {
  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold">What are you pitching?</h2>
        <p className="text-sm text-muted-foreground">
          We&apos;ll tailor the AI feedback to your context.
        </p>
      </div>
      <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {PITCH_GOALS.map((goal) => (
          <button
            key={goal.id}
            type="button"
            onClick={() => onSelect(goal.id)}
            className={`flex items-start gap-3 rounded-xl border p-3 text-left transition-colors hover:bg-muted/50 ${
              selected === goal.id
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "border-border"
            }`}
          >
            <span className="text-xl leading-none mt-0.5">{goal.icon}</span>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-medium">{goal.label}</p>
                {goal.id === "startup_pitch" && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Popular</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{goal.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
