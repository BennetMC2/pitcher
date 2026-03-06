"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Mic2, ChevronRight, Clock, CheckCircle2, XCircle, Loader2, Video, TrendingUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Database } from "@/types/database.types";

type Session = Database["public"]["Tables"]["pitch_sessions"]["Row"] & {
  feedback?: { overall_score: number | null; grade: string | null } | null;
};

interface SessionListProps {
  sessions: Session[];
  loading?: boolean;
}

function StatusBadge({ status }: { status: Session["status"] }) {
  switch (status) {
    case "complete":
      return (
        <Badge variant="secondary" className="gap-1 text-green-600">
          <CheckCircle2 className="h-3 w-3" /> Complete
        </Badge>
      );
    case "processing":
      return (
        <Badge variant="secondary" className="gap-1">
          <Loader2 className="h-3 w-3 animate-spin" /> Analyzing
        </Badge>
      );
    case "uploading":
      return (
        <Badge variant="secondary" className="gap-1">
          <Clock className="h-3 w-3" /> Uploading
        </Badge>
      );
    case "failed":
      return (
        <Badge variant="destructive" className="gap-1">
          <XCircle className="h-3 w-3" /> Failed
        </Badge>
      );
  }
}

function ScorePill({ score, grade }: { score: number | null; grade: string | null }) {
  if (score == null) return null;
  const color =
    score >= 80 ? "text-green-600" : score >= 60 ? "text-yellow-600" : "text-red-600";
  return (
    <div className={`text-right ${color}`}>
      <span className="text-xl font-bold">{score}</span>
      <span className="text-xs text-muted-foreground ml-0.5">/100</span>
      {grade && <div className="text-xs font-medium">{grade}</div>}
    </div>
  );
}

export function SessionList({ sessions, loading }: SessionListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-4">
          <Mic2 className="h-7 w-7 text-primary" />
        </div>
        <h3 className="text-lg font-semibold">Record your first pitch</h3>
        <p className="mt-1 text-sm text-muted-foreground max-w-sm">
          Get your confidence score, verbal analysis, and personalized coaching tips in under 60 seconds.
        </p>
        <div className="mt-4 flex flex-col items-center gap-3">
          <Button asChild>
            <Link href="/dashboard/record" className="gap-2">
              <Video className="h-4 w-4" />
              Record now
            </Link>
          </Button>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Score & grade</span>
            <span className="flex items-center gap-1"><Sparkles className="h-3 w-3" /> AI coaching</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sessions.map((session) => (
        <Link
          key={session.id}
          href={`/dashboard/session/${session.id}`}
          className="flex items-center gap-4 rounded-xl border bg-card p-4 transition-colors hover:bg-accent"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Mic2 className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{session.title}</p>
            <div className="mt-1 flex items-center gap-2">
              <StatusBadge status={session.status} />
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(session.created_at), { addSuffix: true })}
              </span>
              {session.duration_seconds && (
                <span className="text-xs text-muted-foreground">
                  · {Math.round(session.duration_seconds)}s
                </span>
              )}
            </div>
          </div>
          {session.feedback && (
            <ScorePill
              score={session.feedback.overall_score}
              grade={session.feedback.grade}
            />
          )}
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        </Link>
      ))}
    </div>
  );
}
