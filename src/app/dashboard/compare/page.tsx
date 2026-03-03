import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SessionPicker } from "@/components/compare/SessionPicker";
import { ComparisonView } from "@/components/compare/ComparisonView";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface CompareSession {
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
  } | null;
}

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ a?: string; b?: string }>;
}) {
  const { a, b } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // Fetch all completed sessions
  const { data: sessions } = await supabase
    .from("pitch_sessions")
    .select("id, title, created_at, goal")
    .eq("user_id", user.id)
    .eq("status", "complete")
    .order("created_at", { ascending: false });

  const completedSessions = (sessions ?? []) as { id: string; title: string; created_at: string; goal: string }[];

  // If both sessions selected, fetch their feedback
  let sessionA: CompareSession | null = null;
  let sessionB: CompareSession | null = null;

  if (a && b) {
    const [fbA, fbB] = await Promise.all([
      supabase
        .from("feedback")
        .select("overall_score, grade, confidence_level, wpm, filler_words, clarity_score, has_problem, has_solution, has_traction, has_ask, has_hook, eye_contact_pct, posture_score, gesture_score, top_strengths")
        .eq("session_id", a)
        .eq("user_id", user.id)
        .single(),
      supabase
        .from("feedback")
        .select("overall_score, grade, confidence_level, wpm, filler_words, clarity_score, has_problem, has_solution, has_traction, has_ask, has_hook, eye_contact_pct, posture_score, gesture_score, top_strengths")
        .eq("session_id", b)
        .eq("user_id", user.id)
        .single(),
    ]);

    const sessA = completedSessions.find((s) => s.id === a);
    const sessB = completedSessions.find((s) => s.id === b);

    if (sessA) {
      sessionA = {
        ...sessA,
        feedback: fbA.data as CompareSession["feedback"],
      };
    }
    if (sessB) {
      sessionB = {
        ...sessB,
        feedback: fbB.data as CompareSession["feedback"],
      };
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <Button variant="ghost" size="sm" asChild className="-ml-2 mb-4">
          <Link href="/dashboard">
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Dashboard
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Compare pitches</h1>
        <p className="text-muted-foreground">
          See how your pitches stack up side by side.
        </p>
      </div>

      <SessionPicker
        sessions={completedSessions}
        selectedA={a ?? null}
        selectedB={b ?? null}
      />

      {sessionA?.feedback && sessionB?.feedback && (
        <ComparisonView sessionA={sessionA} sessionB={sessionB} />
      )}
    </div>
  );
}
