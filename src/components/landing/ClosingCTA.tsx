"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function ClosingCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section className="py-16" ref={ref}>
      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="rounded-3xl bg-[#1E293B] clay-shadow-lg p-10 md:p-14 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">
            Your next pitch could be your best one
          </h2>
          <p className="mt-4 text-base text-white/60 max-w-xl mx-auto leading-relaxed">
            Record, get feedback, and improve — all in under 5 minutes.
            No credit card. No sign-up required.
          </p>
          <div className="mt-8">
            <Button
              size="lg"
              asChild
              className="gap-2 text-base glow-teal-strong animate-pulse-glow"
            >
              <Link href="/record">
                Record your first pitch free <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-white/40">
            Join 2,000+ founders who&apos;ve already improved their pitch
          </p>
        </motion.div>
      </div>
    </section>
  );
}
