"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, Lock } from "lucide-react";
import type { VerbalAnalysis, StoryStructure, BodyLanguageAnalysis } from "@/types/feedback.types";
import Link from "next/link";

// ── Verbal Card ────────────────────────────────────────────────────────────

export function VerbalCard({ verbal }: { verbal: VerbalAnalysis }) {
  const wpmStatus =
    verbal.wpm >= 130 && verbal.wpm <= 160
      ? "good"
      : verbal.wpm < 110 || verbal.wpm > 180
      ? "bad"
      : "ok";

  const totalFillers = verbal.filler_words.reduce((sum, f) => sum + f.count, 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Verbal Delivery</CardTitle>
          <div className="flex items-center gap-1 text-sm font-semibold">
            {verbal.clarity_score}
            <span className="text-xs font-normal text-muted-foreground">/100</span>
          </div>
        </div>
        <Progress value={verbal.clarity_score} className="h-1.5" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Speaking pace</p>
            <p
              className={`text-lg font-bold mt-0.5 ${
                wpmStatus === "good"
                  ? "text-green-600"
                  : wpmStatus === "bad"
                  ? "text-red-600"
                  : "text-yellow-600"
              }`}
            >
              {verbal.wpm} WPM
            </p>
            <p className="text-xs text-muted-foreground">ideal: 130–160</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Filler words</p>
            <p
              className={`text-lg font-bold mt-0.5 ${
                totalFillers === 0
                  ? "text-green-600"
                  : totalFillers <= 3
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {totalFillers}
            </p>
            <p className="text-xs text-muted-foreground">total detected</p>
          </div>
        </div>

        {verbal.filler_words.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-2">Top fillers</p>
            <div className="flex flex-wrap gap-1.5">
              {verbal.filler_words.slice(0, 6).map((f) => (
                <Badge key={f.word} variant="secondary" className="text-xs">
                  &ldquo;{f.word}&rdquo; ×{f.count}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <p className="text-sm text-muted-foreground">{verbal.pacing_assessment}</p>
      </CardContent>
    </Card>
  );
}

// ── Story Structure Card ────────────────────────────────────────────────────

const elements = [
  { key: "has_problem", label: "Problem", desc: "Clear pain point articulated" },
  { key: "has_solution", label: "Solution", desc: "Product/solution explained" },
  { key: "has_traction", label: "Traction", desc: "Evidence of validation" },
  { key: "has_ask", label: "Ask", desc: "Specific request from audience" },
] as const;

export function StoryStructureCard({ structure }: { structure: StoryStructure }) {
  const count = elements.filter((e) => structure[e.key]).length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Story Structure</CardTitle>
          <Badge variant={count === 4 ? "default" : "secondary"}>
            {count}/4 elements
          </Badge>
        </div>
        <Progress value={(count / 4) * 100} className="h-1.5" />
      </CardHeader>
      <CardContent className="space-y-3">
        {elements.map((el) => {
          const present = structure[el.key];
          return (
            <div key={el.key} className="flex items-center gap-3">
              {present ? (
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 text-red-400 shrink-0" />
              )}
              <div>
                <span className="text-sm font-medium">{el.label}</span>
                <span className="text-xs text-muted-foreground ml-2">{el.desc}</span>
              </div>
            </div>
          );
        })}
        <p className="text-sm text-muted-foreground pt-1">{structure.structure_notes}</p>
      </CardContent>
    </Card>
  );
}

// ── Body Language Card ──────────────────────────────────────────────────────

interface BodyLanguageCardProps {
  bodyLanguage: BodyLanguageAnalysis;
  isPro: boolean;
}

export function BodyLanguageCard({ bodyLanguage, isPro }: BodyLanguageCardProps) {
  const metrics = [
    { label: "Eye Contact", value: bodyLanguage.eye_contact_pct, unit: "%" },
    { label: "Posture", value: bodyLanguage.posture_score, unit: "/100" },
    { label: "Gestures", value: bodyLanguage.gesture_score, unit: "/100" },
  ];

  return (
    <Card className="relative overflow-hidden">
      {!isPro && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 backdrop-blur-sm bg-background/70 rounded-xl">
          <Lock className="h-8 w-8 text-muted-foreground" />
          <div className="text-center">
            <p className="font-semibold text-sm">Credit feature</p>
            <p className="text-xs text-muted-foreground">Included with credit pitches</p>
          </div>
          <Link
            href="/pricing"
            className="text-xs text-primary hover:underline font-medium"
          >
            Buy credits →
          </Link>
        </div>
      )}

      <CardHeader className="pb-3">
        <CardTitle className="text-base">Body Language</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {metrics.map((m) => (
            <div key={m.label} className="text-center rounded-lg bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">{m.label}</p>
              <p
                className={`text-xl font-bold mt-0.5 ${
                  m.value >= 80
                    ? "text-green-600"
                    : m.value >= 60
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {m.value}
                <span className="text-xs font-normal text-muted-foreground">
                  {m.unit}
                </span>
              </p>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">{bodyLanguage.body_language_notes}</p>
      </CardContent>
    </Card>
  );
}
