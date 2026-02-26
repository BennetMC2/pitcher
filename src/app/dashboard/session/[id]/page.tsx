import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OverallScore } from "@/components/feedback/OverallScore";
import { TranscriptViewer } from "@/components/feedback/TranscriptViewer";
import {
  VerbalCard,
  StoryStructureCard,
  BodyLanguageCard,
} from "@/components/feedback/FeedbackCards";
import { CoachingTips } from "@/components/feedback/CoachingTips";
import { SuggestedScript } from "@/components/feedback/SuggestedScript";
import { SessionPollingWrapper } from "./SessionPollingWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";
import type {
  WordTimestamp,
  FillerWord,
  PriorityImprovement,
} from "@/types/feedback.types";
import { formatDistanceToNow } from "date-fns";

export default async function SessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: sessionRes } = await supabase
    .from("pitch_sessions")
    .select("*, feedback(*)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!sessionRes) notFound();

  // Cast to typed objects — read is_paid directly from session
  const session = sessionRes as unknown as {
    id: string;
    title: string;
    status: string;
    created_at: string;
    duration_seconds: number | null;
    is_paid: boolean;
    feedback: Record<string, unknown> | null;
  };
  const isPaid = session.is_paid;

  // Still processing
  if (session.status === "processing" || session.status === "uploading") {
    return <SessionPollingWrapper sessionId={id} />;
  }

  // Failed
  if (session.status === "failed") {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Dashboard
          </Link>
        </Button>
        <Card className="border-destructive/40 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive">Analysis failed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Something went wrong while analyzing your pitch. This can happen if
              the video had no audible speech.
            </p>
            <Button asChild>
              <Link href="/dashboard/record">
                <RefreshCw className="mr-1.5 h-4 w-4" /> Try again
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const rawFb = session.feedback;
  if (!rawFb) notFound();

  // Fully typed feedback object — no unknown values escape into JSX
  const fb = rawFb as {
    overall_score: number;
    grade: string;
    confidence_level: string;
    top_strengths: string[];
    priority_improvements: PriorityImprovement[];
    wpm: number;
    filler_words: FillerWord[];
    clarity_score: number;
    conciseness: string;
    pacing_assessment: string;
    has_problem: boolean;
    has_solution: boolean;
    has_traction: boolean;
    has_ask: boolean;
    structure_notes: string;
    missing_elements: string[];
    eye_contact_pct: number;
    posture_score: number;
    gesture_score: number;
    body_language_notes: string;
    transcript: string | null;
    word_timestamps: WordTimestamp[] | null;
    suggested_script: string | null;
  };

  const verbal = {
    wpm: fb.wpm,
    filler_words: fb.filler_words ?? [],
    clarity_score: fb.clarity_score,
    conciseness: fb.conciseness,
    pacing_assessment: fb.pacing_assessment,
  };

  const structure = {
    has_problem: fb.has_problem,
    has_solution: fb.has_solution,
    has_traction: fb.has_traction,
    has_ask: fb.has_ask,
    structure_notes: fb.structure_notes,
    missing_elements: fb.missing_elements ?? [],
  };

  const bodyLanguage = {
    eye_contact_pct: fb.eye_contact_pct ?? 0,
    posture_score: fb.posture_score ?? 0,
    gesture_score: fb.gesture_score ?? 0,
    body_language_notes: fb.body_language_notes ?? "",
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <Button variant="ghost" size="sm" asChild className="-ml-2 mb-4">
          <Link href="/dashboard">
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Dashboard
          </Link>
        </Button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{session.title}</h1>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(session.created_at), {
                addSuffix: true,
              })}
              {session.duration_seconds &&
                ` · ${Math.round(session.duration_seconds)}s`}
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/record">Record another</Link>
          </Button>
        </div>
      </div>

      {/* Overall score */}
      <Card>
        <CardContent className="pt-6">
          <OverallScore
            score={fb.overall_score}
            grade={fb.grade}
            confidenceLevel={fb.confidence_level}
          />
        </CardContent>
      </Card>

      {/* Coaching tips */}
      <CoachingTips
        strengths={fb.top_strengths ?? []}
        improvements={fb.priority_improvements ?? []}
      />

      {/* Analysis cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <VerbalCard verbal={verbal} />
        <StoryStructureCard structure={structure} />
      </div>

      <BodyLanguageCard bodyLanguage={bodyLanguage} isPro={isPaid} />

      {/* AI-rewritten script */}
      {fb.suggested_script && (
        <SuggestedScript script={fb.suggested_script} isPro={isPaid} />
      )}

      {/* Transcript */}
      {fb.transcript ? (
        <TranscriptViewer
          transcript={fb.transcript}
          wordTimestamps={fb.word_timestamps ?? []}
          fillerWords={verbal.filler_words}
        />
      ) : null}
    </div>
  );
}
