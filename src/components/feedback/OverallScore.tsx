"use client";

import { useEffect, useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Award } from "lucide-react";

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
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  const color =
    score >= 80 ? "#22c55e" : score >= 60 ? "#f59e0b" : "#ef4444";
  const bgGlow =
    score >= 80 ? "shadow-green-500/20" : score >= 60 ? "shadow-yellow-500/20" : "shadow-red-500/20";

  return (
    <div className={`relative flex items-center justify-center p-2 rounded-full clay-shadow-lg ${bgGlow}`}>
      <svg width="160" height="160" className="-rotate-90">
        {/* Background track */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="8"
        />
        {/* Colored progress arc */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.22, 1, 0.36, 1)" }}
        />
      </svg>
      <div className="absolute text-center">
        <span
          className="text-5xl font-extrabold tracking-tight"
          style={{ color }}
        >
          {animatedScore}
        </span>
        <span className="block text-sm text-muted-foreground font-medium">/100</span>
      </div>
    </div>
  );
}

export function OverallScore({ score, grade, confidenceLevel }: OverallScoreProps) {
  const levelColor =
    confidenceLevel === "High"
      ? "bg-green-100 text-green-700 border-green-200"
      : confidenceLevel === "Developing"
      ? "bg-yellow-100 text-yellow-700 border-yellow-200"
      : "bg-red-100 text-red-700 border-red-200";

  const gradeColor =
    score >= 80
      ? "bg-green-50 text-green-700 border-green-200"
      : score >= 60
      ? "bg-yellow-50 text-yellow-700 border-yellow-200"
      : "bg-red-50 text-red-700 border-red-200";

  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <ScoreDial score={score} />
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <div className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 ${gradeColor}`}>
            <Award className="h-3.5 w-3.5" />
            <span className="text-lg font-bold">{grade}</span>
          </div>
        </div>
        <Badge className={`${levelColor} border`} variant="secondary">
          <TrendingUp className="h-3 w-3 mr-1" />
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

function statBg(value: number, good: number, ok: number) {
  return value >= good ? "bg-green-50 border-green-100" : value >= ok ? "bg-yellow-50 border-yellow-100" : "bg-red-50 border-red-100";
}

export function MiniStats({ wpm, clarity, structurePresent, structureTotal, fillerCount }: MiniStatsProps) {
  const wpmColor = (wpm >= 130 && wpm <= 160) ? "text-green-600" : (wpm < 110 || wpm > 180) ? "text-red-600" : "text-yellow-600";
  const wpmBg = (wpm >= 130 && wpm <= 160) ? "bg-green-50 border-green-100" : (wpm < 110 || wpm > 180) ? "bg-red-50 border-red-100" : "bg-yellow-50 border-yellow-100";
  const fillerColor = fillerCount === 0 ? "text-green-600" : fillerCount <= 3 ? "text-yellow-600" : "text-red-600";
  const fillerBg = fillerCount === 0 ? "bg-green-50 border-green-100" : fillerCount <= 3 ? "bg-yellow-50 border-yellow-100" : "bg-red-50 border-red-100";

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div className={`rounded-2xl clay-shadow-sm p-4 text-center transition-all ${wpmBg}`}>
        <p className="text-xs text-muted-foreground font-medium mb-1">WPM</p>
        <p className={`text-2xl font-bold ${wpmColor}`}>{wpm}</p>
      </div>
      <div className={`rounded-2xl clay-shadow-sm p-4 text-center transition-all ${statBg(clarity, 80, 60)}`}>
        <p className="text-xs text-muted-foreground font-medium mb-1">Clarity</p>
        <p className={`text-2xl font-bold ${statColor(clarity, 80, 60)}`}>{clarity}</p>
      </div>
      <div className={`rounded-2xl clay-shadow-sm p-4 text-center transition-all ${statBg((structurePresent / structureTotal) * 100, 80, 50)}`}>
        <p className="text-xs text-muted-foreground font-medium mb-1">Structure</p>
        <p className={`text-2xl font-bold ${statColor((structurePresent / structureTotal) * 100, 80, 50)}`}>
          {structurePresent}/{structureTotal}
        </p>
      </div>
      <div className={`rounded-2xl clay-shadow-sm p-4 text-center transition-all ${fillerBg}`}>
        <p className="text-xs text-muted-foreground font-medium mb-1">Fillers</p>
        <p className={`text-2xl font-bold ${fillerColor}`}>{fillerCount}</p>
      </div>
    </div>
  );
}
