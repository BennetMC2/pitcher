import { Suspense } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { MobileNav } from "@/components/landing/MobileNav";
import { Check, Mic2 } from "lucide-react";

const Testimonials = dynamic(() => import("@/components/landing/Testimonials").then(m => m.Testimonials));
const FeatureShowcase = dynamic(() => import("@/components/landing/FeatureShowcase").then(m => m.FeatureShowcase));
const PricingSection = dynamic(() => import("@/components/landing/PricingSection").then(m => m.PricingSection));
const ClosingCTA = dynamic(() => import("@/components/landing/ClosingCTA").then(m => m.ClosingCTA));
const FAQ = dynamic(() => import("@/components/landing/FAQ").then(m => m.FAQ));
const EmailCapture = dynamic(() => import("@/components/landing/EmailCapture").then(m => m.EmailCapture));

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col scroll-smooth bg-grid-pattern">
      {/* Nav — floating pill */}
      <header className="sticky top-0 z-50 pt-4 px-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between rounded-full bg-pink-100/80 backdrop-blur-sm clay-shadow px-6 py-3">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary clay-shadow-sm">
              <Check className="h-4 w-4 text-primary-foreground" />
            </div>
            Nailed It
          </Link>
          <nav className="hidden items-center gap-1 text-sm md:flex">
            <Link
              href="#how-it-works"
              className="rounded-full border border-border/50 px-4 py-1.5 text-muted-foreground hover:text-foreground hover:bg-white/50 transition-colors"
            >
              How it works
            </Link>
            <Link
              href="#pricing"
              className="rounded-full border border-border/50 px-4 py-1.5 text-muted-foreground hover:text-foreground hover:bg-white/50 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#faq"
              className="rounded-full border border-border/50 px-4 py-1.5 text-muted-foreground hover:text-foreground hover:bg-white/50 transition-colors"
            >
              FAQ
            </Link>
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            <Button variant="outline" size="sm" asChild>
              <Link href="/auth/login">Log in</Link>
            </Button>
            <Button size="sm" asChild className="glow-teal">
              <Link href="/record">Record a pitch</Link>
            </Button>
          </div>
          <MobileNav />
        </div>
      </header>

      <main>
        <Hero />
        <HowItWorks />
        <Suspense>
          <Testimonials />
        </Suspense>
        <Suspense>
          <FeatureShowcase />
        </Suspense>
        <Suspense>
          <PricingSection />
        </Suspense>
        <Suspense>
          <FAQ />
        </Suspense>
        <Suspense>
          <ClosingCTA />
        </Suspense>
        <Suspense>
          <EmailCapture />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="py-8">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-card clay-shadow-sm px-6 py-6 text-sm text-muted-foreground sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                <Check className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              <span className="font-medium text-foreground">Nailed It</span>
              <span>— AI Pitch Coach</span>
            </div>
            <div className="flex gap-6">
              <Link
                href="/pricing"
                className="hover:text-foreground transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/auth/login"
                className="hover:text-foreground transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/auth/signup"
                className="hover:text-foreground transition-colors"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
