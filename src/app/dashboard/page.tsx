import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { SessionList } from "@/components/dashboard/SessionList";
import { ProgressChart } from "@/components/dashboard/ProgressChart";
import { UsageBadge } from "@/components/shared/UsageBadge";
import { Plus } from "lucide-react";
import type { Database } from "@/types/database.types";

type SessionWithFeedback = Database["public"]["Tables"]["pitch_sessions"]["Row"] & {
  feedback?: { overall_score: number | null; grade: string | null } | null;
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // Use raw queries to avoid join type inference issues
  const [sessionsRes, feedbackRes, subRes] = await Promise.all([
    supabase
      .from("pitch_sessions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("feedback")
      .select("session_id, overall_score, grade")
      .eq("user_id", user.id),
    supabase
      .from("subscriptions")
      .select("pitches_used, credits")
      .eq("user_id", user.id)
      .single(),
  ]);

  const feedbackMap = new Map(
    (feedbackRes.data ?? []).map((f) => [
      f.session_id,
      { overall_score: f.overall_score, grade: f.grade },
    ])
  );

  const sessions: SessionWithFeedback[] = (sessionsRes.data ?? []).map((s) => ({
    ...s,
    feedback: feedbackMap.get(s.id) ?? null,
  }));

  const subscription = subRes.data as {
    pitches_used: number;
    credits: number;
  } | null;

  const chartData = sessions
    .filter((s) => s.status === "complete" && s.feedback?.overall_score != null)
    .slice()
    .reverse()
    .map((s, i) => ({
      date: s.created_at,
      score: s.feedback!.overall_score!,
      label: `#${i + 1}`,
    }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Track your pitch progress</p>
        </div>
        <div className="flex items-center gap-4">
          <UsageBadge
            pitchesUsed={subscription?.pitches_used ?? 0}
            credits={subscription?.credits ?? 0}
          />
          <Button asChild>
            <Link href="/dashboard/record">
              <Plus className="mr-1.5 h-4 w-4" />
              Record pitch
            </Link>
          </Button>
        </div>
      </div>

      {/* Progress chart */}
      {chartData.length >= 2 && <ProgressChart data={chartData} />}

      {/* Session list */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Recent pitches</h2>
        <SessionList sessions={sessions} />
      </div>
    </div>
  );
}
