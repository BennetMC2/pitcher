import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OverallScore, MiniStats } from "@/components/feedback/OverallScore";
import { TranscriptViewer } from "@/components/feedback/TranscriptViewer";
import {
  VerbalCard,
  StoryStructureCard,
  BodyLanguageCard,
} from "@/components/feedback/FeedbackCards";
import { CoachingTips } from "@/components/feedback/CoachingTips";
import { SuggestedScript } from "@/components/feedback/SuggestedScript";
import { ShareableScoreCard } from "@/components/feedback/ShareableScoreCard";
import { ChallengeButton } from "@/components/feedback/ChallengeButton";
import { UpgradeBanner } from "@/components/shared/UpgradeBanner";
import { SessionPollingWrapper } from "./SessionPollingWrapper";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, RefreshCw, GitCompareArrows } from "lucide-react";
import type {
  WordTimestamp,
  FillerWord,
  PriorityImprovement,
} from "@/types/feedback.types";
import type { PitchGoal } from "@/lib/constants";
import { getGoalLabel } from "@/lib/goalConfig";
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

  // Cast to typed objects — read is_paid and goal directly from session
  const session = sessionRes as unknown as {
    id: string;
    title: string;
    status: string;
    created_at: string;
    duration_seconds: number | null;
    is_paid: boolean;
    goal: string;
    feedback: Record<string, unknown> | null;
  };
  const isPaid = session.is_paid;
  const goal = (session.goal || "startup_pitch") as PitchGoal;

  // Still processing
  if (session.status === "processing" || session.status === "uploading") {
    return <SessionPollingWrapper sessionId={id} />;
  }

  // Failed
  if (session.status === "failed") {
    const errorHint = session.title?.startsWith("ERROR:") ? session.title.slice(7) : null;
    const isNoSpeech = errorHint?.toLowerCase().includes("no speech") || errorHint?.toLowerCase().includes("transcript too short");

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
            {isNoSpeech ? (
              <>
                <p className="text-sm text-muted-foreground">
                  We couldn&apos;t detect enough speech in your recording. This usually means:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc ml-5">
                  <li>The microphone wasn&apos;t picking up audio</li>
                  <li>The recording was too short or too quiet</li>
                  <li>Background noise was overwhelming the speech</li>
                </ul>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Something went wrong while analyzing your pitch. This can happen if the video had no audible speech or our AI service was temporarily unavailable.
              </p>
            )}
            <div className="flex items-center gap-3">
              <Button asChild>
                <Link href="/dashboard/record">
                  <RefreshCw className="mr-1.5 h-4 w-4" /> Record again
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard">Back to dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const rawFb = session.feedback;
  if (!rawFb) notFound();

  // Fully typed feedback object
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
    has_hook: boolean | null;
    hook_notes: string | null;
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
    has_hook: fb.has_hook ?? undefined,
    hook_notes: fb.hook_notes ?? undefined,
  };

  const bodyLanguage = {
    eye_contact_pct: fb.eye_contact_pct ?? 0,
    posture_score: fb.posture_score ?? 0,
    gesture_score: fb.gesture_score ?? 0,
    body_language_notes: fb.body_language_notes ?? "",
  };

  const structureElements = [fb.has_problem, fb.has_solution, fb.has_traction, fb.has_ask];
  const structurePresent = structureElements.filter(Boolean).length + (fb.has_hook ? 1 : 0);
  const structureTotal = structureElements.length + (fb.has_hook !== null ? 1 : 0);
  const totalFillers = (fb.filler_words ?? []).reduce((sum: number, f: { count: number }) => sum + f.count, 0);

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-12">
      {/* Header with breadcrumb */}
      <div>
        <Button variant="ghost" size="sm" asChild className="-ml-2 mb-4 text-muted-foreground hover:text-foreground">
          <Link href="/dashboard">
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to Dashboard
          </Link>
        </Button>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold tracking-tight">{session.title}</h1>
              <Badge variant="outline" className="text-xs font-medium">
                {getGoalLabel(goal)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(session.created_at), {
                addSuffix: true,
              })}
              {session.duration_seconds &&
                ` · ${Math.round(session.duration_seconds)}s`}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ChallengeButton sessionId={session.id} score={fb.overall_score} grade={fb.grade} />
            <Button asChild variant="outline" size="sm" className="shadow-sm">
              <Link href={`/dashboard/compare?a=${session.id}`}>
                <GitCompareArrows className="mr-1.5 h-4 w-4" />
                Compare
              </Link>
            </Button>
            <Button asChild size="sm" className="shadow-sm">
              <Link href="/dashboard/record">Record another</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Overall score — hero card */}
      <Card className="overflow-hidden clay-shadow-lg">
        <div className="rounded-xl">
          <CardContent className="pt-8 pb-6 space-y-6">
            <OverallScore
              score={fb.overall_score}
              grade={fb.grade}
              confidenceLevel={fb.confidence_level}
            />
            <MiniStats
              wpm={fb.wpm}
              clarity={fb.clarity_score}
              structurePresent={structurePresent}
              structureTotal={structureTotal}
              fillerCount={totalFillers}
            />
            <div className="flex justify-center pt-2">
              <ShareableScoreCard score={fb.overall_score} grade={fb.grade} sessionId={session.id} />
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Coaching tips */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Coaching Feedback</h2>
        <CoachingTips
          strengths={fb.top_strengths ?? []}
          improvements={fb.priority_improvements ?? []}
        />
      </div>

      {/* Analysis cards */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Detailed Analysis</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <VerbalCard verbal={verbal} />
          <StoryStructureCard structure={structure} goal={goal} />
        </div>
      </div>

      <BodyLanguageCard bodyLanguage={bodyLanguage} isPro={isPaid} />

      {/* AI-rewritten script */}
      {fb.suggested_script && (
        <SuggestedScript
          script={fb.suggested_script}
          isPro={isPaid}
          originalTranscript={fb.transcript}
        />
      )}

      {/* Upgrade banner for free sessions */}
      {!isPaid && (
        <UpgradeBanner
          title="Want body language + AI script?"
          description="This was a free pitch. Upgrade to credits for body language analysis, an AI-rewritten script, and 5-minute recordings."
          ctaText="Get credits — from $9"
        />
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
