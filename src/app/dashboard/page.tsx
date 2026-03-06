import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { SessionList } from "@/components/dashboard/SessionList";
import { ProgressChart } from "@/components/dashboard/ProgressChart";
import { UsageBadge } from "@/components/shared/UsageBadge";
import { AutoBuyHandler } from "@/components/dashboard/AutoBuyHandler";
import { UpgradeBanner } from "@/components/shared/UpgradeBanner";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, GitCompareArrows, TrendingUp, Trophy, BarChart3, Hash } from "lucide-react";
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

  const completedCount = sessions.filter((s) => s.status === "complete").length;
  const scores = chartData.map((d) => d.score);
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
  const bestScore = scores.length > 0 ? Math.max(...scores) : null;
  const improvement = scores.length >= 2 ? scores[scores.length - 1] - scores[0] : null;

  return (
    <div className="space-y-8">
      {/* Auto-buy handler (reads autoBuy from searchParams) */}
      <Suspense>
        <AutoBuyHandler />
      </Suspense>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Track your pitch progress</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <UsageBadge
            pitchesUsed={subscription?.pitches_used ?? 0}
            credits={subscription?.credits ?? 0}
          />
          {completedCount >= 2 && (
            <Button variant="outline" asChild>
              <Link href="/dashboard/compare">
                <GitCompareArrows className="mr-1.5 h-4 w-4" />
                Compare pitches
              </Link>
            </Button>
          )}
          <Button asChild>
            <Link href="/dashboard/record">
              <Plus className="mr-1.5 h-4 w-4" />
              Record pitch
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      {completedCount > 0 && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Hash className="h-3.5 w-3.5" />
                <span className="text-xs">Total pitches</span>
              </div>
              <p className="text-2xl font-bold">{completedCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <BarChart3 className="h-3.5 w-3.5" />
                <span className="text-xs">Avg score</span>
              </div>
              <p className="text-2xl font-bold">{avgScore ?? "—"}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Trophy className="h-3.5 w-3.5" />
                <span className="text-xs">Best score</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{bestScore ?? "—"}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <TrendingUp className="h-3.5 w-3.5" />
                <span className="text-xs">Improvement</span>
              </div>
              <p className={`text-2xl font-bold ${improvement !== null && improvement > 0 ? "text-green-600" : improvement !== null && improvement < 0 ? "text-red-600" : ""}`}>
                {improvement !== null ? `${improvement > 0 ? "+" : ""}${improvement}` : "—"}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Upgrade banner when out of pitches */}
      {(subscription?.pitches_used ?? 0) >= 3 && (subscription?.credits ?? 0) <= 0 && (
        <UpgradeBanner
          variant="compact"
          title="Out of free pitches"
          ctaText="Get credits"
        />
      )}

      {/* Progress chart */}
      {chartData.length >= 1 && <ProgressChart data={chartData} />}

      {/* Session list */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Recent pitches</h2>
        <SessionList sessions={sessions} />
      </div>
    </div>
  );
}
