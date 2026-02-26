import { stripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const service = await createServiceClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerId = session.customer as string;
    const userId = session.metadata?.supabase_user_id;
    const credits = parseInt(session.metadata?.credits ?? "0", 10);
    const packId = session.metadata?.pack_id;

    if (!userId || !credits) {
      console.error("Missing metadata on checkout session:", session.id);
      return NextResponse.json({ received: true });
    }

    // Add credits to user's balance
    await service.rpc("add_credits", { uid: userId, amount: credits });

    // Save stripe_customer_id if present
    if (customerId) {
      await service
        .from("subscriptions")
        .update({ stripe_customer_id: customerId })
        .eq("user_id", userId);
    }

    // Insert audit row
    await service.from("credit_purchases").insert({
      user_id: userId,
      stripe_session_id: session.id,
      pack_credits: credits,
      amount_cents: session.amount_total ?? 0,
    });

    console.log(`[webhook] Added ${credits} credits for user ${userId} (pack: ${packId})`);
  }

  return NextResponse.json({ received: true });
}
