"use client";

import { cn } from "@/lib/utils";
import type { WordTimestamp, FillerWord } from "@/types/feedback.types";

interface TranscriptViewerProps {
  transcript: string;
  wordTimestamps: WordTimestamp[];
  fillerWords: FillerWord[];
}

export function TranscriptViewer({
  transcript,
  wordTimestamps,
  fillerWords,
}: TranscriptViewerProps) {
  const fillerSet = new Set(
    fillerWords.map((f) => f.word.toLowerCase().replace(/[.,!?]/g, ""))
  );

  const hasTimestamps = wordTimestamps.length > 0;

  return (
    <div className="rounded-xl border bg-muted/30 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Transcript</h3>
        {fillerWords.length > 0 && (
          <span className="text-xs text-muted-foreground">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-yellow-200 border border-yellow-400 mr-1" />
            filler words highlighted
          </span>
        )}
      </div>

      {hasTimestamps ? (
        <p className="text-sm leading-7">
          {wordTimestamps.map((w, i) => {
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
      ) : (
        <p className="text-sm leading-7">{transcript}</p>
      )}
    </div>
  );
}
