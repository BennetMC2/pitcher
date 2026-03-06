"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play, Sparkles } from "lucide-react";

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

        {/* Hero illustration — full-width diorama image */}
        <div ref={sectionRef} className="-mx-6 mt-16 md:mx-0">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mx-auto max-w-6xl"
          >
            <Image
              src="/hero-illustration.png"
              alt="AI pitch analysis showing a presenter with verbal clarity, story structure, confidence, and eye contact scores"
              width={1500}
              height={844}
              className="w-full h-auto"
              priority
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
