import { createClient, createServiceClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const service = await createServiceClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { sessionId, frames } = await request.json();
  if (!sessionId || !frames) {
    return NextResponse.json({ error: "Missing sessionId or frames" }, { status: 400 });
  }

  // Verify session belongs to user
  const { data: session } = await service
    .from("pitch_sessions")
    .select("id, user_id")
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .single();

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const { error } = await service
    .from("pitch_sessions")
    .update({ body_language_raw: frames })
    .eq("id", sessionId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
