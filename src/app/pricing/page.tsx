"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Coins, Loader2, Mic2, X, TrendingUp } from "lucide-react";
import { CREDIT_PACKS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

const freeFeatures = [
  "3 free pitches (lifetime)",
  "2-minute max recording",
  "Verbal delivery analysis",
  "Story structure analysis",
  "Overall confidence score & grade",
  "Coaching tips",
];

const creditFeatures = [
  "Body language analysis",
  "AI-rewritten script",
  "5-minute max recording",
  "All free features included",
];

export default function PricingPage() {
  const router = useRouter();
  const [loadingPack, setLoadingPack] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthed(!!user);
    }
    checkAuth();
  }, []);

  async function handleBuy(packId: string) {
    // If not authenticated, redirect to signup with purchase intent
    if (!isAuthed) {
      router.push(`/auth/signup?intent=purchase&pack=${packId}`);
      return;
    }

    setLoadingPack(packId);
    setError(null);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Failed to create checkout session");
        setLoadingPack(null);
      }
    } catch {
      setError("Network error — please try again");
      setLoadingPack(null);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Mic2 className="h-5 w-5 text-primary" />
            Nailed It
          </Link>
          <div className="flex items-center gap-3">
            {isAuthed === false && (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auth/login">Log in</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/record">Record a pitch</Link>
                </Button>
              </>
            )}
            {isAuthed === true && (
              <Button size="sm" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight">Simple pricing</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Start free. Buy credits when you need more.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {/* Free tier */}
            <div className="rounded-2xl border p-8">
              <h2 className="text-lg font-semibold">Free</h2>
              <p className="mt-1 text-sm text-muted-foreground">Try it out</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/forever</span>
              </div>
              <Button variant="outline" className="mt-6 w-full" asChild>
                <Link href="/record">Record your first pitch</Link>
              </Button>
              <ul className="mt-8 space-y-3">
                {freeFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Credit packs */}
            <div className="relative rounded-2xl border border-primary p-8 shadow-lg shadow-primary/10 ring-1 ring-primary">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                Pay as you go
              </Badge>
              <h2 className="text-lg font-semibold">Credit Packs</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                1 credit = 1 full-featured pitch. Never expires.
              </p>

              <div className="mt-6 space-y-3">
                {CREDIT_PACKS.map((pack) => {
                  const isBestValue = pack.id === "pack_50";
                  return (
                    <div
                      key={pack.id}
                      className={`rounded-xl border p-4 flex items-center justify-between ${
                        isBestValue ? "border-primary bg-primary/5" : ""
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{pack.credits} credits</span>
                          {isBestValue && (
                            <Badge variant="secondary" className="text-[10px]">
                              Best value
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {pack.perPitch}/pitch
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant={isBestValue ? "default" : "outline"}
                        disabled={loadingPack !== null}
                        onClick={() => handleBuy(pack.id)}
                        className="gap-1.5 min-w-[80px]"
                      >
                        {loadingPack === pack.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Coins className="h-3.5 w-3.5" />
                            {pack.priceLabel}
                          </>
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>

              {error && (
                <p className="mt-3 text-sm text-destructive text-center">{error}</p>
              )}

              <ul className="mt-8 space-y-3">
                {creditFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Social proof */}
          <div className="mt-12 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background px-5 py-2 shadow-sm">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm">
                <span className="font-bold text-primary">89%</span> of users improved their score by their second pitch
              </span>
            </div>
          </div>

          {/* Feature comparison table */}
          <div className="mt-16">
            <h2 className="text-center text-2xl font-bold mb-8">What&apos;s included</h2>
            <div className="overflow-hidden rounded-xl border">
              <div className="grid grid-cols-3 gap-0 border-b bg-muted/50 px-4 py-3 text-sm font-semibold">
                <span>Feature</span>
                <span className="text-center">Free</span>
                <span className="text-center">Credit</span>
              </div>
              {[
                { name: "Verbal delivery analysis", free: true, credit: true },
                { name: "Story structure breakdown", free: true, credit: true },
                { name: "Confidence score & grade", free: true, credit: true },
                { name: "Priority coaching tips", free: true, credit: true },
                { name: "Recording time", free: "2 min", credit: "5 min" },
                { name: "Body language analysis", free: false, credit: true },
                { name: "AI-rewritten script", free: false, credit: true },
                { name: "Credits expire", free: "—", credit: "Never" },
              ].map((f) => (
                <div key={f.name} className="grid grid-cols-3 gap-0 border-b last:border-0 px-4 py-3 text-sm">
                  <span>{f.name}</span>
                  <span className="flex justify-center">
                    {f.free === true ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : f.free === false ? (
                      <X className="h-4 w-4 text-muted-foreground/40" />
                    ) : (
                      <span className="text-muted-foreground">{f.free}</span>
                    )}
                  </span>
                  <span className="flex justify-center">
                    {f.credit === true ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <span className="text-muted-foreground">{String(f.credit)}</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-16">
            <h2 className="text-center text-2xl font-bold mb-8">Frequently asked questions</h2>
            <div className="space-y-4 max-w-2xl mx-auto">
              {[
                { q: "Do credits expire?", a: "No. Credits never expire. Use them whenever you're ready." },
                { q: "What counts as a 'pitch'?", a: "One recording + AI analysis = one pitch. Whether it's 30 seconds or 5 minutes." },
                { q: "Can I get a refund?", a: "Yes — email hello@nail-it.io within 7 days of purchase if you haven't used your credits." },
                { q: "What's the difference between free and credit pitches?", a: "Free pitches include verbal delivery and story structure analysis. Credit pitches add body language analysis, an AI-rewritten script, and 5-minute max recording." },
                { q: "Is my video stored securely?", a: "Yes. Videos are encrypted and stored securely. Only you can access your recordings and feedback." },
              ].map((faq) => (
                <details key={faq.q} className="group rounded-lg border px-4 py-3">
                  <summary className="cursor-pointer font-medium text-sm list-none flex items-center justify-between">
                    {faq.q}
                    <span className="text-muted-foreground group-open:rotate-180 transition-transform">▾</span>
                  </summary>
                  <p className="mt-2 text-sm text-muted-foreground">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>

          <p className="mt-12 text-center text-sm text-muted-foreground">
            Questions? Email us at{" "}
            <a href="mailto:hello@nail-it.io" className="text-primary hover:underline">
              hello@nail-it.io
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
