"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, Lock } from "lucide-react";
import type { VerbalAnalysis, StoryStructure, BodyLanguageAnalysis } from "@/types/feedback.types";
import type { PitchGoal } from "@/lib/constants";
import { getStructureConfig } from "@/lib/goalConfig";
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
          <div className="rounded-lg clay-inset bg-card/50 p-3">
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
          <div className="rounded-lg clay-inset bg-card/50 p-3">
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

        {/* Pacing range visualization */}
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Pace range</p>
          <div className="relative h-2 rounded-full bg-muted">
            <div className="absolute top-0 left-[26%] w-[22%] h-full rounded-full bg-green-200" title="Ideal: 130-160 WPM" />
            <div
              className="absolute top-0 h-4 w-1 -mt-1 rounded-full bg-foreground"
              style={{ left: `${Math.min(Math.max((verbal.wpm / 200) * 100, 2), 98)}%` }}
              title={`${verbal.wpm} WPM`}
            />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>80</span>
            <span>130–160 ideal</span>
            <span>200+</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">{verbal.pacing_assessment}</p>
      </CardContent>
    </Card>
  );
}

// ── Story Structure Card ────────────────────────────────────────────────────

const defaultElements = [
  { key: "has_problem", label: "Problem", desc: "Clear pain point articulated" },
  { key: "has_solution", label: "Solution", desc: "Product/solution explained" },
  { key: "has_traction", label: "Traction", desc: "Evidence of validation" },
  { key: "has_ask", label: "Ask", desc: "Specific request from audience" },
] as const;

interface StoryStructureCardProps {
  structure: StoryStructure;
  goal?: PitchGoal;
}

export function StoryStructureCard({ structure, goal }: StoryStructureCardProps) {
  const config = goal ? getStructureConfig(goal) : null;

  const elements = config
    ? config.elements.map((el) => ({
        key: el.key as keyof StoryStructure,
        label: el.label,
        desc: el.aiDescription.replace(/^Does the (pitch|speaker|talk) /, "").replace(/\?$/, ""),
      }))
    : defaultElements.map((el) => ({ ...el, key: el.key as keyof StoryStructure }));

  const structKeys = elements.map((e) => e.key);
  const count = structKeys.filter((k) => structure[k]).length;
  const totalElements = elements.length + (structure.has_hook !== undefined ? 1 : 0);
  const totalPresent = count + (structure.has_hook ? 1 : 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Story Structure</CardTitle>
          <Badge variant={totalPresent === totalElements ? "default" : "secondary"}>
            {totalPresent}/{totalElements} elements
          </Badge>
        </div>
        <Progress value={(totalPresent / totalElements) * 100} className="h-1.5" />
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Emotional hook (shown first if available) */}
        {structure.has_hook !== undefined && (
          <div className="flex items-center gap-3">
            {structure.has_hook ? (
              <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
            ) : (
              <XCircle className="h-4 w-4 text-red-400 shrink-0" />
            )}
            <div>
              <span className="text-sm font-medium">Emotional Hook</span>
              <span className="text-xs text-muted-foreground ml-2">Attention-grabbing opening</span>
            </div>
          </div>
        )}

        {/* Goal-aware structure elements */}
        {elements.map((el) => {
          const present = structure[el.key];
          return (
            <div key={el.key} className="space-y-1">
              <div className="flex items-center gap-3">
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
              {!present && (
                <p className="ml-7 text-xs text-amber-600 bg-amber-50 rounded px-2 py-1">
                  Try adding a clear {el.label.toLowerCase()} section to strengthen your pitch.
                </p>
              )}
            </div>
          );
        })}

        {/* Hook notes */}
        {structure.hook_notes && (
          <p className="text-sm text-muted-foreground pt-1 border-t">
            <span className="font-medium text-foreground">Hook: </span>
            {structure.hook_notes}
          </p>
        )}

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
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 backdrop-blur-sm bg-card/80 clay-shadow rounded-2xl">
          <Lock className="h-8 w-8 text-muted-foreground" />
          <div className="text-center">
            <p className="font-semibold text-sm">Credit feature</p>
            <p className="text-xs text-muted-foreground">Body language tracking with your next credit pitch</p>
          </div>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Get credits — from $1.80/pitch
          </Link>
        </div>
      )}

      <CardHeader className="pb-3">
        <CardTitle className="text-base">Body Language</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {metrics.map((m) => {
            const color = m.value >= 80 ? "bg-green-500" : m.value >= 60 ? "bg-yellow-500" : "bg-red-500";
            const textColor = m.value >= 80 ? "text-green-600" : m.value >= 60 ? "text-yellow-600" : "text-red-600";
            return (
              <div key={m.label} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{m.label}</span>
                  <span className={`text-sm font-bold ${textColor}`}>
                    {m.value}{m.unit}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${m.value}%` }} />
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-sm text-muted-foreground">{bodyLanguage.body_language_notes}</p>
      </CardContent>
    </Card>
  );
}
