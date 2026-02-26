"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Coins, Loader2 } from "lucide-react";
import { CREDIT_PACKS } from "@/lib/constants";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const paidFeatures = [
  "Body language analysis",
  "AI-rewritten script",
  "5-minute max recording",
];

export function UpgradeModal({ open, onOpenChange }: UpgradeModalProps) {
  const [loadingPack, setLoadingPack] = useState<string | null>(null);

  async function handleBuy(packId: string) {
    setLoadingPack(packId);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packId }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {
      setLoadingPack(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
              <Coins className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle>You&apos;ve used all 3 free pitches</DialogTitle>
          </div>
          <DialogDescription>
            Buy a credit pack to keep pitching. Credits never expire.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium">Each credit includes:</p>
          <ul className="space-y-1">
            {paidFeatures.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <Check className="h-3.5 w-3.5 text-green-500 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-3">
          {CREDIT_PACKS.map((pack) => {
            const isBestValue = pack.id === "pack_50";
            return (
              <div
                key={pack.id}
                className={`relative rounded-xl border p-4 flex items-center justify-between ${
                  isBestValue ? "border-primary ring-1 ring-primary" : ""
                }`}
              >
                {isBestValue && (
                  <Badge className="absolute -top-2.5 left-4 text-[10px]">Best value</Badge>
                )}
                <div>
                  <span className="font-semibold">{pack.credits} credits</span>
                  <span className="text-muted-foreground text-sm ml-2">
                    {pack.perPitch}/pitch
                  </span>
                </div>
                <Button
                  size="sm"
                  variant={isBestValue ? "default" : "outline"}
                  disabled={loadingPack !== null}
                  onClick={() => handleBuy(pack.id)}
                  className="gap-1.5 min-w-[80px]"
                >
                  {loadingPack === pack.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    pack.priceLabel
                  )}
                </Button>
              </div>
            );
          })}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onOpenChange(false)}
          className="w-full text-muted-foreground"
        >
          Maybe later
        </Button>
      </DialogContent>
    </Dialog>
  );
}
