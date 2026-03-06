"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, X, Sparkles, ArrowRight } from "lucide-react";

const features: { name: string; free: boolean | string; credit: boolean | string; highlight?: boolean }[] = [
  { name: "Verbal delivery analysis", free: true, credit: true },
  { name: "Story structure breakdown", free: true, credit: true },
  { name: "Confidence score & grade", free: true, credit: true },
  { name: "Priority coaching tips", free: true, credit: true },
  { name: "Recording time", free: "2 min", credit: "5 min" },
  { name: "Body language analysis", free: false, credit: true, highlight: true },
  { name: "AI-rewritten script", free: false, credit: true, highlight: true },
];

export function FeatureShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section id="pricing" className="py-16" ref={ref}>
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Left: Free vs Pro pricing table */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-card clay-shadow p-8"
          >
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

            {/* Feature rows as pill modules */}
            <div className="space-y-3">
              {/* Header row */}
              <div className="grid grid-cols-3 gap-0 px-4 py-2">
                <span className="text-xs font-semibold text-muted-foreground">Feature</span>
                <span className="text-center text-xs font-semibold text-muted-foreground">Free</span>
                <span className="text-center text-xs font-semibold">
                  <span className="inline-flex items-center gap-1 text-foreground">
                    Credit
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary">
                      PRO
                    </span>
                  </span>
                </span>
              </div>

              {features.map((f) => (
                <div
                  key={f.name}
                  className={`grid grid-cols-3 gap-0 rounded-xl p-4 items-center ${
                    f.highlight
                      ? "bg-[#FFF8DC] clay-shadow-sm"
                      : "bg-white clay-shadow-sm"
                  }`}
                >
                  <span className="text-sm font-medium">{f.name}</span>
                  <span className="flex justify-center">
                    {f.free === true ? (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                        <Check className="h-3.5 w-3.5 text-green-600" />
                      </span>
                    ) : f.free === false ? (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-50">
                        <X className="h-3.5 w-3.5 text-red-400" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-3 py-1 text-sm font-medium">
                        {f.free}
                      </span>
                    )}
                  </span>
                  <span className="flex justify-center">
                    {f.credit === true ? (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                        <Check className="h-3.5 w-3.5 text-green-600" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-3 py-1 text-sm font-semibold">
                        {f.credit}
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>

            {/* Illustration placeholders */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-[#FFF8DC] clay-inset p-4 flex items-center justify-center h-20 text-xs text-muted-foreground">
                {/* PLACEHOLDER: AI Rewritten Script illustration */}
              </div>
              <div className="rounded-xl bg-[#FFF8DC] clay-inset p-4 flex items-center justify-center h-20 text-xs text-muted-foreground">
                {/* PLACEHOLDER: Body Language analysis illustration */}
              </div>
            </div>

            {/* Free CTA button */}
            <div className="mt-6 text-center">
              <Link
                href="/record"
                className="inline-flex items-center gap-2 bg-white text-foreground rounded-full clay-shadow-sm hover:clay-shadow px-6 py-3 font-medium text-sm transition-all duration-200"
              >
                Record your first pitch free <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          {/* Right: Navy dark CTA section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="rounded-3xl bg-[#1E293B] clay-shadow p-8 flex flex-col justify-between"
          >
            <div>
              <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">
                Don&apos;t wing it
              </p>
              <h2 className="text-4xl font-black tracking-tight text-white leading-tight">
                Don&apos;t practice on your investors.
              </h2>
              <p className="mt-4 text-sm text-white/60 leading-relaxed">
                Every pitch matters. Get feedback before you walk in the room — not after you walk out.
              </p>
            </div>

            {/* Illustration placeholder */}
            <div className="my-8 w-full h-48 rounded-2xl bg-slate-800/50 flex items-center justify-center text-slate-500">
              {/* PLACEHOLDER: Isometric scene illustration */}
              <Sparkles className="h-12 w-12 text-primary/40" />
            </div>

            <Button
              size="lg"
              asChild
              className="w-full gap-2 text-base glow-teal-strong animate-pulse-glow"
            >
              <Link href="/record">
                Start practicing now <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
