import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic2, ArrowRight, Trophy } from "lucide-react";

export default async function ChallengePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const supabase = await createClient();

  const { data: challenge } = await supabase
    .from("challenges")
    .select("score, grade, created_at")
    .eq("code", code)
    .single();

  if (!challenge) notFound();

  const scoreColor =
    challenge.score >= 80
      ? "text-green-500"
      : challenge.score >= 60
      ? "text-yellow-500"
      : "text-red-500";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-6">
      <div className="w-full max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl mb-8">
          <Mic2 className="h-6 w-6 text-primary" />
          Nailed It
        </Link>

        <Card className="overflow-hidden">
          <div className="bg-gradient-to-b from-primary/10 to-transparent pt-8 pb-4">
            <Trophy className="h-10 w-10 text-primary mx-auto mb-2" />
            <h1 className="text-xl font-bold">Someone challenged you!</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Think you can beat their score?
            </p>
          </div>
          <CardContent className="pt-6 pb-8 space-y-6">
            <div>
              <p className="text-sm text-muted-foreground">Their score</p>
              <p className={`text-5xl font-bold ${scoreColor}`}>
                {challenge.score}
                <span className="text-lg font-normal text-muted-foreground">/100</span>
              </p>
              <Badge variant="secondary" className="mt-2">{challenge.grade}</Badge>
            </div>

            <div className="space-y-3">
              <Button size="lg" asChild className="w-full gap-2">
                <Link href="/record">
                  Record your pitch <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <p className="text-xs text-muted-foreground">
                Free · No sign-up required · Takes 2 minutes
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
