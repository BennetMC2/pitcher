"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const testimonials = [
  {
    quote:
      "I used Nailed It 3 days before my YC interview. It caught that I was saying 'um' 23 times in two minutes. Got the interview, got in.",
    author: "Sarah K.",
    role: "Founder, YC W24",
    initials: "SK",
    highlight: "Got into YC",
  },
  {
    quote:
      "The story structure analysis was brutal — I had no 'ask' in my pitch. Fixed it in one session. Closed our seed round 2 weeks later.",
    author: "Marcus T.",
    role: "CEO, raised $1.2M",
    initials: "MT",
    highlight: "Raised $1.2M",
  },
  {
    quote:
      "I never realized I looked down at my notes 40% of the time. The eye contact score was a wake-up call. My next pitch felt completely different.",
    author: "Priya R.",
    role: "Co-founder, Demo Day finalist",
    initials: "PR",
    highlight: "Demo Day finalist",
  },
  {
    quote:
      "Practiced my conference talk opening 4 times. Went from a 62 to an 87. The AI script suggestions were better than my original.",
    author: "Daniel M.",
    role: "CTO, SaaS startup",
    initials: "DM",
    highlight: "62 → 87 score",
  },
  {
    quote:
      "Used the rizz check before a networking event. Turns out I talk way too fast when nervous. The pacing feedback was a game-changer.",
    author: "Aisha L.",
    role: "Product Manager",
    initials: "AL",
    highlight: "Pacing improved",
  },
  {
    quote:
      "The coaching tips nailed exactly what I needed to fix. Three specific, actionable things. Not generic advice — real feedback on my actual pitch.",
    author: "James W.",
    role: "Sales Director",
    initials: "JW",
    highlight: "Actionable tips",
  },
];

const stats = [
  { value: "89%", numericPct: 89, label: "improved by second pitch" },
  { value: "2,000+", numericPct: 80, label: "pitches analyzed" },
  { value: "< 60s", numericPct: 95, label: "average analysis time" },
];

const vcLogos = ["Y COMBINATOR", "TECHSTARS", "SEQUOIA", "A16Z", "STANFORD"];

function RingGauge({ pct }: { pct: number }) {
  const r = 32;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width="80" height="80" className="-rotate-90 shrink-0">
      <circle cx="40" cy="40" r={r} fill="none" stroke="currentColor" strokeWidth="6" className="text-muted/50" />
      <circle
        cx="40"
        cy="40"
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="text-primary"
        style={{ transition: "stroke-dashoffset 1.2s ease-out" }}
      />
    </svg>
  );
}

export function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section className="py-28" ref={ref}>
      <div className="mx-auto max-w-5xl px-6">
        {/* Circular gauge stats on blue platform strip */}
        <div className="mb-16 rounded-2xl bg-[#A3C1D4]/20 clay-shadow p-4 md:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-2xl bg-white clay-shadow p-5 flex items-center gap-4"
              >
                <div className="relative">
                  <RingGauge pct={isInView ? stat.numericPct : 0} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-extrabold text-primary">{stat.value}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-14"
        >
          <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-3">
            The Wall of Proof
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Founders who pitched better
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Real results from real people.
          </p>
        </motion.div>

        {/* Glass testimonial pods */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.author}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
              className="group rounded-2xl bg-white/70 backdrop-blur-sm border border-white/50 clay-shadow p-6 transition-all duration-300 hover:-translate-y-1"
            >
              {/* VERIFIED badge */}
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary uppercase tracking-wider mb-4">
                Verified
              </span>

              <p className="text-sm leading-relaxed text-foreground/80">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="mt-5 flex items-center gap-3 pt-4 border-t border-border/30">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary clay-shadow-sm text-secondary-foreground text-xs font-bold">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.author}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* VC logo bar */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground mb-4">Trusted by founders from</p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {vcLogos.map((logo) => (
              <span
                key={logo}
                className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground/50"
              >
                {logo}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
