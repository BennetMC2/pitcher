"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Swords, Copy, Check, Loader2 } from "lucide-react";

interface ChallengeButtonProps {
  sessionId: string;
  score: number;
  grade: string;
}

export function ChallengeButton({ sessionId, score, grade }: ChallengeButtonProps) {
  const [loading, setLoading] = useState(false);
  const [challengeUrl, setChallengeUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleCreate() {
    setLoading(true);
    try {
      const res = await fetch("/api/challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, score, grade }),
      });
      const data = await res.json();
      if (data.code) {
        const url = `${window.location.origin}/challenge/${data.code}`;
        setChallengeUrl(url);
      }
    } catch {
      // Silent fail
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!challengeUrl) return;
    await navigator.clipboard.writeText(challengeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (challengeUrl) {
    return (
      <div className="flex items-center gap-2">
        <input
          readOnly
          value={challengeUrl}
          className="flex-1 rounded-md border bg-muted px-3 py-1.5 text-xs"
        />
        <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5 shrink-0">
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
    );
  }

  return (
    <Button variant="outline" size="sm" onClick={handleCreate} disabled={loading} className="gap-2">
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Swords className="h-4 w-4" />}
      Challenge a friend
    </Button>
  );
}
