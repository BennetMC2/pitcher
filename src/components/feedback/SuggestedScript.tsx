"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Sparkles, Copy, Check, ArrowLeftRight } from "lucide-react";
import Link from "next/link";

interface SuggestedScriptProps {
  script: string;
  isPro: boolean;
  originalTranscript?: string | null;
}

export function SuggestedScript({ script, isPro, originalTranscript }: SuggestedScriptProps) {
  const [copied, setCopied] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  if (!script) return null;

  const lines = script.split("\n").filter((l) => l.trim().length > 0);
  const previewLines = lines.slice(0, 3);
  const hiddenLines = lines.slice(3);

  async function handleCopy() {
    await navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">AI-Rewritten Script</CardTitle>
          </div>
          {isPro && (
            <div className="flex items-center gap-1.5">
              {originalTranscript && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowOriginal(!showOriginal)}
                  className="gap-1.5 h-7 text-xs"
                >
                  <ArrowLeftRight className="h-3 w-3" />
                  {showOriginal ? "Show rewrite" : "Compare original"}
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="gap-1.5 h-7 text-xs"
              >
                {copied ? (
                  <><Check className="h-3 w-3" /> Copied</>
                ) : (
                  <><Copy className="h-3 w-3" /> Copy</>
                )}
              </Button>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Your pitch rewritten with better structure, clearer language, and a
          stronger ask
        </p>
      </CardHeader>
      <CardContent>
        {showOriginal && originalTranscript ? (
          <div className="rounded-lg bg-muted/50 p-4 space-y-3 text-sm leading-relaxed">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Original transcript</p>
            <p>{originalTranscript}</p>
          </div>
        ) : (
          <div className="rounded-lg bg-muted/50 p-4 space-y-3 text-sm leading-relaxed">
            {/* Always-visible preview */}
            {previewLines.map((line, i) => (
              <p key={i}>{line}</p>
            ))}

            {/* Blurred section for free users, visible for Pro */}
            {hiddenLines.length > 0 && (
              <div className="relative">
                <div className={!isPro ? "blur-sm select-none" : ""}>
                  {hiddenLines.map((line, i) => (
                    <p key={i} className="mb-3 last:mb-0">
                      {line}
                    </p>
                  ))}
                </div>

                {!isPro && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/40 rounded-lg">
                    <Lock className="h-6 w-6 text-muted-foreground" />
                    <p className="font-semibold text-sm">
                      AI-rewritten script included with credits
                    </p>
                    <Link
                      href="/pricing"
                      className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      Get credits — from $1.80/pitch
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
