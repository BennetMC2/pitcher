"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const signupSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignupData = z.infer<typeof signupSchema>;
type LoginData = z.infer<typeof loginSchema>;

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthenticated: () => void;
  /** Called before Google OAuth redirect so caller can persist state */
  onBeforeOAuthRedirect?: () => Promise<void>;
}

export function AuthModal({
  open,
  onOpenChange,
  onAuthenticated,
  onBeforeOAuthRedirect,
}: AuthModalProps) {
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const signupForm = useForm<SignupData>({ resolver: zodResolver(signupSchema) });
  const loginForm = useForm<LoginData>({ resolver: zodResolver(loginSchema) });

  async function handleSignup(data: SignupData) {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { full_name: data.full_name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    if (authData?.session) {
      onAuthenticated();
      return;
    }
    // Email verification required
    setError("Check your email for a verification link, then try logging in.");
    setLoading(false);
  }

  async function handleLogin(data: LoginData) {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword(data);
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    onAuthenticated();
  }

  async function handleOAuth(provider: "google" | "github") {
    if (onBeforeOAuthRedirect) {
      await onBeforeOAuthRedirect();
    }
    const supabase = createClient();
    const callbackUrl = new URL(`${window.location.origin}/auth/callback`);
    callbackUrl.searchParams.set("next", "/record?resume=true");
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: callbackUrl.toString(),
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "signup" ? "Your results are ready" : "Welcome back"}
          </DialogTitle>
          <DialogDescription>
            {mode === "signup"
              ? "Create a free account to see your AI coaching report"
              : "Sign in to see your results"}
          </DialogDescription>
        </DialogHeader>

        {mode === "signup" && (
          <div className="flex flex-col gap-1.5 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
            {["Confidence score & grade", "Verbal delivery breakdown", "Story structure analysis", "Personalized coaching tips"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleOAuth("google")}
              type="button"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleOAuth("github")}
              type="button"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Continue with GitHub
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs text-muted-foreground">
              <span className="bg-background px-2">or</span>
            </div>
          </div>

          {mode === "signup" ? (
            <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="modal-name">Full name</Label>
                <Input id="modal-name" placeholder="Jane Smith" {...signupForm.register("full_name")} />
                {signupForm.formState.errors.full_name && (
                  <p className="text-xs text-destructive">{signupForm.formState.errors.full_name.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="modal-email">Email</Label>
                <Input id="modal-email" type="email" placeholder="you@example.com" {...signupForm.register("email")} />
                {signupForm.formState.errors.email && (
                  <p className="text-xs text-destructive">{signupForm.formState.errors.email.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="modal-password">Password</Label>
                <Input id="modal-password" type="password" placeholder="Min 8 characters" {...signupForm.register("password")} />
                {signupForm.formState.errors.password && (
                  <p className="text-xs text-destructive">{signupForm.formState.errors.password.message}</p>
                )}
              </div>
              {error && (
                <div className="rounded-lg bg-destructive/10 p-2 text-sm text-destructive">{error}</div>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create account
              </Button>
            </form>
          ) : (
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="modal-login-email">Email</Label>
                <Input id="modal-login-email" type="email" placeholder="you@example.com" {...loginForm.register("email")} />
                {loginForm.formState.errors.email && (
                  <p className="text-xs text-destructive">{loginForm.formState.errors.email.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="modal-login-password">Password</Label>
                <Input id="modal-login-password" type="password" placeholder="••••••••" {...loginForm.register("password")} />
                {loginForm.formState.errors.password && (
                  <p className="text-xs text-destructive">{loginForm.formState.errors.password.message}</p>
                )}
              </div>
              {error && (
                <div className="rounded-lg bg-destructive/10 p-2 text-sm text-destructive">{error}</div>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign in
              </Button>
            </form>
          )}

          <p className="text-center text-sm text-muted-foreground">
            {mode === "signup" ? (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => { setMode("login"); setError(null); }}
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                Need an account?{" "}
                <button
                  type="button"
                  onClick={() => { setMode("signup"); setError(null); }}
                  className="text-primary hover:underline font-medium"
                >
                  Sign up
                </button>
              </>
            )}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
