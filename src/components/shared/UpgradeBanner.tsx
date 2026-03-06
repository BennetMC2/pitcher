"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

interface UpgradeBannerProps {
  title?: string;
  description?: string;
  ctaText?: string;
  variant?: "default" | "compact";
}

export function UpgradeBanner({
  title = "Unlock the full picture",
  description = "Get body language analysis, AI-rewritten scripts, and 5-minute recordings with credit packs.",
  ctaText = "See credit packs",
  variant = "default",
}: UpgradeBannerProps) {
  if (variant === "compact") {
    return (
      <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary shrink-0" />
          <p className="text-sm font-medium">{title}</p>
        </div>
        <Button size="sm" asChild className="gap-1.5 shrink-0">
          <Link href="/pricing">
            {ctaText} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          <Button size="sm" asChild className="mt-3 gap-1.5">
            <Link href="/pricing">
              {ctaText} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
