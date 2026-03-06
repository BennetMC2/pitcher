"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Video, Cpu, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: Video,
    step: "01",
    title: "Record your pitch",
    description:
      "Hit record. Pitch like it's the real thing. No scripts. No second chances.",
    benefit: "Takes 2 minutes — just like a real elevator pitch",
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI analyzes everything",
    description:
      "Our AI rips apart your delivery — filler words, pacing, story gaps, body language. Nothing hides.",
    benefit: "6 dimensions analyzed in under 60 seconds",
  },
  {
    icon: TrendingUp,
    step: "03",
    title: "Get actionable feedback",
    description:
      "Get your confidence score, a rewritten script, and the 3 things to fix before you walk in that room.",
    benefit: "89% of users improve by their second pitch",
  },
];

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="how-it-works" className="py-28">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-3">
            The Process
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            From recording to coaching
            <br />
            <span className="text-muted-foreground">in minutes</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground max-w-xl mx-auto">
            No scheduling. No waiting. Just pitch, learn, and improve.
          </p>
        </motion.div>

        {/* Shared platform shelf */}
        <div className="rounded-3xl bg-[#8FAABE]/20 clay-shadow-lg p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-3 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 -translate-y-1/2 px-12 z-0">
              <div className="border-t-2 border-dashed border-primary/30 w-full" />
            </div>

            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
                className="relative z-10"
              >
                {/* Connector dots between cards (desktop) */}
                {i < steps.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-3 z-20 -translate-y-1/2">
                    <div className="h-3 w-3 rounded-full bg-primary clay-shadow-sm" />
                  </div>
                )}

                <div className="rounded-2xl bg-white clay-shadow p-6 h-full transition-all duration-300 hover:-translate-y-1">
                  {/* Illustration area (taller, inset) */}
                  <div className="clay-inset rounded-xl bg-blue-50/50 h-24 mb-5 flex items-center justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15">
                      <step.icon className="h-8 w-8 text-primary" />
                    </div>
                    {/* PLACEHOLDER: Step illustration */}
                  </div>

                  {/* Step number */}
                  <span className="text-4xl font-extrabold text-muted-foreground/10">
                    {step.step}
                  </span>

                  {/* Content */}
                  <h3 className="text-xl font-bold mt-2 mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {step.description}
                  </p>

                  {/* Benefit chip with glow */}
                  <div
                    className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1.5"
                    style={{ boxShadow: "0 0 8px rgba(0,229,204,0.3)" }}
                  >
                    <p className="text-xs font-semibold text-primary">
                      {step.benefit}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
