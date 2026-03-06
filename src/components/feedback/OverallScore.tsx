"use client";

import { useEffect, useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";

interface OverallScoreProps {
  score: number;
  grade: string;
  confidenceLevel: string;
}

function useAnimatedCount(target: number, duration = 1500) {
  const [value, setValue] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    startTimeRef.current = null;

    function animate(timestamp: number) {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    }

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return value;
}

function ScoreDial({ score }: { score: number }) {
  const animatedScore = useAnimatedCount(score);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

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
        />
      </svg>
      <div className="absolute text-center">
        <span
          className="text-4xl font-bold"
          style={{ color }}
        >
          {animatedScore}
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

// ── Mini Stat Row ──────────────────────────────────────────────────────────
interface MiniStatsProps {
  wpm: number;
  clarity: number;
  structurePresent: number;
  structureTotal: number;
  fillerCount: number;
}

function statColor(value: number, good: number, ok: number) {
  return value >= good ? "text-green-600" : value >= ok ? "text-yellow-600" : "text-red-600";
}

export function MiniStats({ wpm, clarity, structurePresent, structureTotal, fillerCount }: MiniStatsProps) {
  const wpmColor = (wpm >= 130 && wpm <= 160) ? "text-green-600" : (wpm < 110 || wpm > 180) ? "text-red-600" : "text-yellow-600";
  const fillerColor = fillerCount === 0 ? "text-green-600" : fillerCount <= 3 ? "text-yellow-600" : "text-red-600";

  return (
    <div className="grid grid-cols-4 gap-3">
      <div className="rounded-lg bg-muted/50 p-3 text-center">
        <p className="text-xs text-muted-foreground">WPM</p>
        <p className={`text-lg font-bold ${wpmColor}`}>{wpm}</p>
      </div>
      <div className="rounded-lg bg-muted/50 p-3 text-center">
        <p className="text-xs text-muted-foreground">Clarity</p>
        <p className={`text-lg font-bold ${statColor(clarity, 80, 60)}`}>{clarity}</p>
      </div>
      <div className="rounded-lg bg-muted/50 p-3 text-center">
        <p className="text-xs text-muted-foreground">Structure</p>
        <p className={`text-lg font-bold ${statColor((structurePresent / structureTotal) * 100, 80, 50)}`}>
          {structurePresent}/{structureTotal}
        </p>
      </div>
      <div className="rounded-lg bg-muted/50 p-3 text-center">
        <p className="text-xs text-muted-foreground">Fillers</p>
        <p className={`text-lg font-bold ${fillerColor}`}>{fillerCount}</p>
      </div>
    </div>
  );
}
