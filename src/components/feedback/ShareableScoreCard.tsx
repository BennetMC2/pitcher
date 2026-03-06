"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Copy, Check, Twitter } from "lucide-react";

interface ShareableScoreCardProps {
  score: number;
  grade: string;
  sessionId: string;
}

export function ShareableScoreCard({ score, grade, sessionId }: ShareableScoreCardProps) {
  const [copied, setCopied] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const shareText = `I just scored ${score}/100 (${grade}) on my pitch with Nailed It AI Coach! 🎤`;
  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/dashboard/session/${sessionId}`;

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Nailed It Score",
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // User cancelled
      }
    } else {
      setShowOptions(!showOptions);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleTwitter() {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "width=550,height=420");
  }

  return (
    <div className="space-y-2">
      <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
        <Share2 className="h-4 w-4" />
        Share your score
      </Button>

      {showOptions && (
        <div className="flex items-center gap-2 animate-fade-in-up">
          <Button variant="ghost" size="sm" onClick={handleCopy} className="gap-1.5 h-8 text-xs">
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied!" : "Copy"}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleTwitter} className="gap-1.5 h-8 text-xs">
            <Twitter className="h-3 w-3" />
            Twitter
          </Button>
        </div>
      )}
    </div>
  );
}
