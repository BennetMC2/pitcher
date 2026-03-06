"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Check } from "lucide-react";

export function EmailCapture() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    // In production, this would POST to an API endpoint
    // For now, just show success state
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <section className="py-16">
        <div className="mx-auto max-w-xl px-6 text-center">
          <div className="flex items-center justify-center gap-2 text-green-600">
            <Check className="h-5 w-5" />
            <p className="font-medium">You&apos;re on the list! We&apos;ll send you pitch tips and updates.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 border-t">
      <div className="mx-auto max-w-xl px-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-5 w-5 text-primary" />
          </div>
        </div>
        <h3 className="text-lg font-semibold">Get pitch tips in your inbox</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Weekly tips from top founders on nailing your pitch. Unsubscribe anytime.
        </p>
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2 max-w-sm mx-auto">
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1"
          />
          <Button type="submit" size="sm">
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  );
}
