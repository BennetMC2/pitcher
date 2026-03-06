import { createClient, createServiceClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { after } from "next/server";
import { transcribeAudio } from "@/lib/ai/transcribe";
import { analyzeVerbalDelivery, analyzeStoryStructure } from "@/lib/ai/analyzeTranscript";
import {
  analyzeBodyLanguage,
  defaultBodyLanguageAnalysis,
} from "@/lib/ai/analyzeBodyLanguage";
import { buildOverallFeedback } from "@/lib/ai/buildFeedback";
import { STORAGE_BUCKET } from "@/lib/constants";
import type { PitchGoal } from "@/lib/constants";
import type { MediaPipeFrameData } from "@/types/feedback.types";

export const maxDuration = 300;

export async function POST(request: Request) {
  const supabase = await createClient();
  const service = await createServiceClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { sessionId, browserTranscript } = await request.json();
  if (!sessionId) {
    return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
  }

  // Verify session ownership and get is_paid flag + goal
  const { data: sessionData } = await service
    .from("pitch_sessions")
    .select("id, video_path, body_language_raw, duration_seconds, is_paid, goal")
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .single();

  const session = sessionData as SessionRow | null;

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  // Mark as processing
  await service
    .from("pitch_sessions")
    .update({ status: "processing" })
    .eq("id", sessionId);

  // Use Next.js after() to keep the pipeline alive after the response is sent
  after(async () => {
    try {
      await runPipeline(service, session, user.id, browserTranscript);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("Analysis pipeline failed:", msg);
      // Store error in title so we can debug
      await service
        .from("pitch_sessions")
        .update({ status: "failed", title: `ERROR: ${msg.slice(0, 200)}` })
        .eq("id", sessionId);
    }
  });

  return NextResponse.json({ status: "processing", sessionId }, { status: 202 });
}

type SupabaseServiceClient = Awaited<ReturnType<typeof createServiceClient>>;

interface SessionRow {
  id: string;
  video_path: string | null;
  body_language_raw: unknown;
  duration_seconds: number | null;
  is_paid: boolean;
  goal: string;
}

async function runPipeline(
  service: SupabaseServiceClient,
  session: SessionRow,
  userId: string,
  browserTranscript?: string
) {
  const sessionId = session.id;
  const isPaid = session.is_paid;
  const goal = (session.goal || "startup_pitch") as PitchGoal;
  console.log("[analyze] Starting pipeline for session:", sessionId, "isPaid:", isPaid, "goal:", goal);

  async function setStep(step: string) {
    await service
      .from("pitch_sessions")
      .update({ analysis_step: step })
      .eq("id", sessionId);
  }

  // ── Step 1-2: Get transcript ──────────────────────────────────────────────
  await setStep("transcribing");
  let transcript: string;
  let wordTimestamps: { word: string; start: number; end: number }[] = [];

  if (browserTranscript && browserTranscript.trim().length >= 10) {
    transcript = browserTranscript.trim();
    console.log("[analyze] Using browser transcript:", transcript.slice(0, 100));
  } else if (session.video_path && process.env.OPENAI_API_KEY) {
    console.log("[analyze] Trying Whisper transcription...");
    const { data: fileData, error: dlError } = await service.storage
      .from(STORAGE_BUCKET)
      .download(session.video_path);

    if (dlError || !fileData) {
      throw new Error(`Failed to download video: ${dlError?.message}`);
    }

    const audioBuffer = await fileData.arrayBuffer();
    const result = await transcribeAudio(audioBuffer);
    transcript = result.text;
    wordTimestamps = result.words;
    console.log("[analyze] Whisper done:", transcript.slice(0, 100));
  } else {
    throw new Error("No transcript available — no speech detected");
  }

  if (!transcript || transcript.trim().length < 10) {
    throw new Error("Transcript too short — no speech detected");
  }

  console.log("[analyze] Transcript ready, length:", transcript.length);

  // ── Steps 3-5: Parallel Haiku analysis ───────────────────────────────────
  await setStep("analyzing");
  const duration = session.duration_seconds ?? 60;
  const rawFrames = (session.body_language_raw as MediaPipeFrameData[]) ?? [];

  // Only run body language analysis for paid pitches with frame data
  const shouldAnalyzeBodyLanguage = isPaid && rawFrames.length > 0;

  const [verbal, structure, bodyLanguage] = await Promise.all([
    analyzeVerbalDelivery(transcript, duration),
    analyzeStoryStructure(transcript, goal),
    shouldAnalyzeBodyLanguage
      ? analyzeBodyLanguage(rawFrames)
      : Promise.resolve(defaultBodyLanguageAnalysis()),
  ]);

  console.log("[analyze] Claude analysis done");

  // ── Step 6: Sonnet synthesis ───────────────────────────────────────────────
  await setStep("synthesizing");
  // For free pitches, pass skipScript flag so synthesis doesn't generate a script
  const overall = await buildOverallFeedback(
    transcript,
    verbal,
    structure,
    bodyLanguage,
    !isPaid, // skipScript for free pitches
    goal
  );

  console.log("[analyze] Synthesis done. Score:", overall.overall_score);

  // ── Step 7: Write feedback row ─────────────────────────────────────────────
  await setStep("saving");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const feedbackRow: Record<string, any> = {
    session_id: sessionId,
    user_id: userId,
    transcript,
    word_timestamps: wordTimestamps.length > 0 ? wordTimestamps : null,
    wpm: verbal.wpm,
    filler_words: verbal.filler_words,
    clarity_score: verbal.clarity_score,
    conciseness: verbal.conciseness,
    pacing_assessment: verbal.pacing_assessment,
    has_problem: structure.has_problem,
    has_solution: structure.has_solution,
    has_traction: structure.has_traction,
    has_ask: structure.has_ask,
    structure_notes: structure.structure_notes,
    missing_elements: structure.missing_elements,
    has_hook: structure.has_hook ?? null,
    hook_notes: structure.hook_notes ?? null,
    eye_contact_pct: bodyLanguage.eye_contact_pct,
    posture_score: bodyLanguage.posture_score,
    gesture_score: bodyLanguage.gesture_score,
    body_language_notes: bodyLanguage.body_language_notes,
    overall_score: overall.overall_score,
    grade: overall.grade,
    confidence_level: overall.confidence_level,
    top_strengths: overall.top_strengths,
    priority_improvements: overall.priority_improvements,
    suggested_script: isPaid ? (overall.suggested_script || null) : null,
  };

  // Try insert; if suggested_script column doesn't exist yet, retry without it
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let { error: feedbackError } = await (service.from("feedback") as any).insert(feedbackRow);
  if (feedbackError && (feedbackError.code === "42703" || feedbackError.message?.includes("suggested_script"))) {
    console.log("[analyze] suggested_script column missing, retrying without it");
    const { suggested_script: _, ...rowWithout } = feedbackRow;
    const retry = await (service.from("feedback") as any).insert(rowWithout);
    feedbackError = retry.error;
  }

  if (feedbackError) throw new Error(`Failed to write feedback: ${feedbackError.message}`);

  // Mark complete + increment usage + deduct credit (if paid)
  await Promise.all([
    service
      .from("pitch_sessions")
      .update({ status: "complete" })
      .eq("id", sessionId)
      .then(),
    service.rpc("increment_pitch_usage", { uid: userId }).then(),
    ...(isPaid ? [service.rpc("deduct_credit", { uid: userId }).then()] : []),
  ]);

  console.log("[analyze] Pipeline complete for session:", sessionId, isPaid ? "(credit deducted)" : "(free)");
}
