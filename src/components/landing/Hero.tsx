"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

export function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });

  return (
    <section className="relative overflow-hidden pt-12 pb-0">
      {/* Pink grid background */}
      <div className="absolute inset-0 bg-pink-grid opacity-40" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-6 text-center">
        <h1
          className="text-5xl font-black tracking-tight sm:text-6xl md:text-7xl lg:text-[5.5rem] leading-[1.05]"
          style={{ textShadow: "0 0 60px rgba(255,255,255,0.9), 0 0 120px rgba(0,229,204,0.2)" }}
        >
          You get one shot.{" "}
          <span
            className="text-primary"
            style={{ textShadow: "0 0 60px rgba(0,229,204,0.4), 0 0 120px rgba(0,229,204,0.2)" }}
          >
            Nail it.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-xl sm:text-2xl text-muted-foreground leading-relaxed">
          Record your pitch. Get AI-powered feedback on delivery, structure,
          and body language — in under 60 seconds.
        </p>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button
            size="lg"
            asChild
            className="gap-2 text-lg h-14 px-10 glow-teal-strong animate-pulse-glow"
          >
            <Link href="/record">
              Record your first pitch free <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className="gap-2 text-lg h-14 px-10"
          >
            <Link href="#how-it-works">
              See how it works
            </Link>
          </Button>
        </div>

        {/* Hero illustration — full-width diorama image */}
        <div ref={sectionRef} className="-mx-6 mt-4 sm:-mx-12 md:-mx-20 lg:-mx-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
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
