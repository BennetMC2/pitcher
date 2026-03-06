"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play, Mic, BarChart3, Eye, BookOpen, Sparkles, MessageSquare } from "lucide-react";

const mockStats = [
  {
    label: "Verbal Clarity",
    value: "91",
    unit: "/100",
    icon: Mic,
    barWidth: "91%",
  },
  {
    label: "Story Structure",
    value: "3/4",
    unit: " elements",
    icon: BookOpen,
    barWidth: "75%",
  },
  {
    label: "Confidence",
    value: "84",
    unit: "/100",
    icon: BarChart3,
    barWidth: "84%",
  },
  {
    label: "Eye Contact",
    value: "78",
    unit: "%",
    icon: Eye,
    barWidth: "78%",
  },
];

export function Hero() {
  const mockupRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = mockupRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative overflow-hidden pt-28 pb-32">
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

        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95]">
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

        {/* Illustration placeholders */}
        <div className="mt-16 flex flex-col items-center gap-8 md:flex-row md:justify-center md:gap-12">
          {/* Presenter illustration */}
          <div className="relative clay-shadow rounded-3xl bg-card p-8 max-w-[260px]">
            <div className="flex h-24 w-24 mx-auto items-center justify-center rounded-full bg-primary/10 clay-inset">
              <Mic className="h-12 w-12 text-primary" />
            </div>
            <p className="mt-4 text-sm font-medium text-muted-foreground">Your pitch, recorded</p>
            {/* Floating comment bubble */}
            <div className="absolute -top-3 -right-3 rounded-full bg-primary clay-shadow-sm px-3 py-1.5 text-xs font-medium text-primary-foreground flex items-center gap-1">
              <MessageSquare className="h-3 w-3" /> Live feedback
            </div>
          </div>

          {/* AI analysis floating graphic */}
          <div className="animate-float clay-shadow rounded-3xl bg-card p-8 max-w-[260px]">
            <div className="flex h-24 w-24 mx-auto items-center justify-center rounded-full bg-secondary/20 clay-inset">
              <Sparkles className="h-12 w-12 text-primary" />
            </div>
            <p className="mt-4 text-sm font-medium text-muted-foreground">AI-powered analysis</p>
          </div>
        </div>

        {/* Score counter modules on blue platform */}
        <div
          ref={mockupRef}
          className={`mt-16 platform transition-all duration-1000 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {mockStats.map((stat, i) => (
              <div
                key={stat.label}
                className={`rounded-2xl bg-card clay-shadow p-5 text-left transition-all duration-500 ${
                  visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${(i + 1) * 150 + 200}ms` }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                    <stat.icon className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                </div>

                {/* Recessed digital display */}
                <div className="clay-inset rounded-xl bg-card/50 px-3 py-2 mb-3">
                  <p className="text-2xl font-bold font-mono text-primary">
                    {stat.value}
                    <span className="text-sm font-normal text-muted-foreground">{stat.unit}</span>
                  </p>
                </div>

                {/* Teal progress bar */}
                <div className="h-2 w-full rounded-full bg-muted/50 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-1000 ease-out"
                    style={{
                      width: visible ? stat.barWidth : "0%",
                      transitionDelay: `${(i + 1) * 150 + 500}ms`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
