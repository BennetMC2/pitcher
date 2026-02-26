"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play, Star } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 pt-20 pb-24">
      {/* Background grid */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <Badge variant="secondary" className="mb-6 gap-1.5 px-3 py-1">
          <Star className="h-3 w-3 fill-current" />
          Used by 500+ founders
        </Badge>

        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
          Nail your pitch.
          <br />
          <span className="text-primary">Every time.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-xl text-muted-foreground">
          Record your 60-second elevator pitch. Get instant AI feedback on
          verbal delivery, body language, story structure, and confidence score
          — before your investor meeting.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button size="lg" asChild className="gap-2 text-base px-8">
            <Link href="/auth/signup">
              Start for free <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="gap-2 text-base">
            <Link href="#how-it-works">
              <Play className="h-4 w-4 fill-current" />
              See how it works
            </Link>
          </Button>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          3 free pitches/month · No credit card required
        </p>

        {/* Mockup preview */}
        <div className="mt-16 rounded-2xl border bg-card shadow-2xl overflow-hidden">
          <div className="flex items-center gap-2 border-b px-4 py-3">
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <div className="h-3 w-3 rounded-full bg-yellow-400" />
            <div className="h-3 w-3 rounded-full bg-green-400" />
            <span className="ml-2 text-xs text-muted-foreground">pitcher.ai/dashboard/session/abc123</span>
          </div>
          <div className="grid grid-cols-2 gap-4 p-6 md:grid-cols-4">
            {[
              { label: "Overall Score", value: "84", unit: "/100", color: "text-green-500" },
              { label: "Verbal Clarity", value: "91", unit: "/100", color: "text-blue-500" },
              { label: "Story Structure", value: "3/4", unit: " elements", color: "text-orange-500" },
              { label: "Eye Contact", value: "78", unit: "%", color: "text-purple-500" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border bg-background p-4 text-left">
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className={`mt-1 text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                  <span className="text-sm font-normal text-muted-foreground">{stat.unit}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
