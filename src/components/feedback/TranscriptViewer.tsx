"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import type { WordTimestamp, FillerWord } from "@/types/feedback.types";

interface TranscriptViewerProps {
  transcript: string;
  wordTimestamps: WordTimestamp[];
  fillerWords: FillerWord[];
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function TranscriptViewer({
  transcript,
  wordTimestamps,
  fillerWords,
}: TranscriptViewerProps) {
  const [copied, setCopied] = useState(false);

  const fillerSet = new Set(
    fillerWords.map((f) => f.word.toLowerCase().replace(/[.,!?]/g, ""))
  );

  const hasTimestamps = wordTimestamps.length > 0;
  const totalFillers = fillerWords.reduce((sum, f) => sum + f.count, 0);

  async function handleCopy() {
    await navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Group words into paragraphs by detecting pauses > 1.5s
  function renderTimestampedTranscript() {
    const paragraphs: { startTime: number; words: WordTimestamp[] }[] = [];
    let currentPara: WordTimestamp[] = [];
    let paraStart = 0;

    wordTimestamps.forEach((w, i) => {
      if (i === 0) {
        paraStart = w.start;
        currentPara.push(w);
        return;
      }
      const gap = w.start - wordTimestamps[i - 1].end;
      if (gap > 1.5 && currentPara.length > 0) {
        paragraphs.push({ startTime: paraStart, words: currentPara });
        currentPara = [w];
        paraStart = w.start;
      } else {
        currentPara.push(w);
      }
    });
    if (currentPara.length > 0) {
      paragraphs.push({ startTime: paraStart, words: currentPara });
    }

    return paragraphs.map((para, pi) => (
      <div key={pi} className="flex gap-3">
        <span className="shrink-0 text-[10px] text-muted-foreground/60 font-mono w-8 pt-1 text-right">
          {formatTime(para.startTime)}
        </span>
        <p className="text-sm leading-7 flex-1">
          {para.words.map((w, i) => {
            const clean = w.word.toLowerCase().replace(/[.,!?]/g, "");
            const isFiller = fillerSet.has(clean);
            return (
              <span
                key={i}
                className={cn(
                  isFiller &&
                    "bg-yellow-100 text-yellow-800 rounded px-0.5 border border-yellow-300"
                )}
              >
                {w.word}{" "}
              </span>
            );
          })}
        </p>
      </div>
    ));
  }

  return (
    <div className="rounded-xl border bg-muted/30 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Transcript</h3>
        <div className="flex items-center gap-2">
          {fillerWords.length > 0 && (
            <span className="text-xs text-muted-foreground">
              <span className="inline-block h-2.5 w-2.5 rounded-sm bg-yellow-200 border border-yellow-400 mr-1" />
              {totalFillers} filler{totalFillers !== 1 ? "s" : ""}
            </span>
          )}
          <Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 gap-1.5 text-xs">
            {copied ? (
              <><Check className="h-3 w-3" /> Copied</>
            ) : (
              <><Copy className="h-3 w-3" /> Copy</>
            )}
          </Button>
        </div>
      </div>

      {/* Filler summary */}
      {fillerWords.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {fillerWords.slice(0, 6).map((f) => (
            <span
              key={f.word}
              className="inline-flex items-center rounded-md bg-yellow-50 border border-yellow-200 px-2 py-0.5 text-xs"
            >
              &ldquo;{f.word}&rdquo; <span className="ml-1 font-semibold text-yellow-700">x{f.count}</span>
            </span>
          ))}
        </div>
      )}

      <div className="space-y-3">
        {hasTimestamps ? (
          renderTimestampedTranscript()
        ) : (
          <p className="text-sm leading-7">{transcript}</p>
        )}
      </div>
    </div>
  );
}
