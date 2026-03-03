"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Coins, Loader2, Mic2 } from "lucide-react";
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
