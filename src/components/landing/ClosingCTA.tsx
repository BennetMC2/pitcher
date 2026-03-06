import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mic2 } from "lucide-react";

export function ClosingCTA() {
  return (
    <section className="py-24 bg-gradient-to-b from-primary/5 to-primary/10">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <div className="flex justify-center mb-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Mic2 className="h-7 w-7" />
          </div>
        </div>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Your next pitch could be your best one
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
          Record, get feedback, and improve — all in under 5 minutes.
          No credit card. No sign-up required.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button size="lg" asChild className="gap-2 text-base px-8">
            <Link href="/record">
              Record your first pitch free <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
