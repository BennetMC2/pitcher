"use client";

import { Badge } from "@/components/ui/badge";

interface OverallScoreProps {
  score: number;
  grade: string;
  confidenceLevel: string;
}

function ScoreDial({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 80 ? "#22c55e" : score >= 60 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative flex items-center justify-center">
      <svg width="140" height="140" className="-rotate-90">
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="10"
        />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="absolute text-center">
        <span
          className="text-4xl font-bold"
          style={{ color }}
        >
          {score}
        </span>
        <span className="block text-xs text-muted-foreground">/100</span>
      </div>
    </div>
  );
}

export function OverallScore({ score, grade, confidenceLevel }: OverallScoreProps) {
  const levelColor =
    confidenceLevel === "High"
      ? "bg-green-100 text-green-700"
      : confidenceLevel === "Developing"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

  return (
    <div className="flex flex-col items-center gap-3 py-4">
      <ScoreDial score={score} />
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold">{grade}</span>
        <Badge className={levelColor} variant="secondary">
          {confidenceLevel} Confidence
        </Badge>
      </div>
    </div>
  );
}
