import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function ClosingCTA() {
  return (
    <section className="py-28">
      <div className="mx-auto max-w-3xl px-6">
        <div className="rounded-3xl bg-primary clay-shadow-lg p-10 md:p-14 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-primary-foreground">
            Your next pitch could be your best one
          </h2>
          <p className="mt-4 text-base text-primary-foreground/70 max-w-xl mx-auto leading-relaxed">
            Record, get feedback, and improve — all in under 5 minutes.
            No credit card. No sign-up required.
          </p>
          <div className="mt-8">
            <Button
              size="lg"
              variant="outline"
              asChild
              className="gap-2 text-base border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <Link href="/record">
                Record your first pitch free <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-primary-foreground/50">
            Join 2,000+ founders who&apos;ve already improved their pitch
          </p>
        </div>
      </div>
    </section>
  );
}
