"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="pt-8 pb-8 text-center space-y-4">
          <AlertCircle className="h-10 w-10 text-destructive mx-auto" />
          <h2 className="text-xl font-semibold">Dashboard error</h2>
          <p className="text-sm text-muted-foreground">
            We had trouble loading your dashboard. This is usually temporary.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button onClick={reset} variant="outline" className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Try again
            </Button>
            <Button asChild className="gap-2">
              <Link href="/dashboard">
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
