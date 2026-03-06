import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { sessionId, score, grade } = await request.json();
  if (!sessionId || score == null || !grade) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Check if challenge already exists for this session
  const { data: existing } = await supabase
    .from("challenges")
    .select("code")
    .eq("session_id", sessionId)
    .eq("challenger_id", user.id)
    .single();

  if (existing) {
    return NextResponse.json({ code: existing.code });
  }

  // Create new challenge
  const { data, error } = await supabase
    .from("challenges")
    .insert({
      challenger_id: user.id,
      session_id: sessionId,
      score,
      grade,
    })
    .select("code")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ code: data.code });
}
