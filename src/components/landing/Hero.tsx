"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play, Mic, BarChart3, Eye, BookOpen, Sparkles, MessageSquare, User } from "lucide-react";

const mockStats = [
  { label: "Verbal Clarity", value: 91, display: "91", unit: "/100", icon: Mic, barPct: 91, barColor: "#22C55E" },
  { label: "Story Structure", value: 75, display: "3/4", unit: " elements", icon: BookOpen, barPct: 75, barColor: "#F59E0B" },
  { label: "Confidence", value: 84, display: "84", unit: "/100", icon: BarChart3, barPct: 84, barColor: "#22C55E" },
  { label: "Eye Contact", value: 78, display: "78", unit: "%", icon: Eye, barPct: 78, barColor: "#EF4444" },
];

function AnimatedCounter({ target, visible }: { target: number; visible: boolean }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();
    function step(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [target, visible]);
  return <>{count}</>;
}

export function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section className="relative overflow-hidden pt-24 pb-16">
      {/* Pink grid background */}
      <div className="absolute inset-0 bg-pink-grid opacity-40" aria-hidden />

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <Badge
          variant="secondary"
          className="mb-8 gap-2 px-4 py-1.5 text-sm bg-primary/10 hover:bg-primary/15 transition-colors clay-shadow-sm"
        >
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-primary font-medium">2,000+ pitches analyzed</span>
        </Badge>

        <h1
          className="text-5xl font-black tracking-tight sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95]"
          style={{ textShadow: "0 0 40px rgba(255,255,255,0.8), 0 0 80px rgba(0,229,204,0.15)" }}
        >
          You get one shot.
          <br />
          <span
            className="text-primary"
            style={{ textShadow: "0 0 40px rgba(0,229,204,0.3), 0 0 80px rgba(0,229,204,0.15)" }}
          >
            Nail it.
          </span>
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed">
          Record your pitch. Get AI-powered feedback on delivery, structure,
          and body language — in under 60 seconds.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button
            size="lg"
            asChild
            className="gap-2 text-base glow-teal animate-pulse-glow"
          >
            <Link href="/record">
              Record your first pitch free <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className="gap-2 text-base"
          >
            <Link href="#how-it-works">
              <Play className="h-4 w-4 fill-current" />
              See how it works
            </Link>
          </Button>
        </div>

        <p className="mt-5 text-sm text-muted-foreground/70">
          No sign-up required · 3 free pitches included
        </p>

        {/* Hero visual — large rounded "screen" container */}
        <div ref={sectionRef} className="mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative rounded-3xl bg-[#A3C1D4] clay-shadow-lg p-4 md:p-6"
          >
            {/* Illustration placeholder */}
            <div className="relative w-full rounded-2xl bg-pink-50 overflow-hidden" style={{ minHeight: "280px" }}>
              <div className="flex h-64 items-center justify-center text-muted-foreground">
                <div className="flex flex-col items-center gap-3">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/60 clay-shadow-sm">
                    <User className="h-10 w-10 text-muted-foreground/40" />
                  </div>
                  <span className="text-sm">{/* PLACEHOLDER: Hero illustration — person pitching at microphone */}</span>
                </div>
              </div>

              {/* Floating AI Analysis card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute top-4 right-4 rounded-2xl bg-white/90 backdrop-blur-sm clay-shadow-sm p-4 animate-float"
              >
                <p className="text-xs font-bold text-foreground mb-2">AI Analysis</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: BookOpen, label: "Story" },
                    { icon: Mic, label: "Verbal" },
                    { icon: Eye, label: "Eye" },
                    { icon: BarChart3, label: "Pose" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-1">
                      <item.icon className="h-3 w-3 text-primary" />
                      <span className="text-[10px] font-medium text-primary">{item.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Floating "Live feedback" badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="absolute top-4 left-4 rounded-full bg-primary clay-shadow-sm px-3 py-1.5 text-xs font-medium text-primary-foreground flex items-center gap-1.5"
              >
                <MessageSquare className="h-3 w-3" /> Live feedback
              </motion.div>
            </div>
          </motion.div>

          {/* Score counter modules on blue platform shelf */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-6 rounded-2xl bg-[#8FAABE]/40 clay-shadow p-4 md:p-6"
          >
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {mockStats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.6 + i * 0.15 }}
                  className="rounded-xl bg-white clay-shadow-sm p-4 text-left"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                      <stat.icon className="h-3 w-3 text-primary" />
                    </div>
                    <p className="text-[11px] text-muted-foreground font-medium">{stat.label}</p>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {stat.display.includes("/") ? (
                      stat.display
                    ) : (
                      <AnimatedCounter target={stat.value} visible={isInView} />
                    )}
                    <span className="text-xs font-normal text-muted-foreground ml-0.5">{stat.unit}</span>
                  </p>
                  {/* Color-coded progress bar */}
                  <div className="mt-2 h-1.5 w-full rounded-full bg-muted/50 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${stat.barPct}%` } : {}}
                      transition={{ duration: 1, delay: 0.8 + i * 0.15, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: stat.barColor }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
