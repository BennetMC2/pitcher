"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { getGoalLabel } from "@/lib/goalConfig";
import type { PitchGoal } from "@/lib/constants";

interface SessionData {
  id: string;
  title: string;
  created_at: string;
  goal: string;
  feedback: {
    overall_score: number;
    grade: string;
    confidence_level: string;
    wpm: number;
    filler_words: { word: string; count: number }[];
    clarity_score: number;
    has_problem: boolean;
    has_solution: boolean;
    has_traction: boolean;
    has_ask: boolean;
    has_hook: boolean | null;
    eye_contact_pct: number;
    posture_score: number;
    gesture_score: number;
    top_strengths: string[];
  };
}

interface ComparisonViewProps {
  sessionA: { id: string; title: string; created_at: string; goal: string; feedback: SessionData["feedback"] | null };
  sessionB: { id: string; title: string; created_at: string; goal: string; feedback: SessionData["feedback"] | null };
}

function DeltaIndicator({ a, b, higherIsBetter = true }: { a: number; b: number; higherIsBetter?: boolean }) {
  const diff = b - a;
  if (diff === 0) return <Minus className="h-4 w-4 text-muted-foreground" />;
  const isImprovement = higherIsBetter ? diff > 0 : diff < 0;
  return isImprovement ? (
    <span className="flex items-center gap-1 text-xs font-medium text-green-600">
      <TrendingUp className="h-3.5 w-3.5" />
      +{Math.abs(diff)}
    </span>
  ) : (
    <span className="flex items-center gap-1 text-xs font-medium text-red-500">
      <TrendingDown className="h-3.5 w-3.5" />
      -{Math.abs(diff)}
    </span>
  );
}

function MetricRow({
  label,
  valueA,
  valueB,
  unit = "",
  higherIsBetter = true,
}: {
  label: string;
  valueA: number;
  valueB: number;
  unit?: string;
  higherIsBetter?: boolean;
}) {
  return (
    <div className="grid grid-cols-[1fr_80px_40px_80px] items-center gap-2 py-2 border-b last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold text-right">
        {valueA}{unit}
      </span>
      <div className="flex justify-center">
        <DeltaIndicator a={valueA} b={valueB} higherIsBetter={higherIsBetter} />
      </div>
      <span className="text-sm font-semibold text-right">
        {valueB}{unit}
      </span>
    </div>
  );
}

function BoolRow({ label, a, b }: { label: string; a: boolean; b: boolean }) {
  return (
    <div className="grid grid-cols-[1fr_80px_40px_80px] items-center gap-2 py-2 border-b last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex justify-end">
        {a ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-400" />}
      </div>
      <div />
      <div className="flex justify-end">
        {b ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-400" />}
      </div>
    </div>
  );
}

export function ComparisonView({ sessionA, sessionB }: ComparisonViewProps) {
  const fbA = sessionA.feedback!;
  const fbB = sessionB.feedback!;

  const totalFillersA = fbA.filler_words?.reduce((s, f) => s + f.count, 0) ?? 0;
  const totalFillersB = fbB.filler_words?.reduce((s, f) => s + f.count, 0) ?? 0;

  return (
    <div className="space-y-6">
      {/* Overall score comparison */}
      <Card>
        <CardHeader className="pb-3">
          <div className="grid grid-cols-[1fr_80px_40px_80px] items-center gap-2">
            <CardTitle className="text-base">Overall</CardTitle>
            <p className="text-xs text-muted-foreground text-right truncate">{sessionA.title}</p>
            <div />
            <p className="text-xs text-muted-foreground text-right truncate">{sessionB.title}</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-[1fr_80px_40px_80px] items-center gap-2 py-3">
            <span className="text-sm font-medium">Score</span>
            <div className="text-right">
              <span className="text-2xl font-bold">{fbA.overall_score}</span>
              <Badge variant="outline" className="ml-1 text-xs">{fbA.grade}</Badge>
            </div>
            <div className="flex justify-center">
              <DeltaIndicator a={fbA.overall_score} b={fbB.overall_score} />
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold">{fbB.overall_score}</span>
              <Badge variant="outline" className="ml-1 text-xs">{fbB.grade}</Badge>
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              {getGoalLabel(sessionA.goal as PitchGoal)}
            </Badge>
            <span className="text-muted-foreground">vs</span>
            <Badge variant="secondary" className="text-xs">
              {getGoalLabel(sessionB.goal as PitchGoal)}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Verbal metrics */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Verbal Delivery</CardTitle>
        </CardHeader>
        <CardContent>
          <MetricRow label="Clarity" valueA={fbA.clarity_score} valueB={fbB.clarity_score} unit="/100" />
          <MetricRow label="WPM" valueA={fbA.wpm} valueB={fbB.wpm} />
          <MetricRow label="Filler words" valueA={totalFillersA} valueB={totalFillersB} higherIsBetter={false} />
        </CardContent>
      </Card>

      {/* Structure */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Story Structure</CardTitle>
        </CardHeader>
        <CardContent>
          {fbA.has_hook !== null && fbB.has_hook !== null && (
            <BoolRow label="Emotional Hook" a={fbA.has_hook} b={fbB.has_hook} />
          )}
          <BoolRow label="Element 1" a={fbA.has_problem} b={fbB.has_problem} />
          <BoolRow label="Element 2" a={fbA.has_solution} b={fbB.has_solution} />
          <BoolRow label="Element 3" a={fbA.has_traction} b={fbB.has_traction} />
          <BoolRow label="Element 4" a={fbA.has_ask} b={fbB.has_ask} />
        </CardContent>
      </Card>

      {/* Body language */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Body Language</CardTitle>
        </CardHeader>
        <CardContent>
          <MetricRow label="Eye Contact" valueA={fbA.eye_contact_pct} valueB={fbB.eye_contact_pct} unit="%" />
          <MetricRow label="Posture" valueA={fbA.posture_score} valueB={fbB.posture_score} unit="/100" />
          <MetricRow label="Gestures" valueA={fbA.gesture_score} valueB={fbB.gesture_score} unit="/100" />
        </CardContent>
      </Card>
    </div>
  );
}
