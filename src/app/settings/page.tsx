import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Coins } from "lucide-react";
import Link from "next/link";
import { Mic2 } from "lucide-react";
import { FREE_PITCH_LIMIT } from "@/lib/constants";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const [{ data: profile }, { data: subscription }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("subscriptions").select("pitches_used, credits, stripe_customer_id").eq("user_id", user.id).single(),
  ]);

  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : user.email?.slice(0, 2).toUpperCase() ?? "?";

  const pitchesUsed = subscription?.pitches_used ?? 0;
  const credits = subscription?.credits ?? 0;
  const freeUsed = Math.min(pitchesUsed, FREE_PITCH_LIMIT);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-2xl items-center gap-4 px-6 py-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold">
            <Mic2 className="h-5 w-5 text-primary" />
            Nailed It
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium">Settings</span>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-6 py-10 space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your account and billing</p>
          </div>

          {/* Profile */}
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="text-base">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{profile?.full_name ?? "—"}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Usage & Credits */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Usage &amp; Credits</CardTitle>
                  <CardDescription>Your pitch usage and credit balance</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Free pitches used</p>
                  <p className="font-semibold mt-0.5">
                    {freeUsed} / {FREE_PITCH_LIMIT}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Credit balance</p>
                  <p className="font-semibold mt-0.5 flex items-center gap-1.5">
                    <Coins className="h-4 w-4 text-yellow-500" />
                    {credits}
                  </p>
                </div>
              </div>

              <Button asChild className="gap-2">
                <Link href="/pricing">
                  <Coins className="h-4 w-4" />
                  Buy more credits
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Separator />

          {/* Danger zone */}
          <Card className="border-destructive/40">
            <CardHeader>
              <CardTitle className="text-destructive">Sign out</CardTitle>
            </CardHeader>
            <CardContent>
              <form action="/api/auth/signout" method="POST">
                <Button variant="destructive" type="submit">
                  Sign out
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
