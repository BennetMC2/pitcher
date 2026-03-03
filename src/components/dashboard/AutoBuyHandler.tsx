"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

export function AutoBuyHandler() {
  const searchParams = useSearchParams();
  const autoBuy = searchParams.get("autoBuy");
  const triggered = useRef(false);

  useEffect(() => {
    if (!autoBuy || triggered.current) return;
    triggered.current = true;

    async function triggerCheckout() {
      try {
        const res = await fetch("/api/billing/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ packId: autoBuy }),
        });
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        }
      } catch (err) {
        console.error("Auto-buy checkout failed:", err);
      }
    }

    triggerCheckout();
  }, [autoBuy]);

  if (!autoBuy) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm font-medium">Redirecting to checkout…</p>
      </div>
    </div>
  );
}
