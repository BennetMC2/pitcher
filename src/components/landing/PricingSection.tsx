import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Coins } from "lucide-react";
import { CREDIT_PACKS } from "@/lib/constants";

const freeFeatures = [
  "3 free pitches (lifetime)",
  "2-minute max recording",
  "Verbal & story analysis",
  "Overall confidence score",
  "Coaching tips",
];

const creditFeatures = [
  "Body language analysis",
  "AI-rewritten script",
  "5-minute max recording",
  "All free features included",
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start free. Buy credits when you&apos;re ready to go deeper.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {/* Free tier */}
          <div className="rounded-2xl border p-8">
            <h3 className="text-lg font-semibold">Free</h3>
            <p className="mt-1 text-sm text-muted-foreground">Perfect for trying it out</p>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-muted-foreground">/forever</span>
            </div>

            <ul className="mt-8 space-y-3">
              {freeFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-green-500 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <Button className="mt-8 w-full" variant="outline" size="lg" asChild>
              <Link href="/record">Record your first pitch</Link>
            </Button>
          </div>

          {/* Credit packs */}
          <div className="relative rounded-2xl border border-primary p-8 shadow-lg shadow-primary/10 ring-1 ring-primary">
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
              Pay as you go
            </Badge>

            <h3 className="text-lg font-semibold">Credit Packs</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              1 credit = 1 full-featured pitch. Never expires.
            </p>

            <div className="mt-6 space-y-3">
              {CREDIT_PACKS.map((pack) => {
                const isBestValue = pack.id === "pack_50";
                return (
                  <div
                    key={pack.id}
                    className={`rounded-xl border p-3 flex items-center justify-between ${
                      isBestValue ? "border-primary bg-primary/5" : ""
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <Coins className="h-3.5 w-3.5 text-yellow-500" />
                        <span className="font-semibold text-sm">{pack.credits} credits — {pack.priceLabel}</span>
                        {isBestValue && (
                          <Badge variant="secondary" className="text-[10px]">Best value</Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground ml-5.5">
                        {pack.perPitch}/pitch
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <ul className="mt-8 space-y-3">
              {creditFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-green-500 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <Button className="mt-8 w-full" size="lg" asChild>
              <Link href="/pricing">Buy credits</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
