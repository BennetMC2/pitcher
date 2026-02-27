import { createClient, createServiceClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import { CREDIT_PACKS, getStripePriceId } from "@/lib/constants";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const service = await createServiceClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { packId } = body;
    console.log("[checkout] packId:", packId);

    const pack = CREDIT_PACKS.find((p) => p.id === packId);
    if (!pack) {
      return NextResponse.json({ error: "Invalid pack" }, { status: 400 });
    }

    const priceId = getStripePriceId(packId);
    console.log("[checkout] priceId:", priceId || "(EMPTY)");

    if (!priceId) {
      return NextResponse.json(
        { error: `STRIPE_PRICE_PACK env var not set for ${packId}` },
        { status: 500 }
      );
    }

    const { data: sub } = await service
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();

    let customerId = sub?.stripe_customer_id;
    console.log("[checkout] existing customerId:", customerId || "(none)");

    // Create Stripe customer if needed
    if (!customerId) {
      console.log("[checkout] Creating Stripe customer...");
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;
      console.log("[checkout] Created customer:", customerId);
      await service
        .from("subscriptions")
        .update({ stripe_customer_id: customerId })
        .eq("user_id", user.id);
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    console.log("[checkout] Creating checkout session...");

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/dashboard?purchase=success`,
      cancel_url: `${appUrl}/pricing`,
      metadata: {
        supabase_user_id: user.id,
        pack_id: packId,
        credits: String(pack.credits),
      },
      allow_promotion_codes: true,
    });

    console.log("[checkout] Session created:", session.id, "url:", session.url);
    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[checkout] FAILED:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
