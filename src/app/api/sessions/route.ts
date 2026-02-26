import { createClient, createServiceClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { FREE_PITCH_LIMIT, STORAGE_BUCKET } from "@/lib/constants";

// GET /api/sessions — list user's sessions
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("pitch_sessions")
    .select("*, feedback(overall_score, grade)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/sessions — create session + issue signed upload URL
export async function POST(request: Request) {
  const supabase = await createClient();
  const service = await createServiceClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Fetch usage + credits
  const { data: sub } = await service
    .from("subscriptions")
    .select("pitches_used, credits")
    .eq("user_id", user.id)
    .single();

  const used = sub?.pitches_used ?? 0;
  const credits = sub?.credits ?? 0;
  const hasFreeLeft = used < FREE_PITCH_LIMIT;
  const hasCredits = credits > 0;

  if (!hasFreeLeft && !hasCredits) {
    return NextResponse.json(
      { error: "No pitches remaining", code: "LIMIT_REACHED" },
      { status: 402 }
    );
  }

  // Use free pitches first; if none left, this pitch costs a credit
  const isPaid = !hasFreeLeft;

  const body = await request.json();
  const { title = "Untitled Pitch", duration_seconds } = body;

  // Create session row with is_paid flag
  const { data: session, error: sessionError } = await service
    .from("pitch_sessions")
    .insert({
      user_id: user.id,
      title,
      duration_seconds,
      status: "uploading",
      is_paid: isPaid,
    })
    .select()
    .single();

  if (sessionError || !session) {
    return NextResponse.json({ error: sessionError?.message ?? "DB error" }, { status: 500 });
  }

  // Issue signed upload URL (valid 10 minutes)
  const videoPath = `${user.id}/${session.id}/recording.webm`;
  const { data: signedData, error: signedError } = await service.storage
    .from(STORAGE_BUCKET)
    .createSignedUploadUrl(videoPath);

  if (signedError || !signedData) {
    return NextResponse.json({ error: "Failed to create upload URL" }, { status: 500 });
  }

  // Save video_path to session
  await service
    .from("pitch_sessions")
    .update({ video_path: videoPath })
    .eq("id", session.id);

  return NextResponse.json({
    sessionId: session.id,
    uploadUrl: signedData.signedUrl,
    videoPath,
    isPaid,
  });
}
