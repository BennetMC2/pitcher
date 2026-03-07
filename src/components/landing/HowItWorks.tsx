"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section id="how-it-works" className="py-16" ref={ref}>
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
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

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <Image
            src="/how-it-works-illustration.png"
            alt="Three-step process: Step 1 Record your pitch, Step 2 AI analyzes everything across 6 dimensions, Step 3 Get actionable feedback with score improvements"
            width={1500}
            height={530}
            className="w-full h-auto"
          />
        </motion.div>
      </div>
    </section>
  );
}
