"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

export function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section className="py-16" ref={ref}>
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
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

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <Image
            src="/testimonials-illustration.png"
            alt="Wall of proof showing 89% improved, 2,000+ pitches analyzed, under 60 second analysis time, with verified testimonials from Daniel M., Aisha L., and James W., backed by Y Combinator, Techstars, Sequoia, and a16z"
            width={1500}
            height={600}
            className="w-full h-auto"
          />
        </motion.div>
      </div>
    </section>
  );
}
