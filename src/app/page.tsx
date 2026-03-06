import { Suspense } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { MobileNav } from "@/components/landing/MobileNav";
import { Mic2 } from "lucide-react";

const Testimonials = dynamic(() => import("@/components/landing/Testimonials").then(m => m.Testimonials));
const FeatureShowcase = dynamic(() => import("@/components/landing/FeatureShowcase").then(m => m.FeatureShowcase));
const PricingSection = dynamic(() => import("@/components/landing/PricingSection").then(m => m.PricingSection));
const ClosingCTA = dynamic(() => import("@/components/landing/ClosingCTA").then(m => m.ClosingCTA));
const FAQ = dynamic(() => import("@/components/landing/FAQ").then(m => m.FAQ));
const EmailCapture = dynamic(() => import("@/components/landing/EmailCapture").then(m => m.EmailCapture));

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col scroll-smooth">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Mic2 className="h-5 w-5 text-primary" />
            Nailed It
          </Link>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            <Link
              href="#how-it-works"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              How it works
            </Link>
            <Link
              href="#pricing"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#faq"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              FAQ
            </Link>
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth/login">Log in</Link>
            </Button>
            <Button size="sm" asChild>
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
      <footer className="border-t py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 text-sm text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2">
            <Mic2 className="h-4 w-4" />
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
      </footer>
    </div>
  );
}
