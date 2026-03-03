"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { RecordingStudio } from "@/components/record/RecordingStudio";
import { GoalSelector } from "@/components/record/GoalSelector";
import { PreRecordingTips } from "@/components/record/PreRecordingTips";
import { AuthModal } from "@/components/auth/AuthModal";
import { useRecordingStore } from "@/store/recordingStore";
import { useUpload } from "@/hooks/useUpload";
import { useTranscription } from "@/hooks/useTranscription";
import { storeRecordingBlob, retrieveRecordingBlob, clearRecordingBlob } from "@/lib/storage/indexedDB";
import { createClient } from "@/lib/supabase/client";
import { Mic2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FREE_MAX_RECORDING_SECONDS } from "@/lib/constants";
import type { PitchGoal } from "@/lib/constants";

function RecordPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resume = searchParams.get("resume");
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const goal = useRecordingStore((s) => s.goal);
  const setGoal = useRecordingStore((s) => s.setGoal);
  const videoBlob = useRecordingStore((s) => s.videoBlob);
  const reset = useRecordingStore((s) => s.reset);
  const setPhase = useRecordingStore((s) => s.setPhase);
  const setVideoBlob = useRecordingStore((s) => s.setVideoBlob);

  const { upload } = useUpload();
  const { transcript } = useTranscription();

  // Reset recording state on initial mount (but not on resume)
  useEffect(() => {
    if (!resume) {
      reset();
    }
  }, [reset, resume]);

  // Handle resume after OAuth redirect
  useEffect(() => {
    if (resume !== "true") return;

    async function restoreRecording() {
      try {
        const stored = await retrieveRecordingBlob();
        if (!stored) return;

        // Restore the recording state
        const url = URL.createObjectURL(stored.blob);
        setVideoBlob(stored.blob, url);
        setGoal(stored.goal as PitchGoal);
        setPhase("review");

        // Now auto-upload since user is authenticated
        const result = await upload("Untitled Pitch", stored.transcript);
        if (result) {
          await clearRecordingBlob();
          router.push(`/dashboard/session/${result.sessionId}`);
        }
      } catch (err) {
        console.error("Failed to restore recording:", err);
      }
    }

    restoreRecording();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resume]);

  // Called when anonymous user clicks "See my results"
  const handleAuthRequired = useCallback(() => {
    setAuthModalOpen(true);
  }, []);

  // Called when user successfully authenticates via email (no redirect)
  const handleAuthenticated = useCallback(async () => {
    setAuthModalOpen(false);

    if (!videoBlob || !goal) return;

    // Upload directly — user is now authed
    const result = await upload("Untitled Pitch", transcript);
    if (result) {
      router.push(`/dashboard/session/${result.sessionId}`);
    }
  }, [videoBlob, goal, upload, transcript, router]);

  // Called before Google OAuth redirect — save blob to IndexedDB
  const handleBeforeOAuthRedirect = useCallback(async () => {
    if (!videoBlob || !goal) return;
    await storeRecordingBlob(videoBlob, goal, transcript);
  }, [videoBlob, goal, transcript]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Mic2 className="h-5 w-5 text-primary" />
            Nailed It
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth/login">Log in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/auth/signup">Sign up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-2xl space-y-6 px-6">
          <div>
            <h1 className="text-2xl font-bold">Record your pitch</h1>
            <p className="text-muted-foreground">
              Deliver your pitch to the camera. You have 2 minutes max.
              Sign up after to see your AI feedback.
            </p>
          </div>

          <GoalSelector selected={goal} onSelect={setGoal} />

          {goal && <PreRecordingTips goal={goal} />}

          <RecordingStudio
            maxSeconds={FREE_MAX_RECORDING_SECONDS}
            canRecord={true}
            onUpgradeNeeded={() => {}}
            goal={goal}
            mode="anonymous"
            onAuthRequired={handleAuthRequired}
          />
        </div>
      </main>

      <AuthModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        onAuthenticated={handleAuthenticated}
        onBeforeOAuthRedirect={handleBeforeOAuthRedirect}
      />
    </div>
  );
}

export default function PublicRecordPage() {
  return (
    <Suspense>
      <RecordPageInner />
    </Suspense>
  );
}
