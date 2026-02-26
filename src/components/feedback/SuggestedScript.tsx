"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Sparkles } from "lucide-react";
import Link from "next/link";

interface SuggestedScriptProps {
  script: string;
  isPro: boolean;
}

export function SuggestedScript({ script, isPro }: SuggestedScriptProps) {
  if (!script) return null;

  // Split into lines/paragraphs — show first 3 lines free, blur the rest
  const lines = script.split("\n").filter((l) => l.trim().length > 0);
  const previewLines = lines.slice(0, 3);
  const hiddenLines = lines.slice(3);

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <CardTitle className="text-base">AI-Rewritten Script</CardTitle>
        </div>
        <p className="text-xs text-muted-foreground">
          Your pitch rewritten with better structure, clearer language, and a
          stronger ask
        </p>
      </CardHeader>
      <CardContent>
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
                    Included with credit pitches
                  </p>
                  <Link
                    href="/pricing"
                    className="text-xs text-primary hover:underline font-medium"
                  >
                    Buy credits →
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
