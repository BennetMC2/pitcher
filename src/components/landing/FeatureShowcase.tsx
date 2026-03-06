import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, X, Sparkles, ArrowRight } from "lucide-react";

const features = [
  { name: "Verbal delivery analysis", free: true, credit: true },
  { name: "Story structure breakdown", free: true, credit: true },
  { name: "Confidence score & grade", free: true, credit: true },
  { name: "Priority coaching tips", free: true, credit: true },
  { name: "Recording time", free: "2 min", credit: "5 min" },
  { name: "Body language analysis", free: false, credit: true },
  { name: "AI-rewritten script", free: false, credit: true },
];

export function FeatureShowcase() {
  return (
    <section id="pricing" className="py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Left: Free vs Pro table on pink/card background */}
          <div className="rounded-3xl bg-card clay-shadow p-8">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 mb-3">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">
                Free vs Credit pitches
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Start free. Go deeper with credits.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl clay-inset">
              {/* Header */}
              <div className="grid grid-cols-3 gap-0 bg-muted/30 px-4 py-3">
                <span className="text-xs font-semibold text-foreground">Feature</span>
                <span className="text-center text-xs font-semibold text-foreground">Free</span>
                <span className="text-center text-xs font-semibold text-foreground">
                  <span className="inline-flex items-center gap-1">
                    Credit
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary">
                      PRO
                    </span>
                  </span>
                </span>
              </div>
              {features.map((f, i) => (
                <div
                  key={f.name}
                  className={`grid grid-cols-3 gap-0 px-4 py-3 text-xs transition-colors hover:bg-muted/10 ${
                    i < features.length - 1 ? "border-b border-border/50" : ""
                  }`}
                >
                  <span className="font-medium">{f.name}</span>
                  <span className="flex justify-center">
                    {f.free === true ? (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-50">
                        <Check className="h-3 w-3 text-green-600" />
                      </span>
                    ) : f.free === false ? (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted">
                        <X className="h-3 w-3 text-muted-foreground/40" />
                      </span>
                    ) : (
                      <span className="text-muted-foreground font-medium">{f.free}</span>
                    )}
                  </span>
                  <span className="flex justify-center">
                    {f.credit === true ? (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-50">
                        <Check className="h-3 w-3 text-green-600" />
                      </span>
                    ) : (
                      <span className="font-semibold text-primary">{f.credit}</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Navy dark section */}
          <div className="rounded-3xl bg-navy clay-shadow p-8 flex flex-col justify-between">
            <div>
              <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">
                Don&apos;t wing it
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-white leading-tight">
                Don&apos;t practice on your investors.
              </h2>
              <p className="mt-4 text-sm text-white/60 leading-relaxed">
                Every pitch matters. Get feedback before you walk in the room — not after you walk out.
              </p>
            </div>

            {/* Illustration placeholder */}
            <div className="my-8 flex justify-center">
              <div className="h-32 w-32 rounded-2xl bg-white/5 clay-inset flex items-center justify-center">
                <Sparkles className="h-12 w-12 text-primary/60" />
              </div>
            </div>

            <Button
              size="lg"
              asChild
              className="w-full gap-2 text-base glow-teal animate-pulse-glow"
            >
              <Link href="/record">
                Start practicing now <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
