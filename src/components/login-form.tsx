"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { cn, hasEnvVars } from "@/lib/utils";
import { useState } from "react";

function getSafeNextPath() {
  const params = new URLSearchParams(window.location.search);
  const next = params.get("next");

  if (next?.startsWith("/") && !next.startsWith("//")) {
    return next;
  }

  return "/timeline";
}

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    const next = getSafeNextPath();
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });

    if (error) {
      setError(
        "Google sign-in could not start. Please check your connection and try again.",
      );
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to Lifeline</CardTitle>
          <CardDescription>
            Sign in to your private space for reflecting on memories, patterns,
            and the shape of your life over time.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            type="button"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={isLoading || !hasEnvVars}
          >
            {isLoading
              ? "Opening Google..."
              : hasEnvVars
                ? "Continue with Google"
                : "Supabase setup required"}
          </Button>
          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : !hasEnvVars ? (
            <p className="text-sm text-muted-foreground" role="status">
              Add your Supabase URL and publishable key, then configure Google
              OAuth in Supabase to enable sign-in.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Your timeline, reflections, and future intentions stay private to
              your account.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
