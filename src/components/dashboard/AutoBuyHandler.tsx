"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const RESUME_FLAG = "nailed-it-resume-recording";

export function AutoBuyHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const autoBuy = searchParams.get("autoBuy");
  const triggered = useRef(false);

  // Check if user was mid-recording before OAuth redirect
  // Supabase OAuth often drops custom query params, so user lands on /dashboard
  // instead of /record?resume=true. This catches that case.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const shouldResume = localStorage.getItem(RESUME_FLAG);
    if (shouldResume === "true") {
      router.replace("/record?resume=true");
    }
  }, [router]);

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
