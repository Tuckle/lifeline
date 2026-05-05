import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const defaultRedirectPath = "/protected";

function getSafeNextPath(next: string | null) {
  if (next?.startsWith("/") && !next.startsWith("//")) {
    return next;
  }

  return defaultRedirectPath;
}

function redirectToAuthError(origin: string, message: string) {
  const url = new URL("/auth/error", origin);
  url.searchParams.set("error", message);
  return NextResponse.redirect(url);
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const providerError = searchParams.get("error");
  const providerDescription = searchParams.get("error_description");
  const next = getSafeNextPath(searchParams.get("next"));

  if (providerError) {
    return redirectToAuthError(
      origin,
      providerDescription ?? "Google sign-in was canceled or could not finish.",
    );
  }

  if (!code) {
    return redirectToAuthError(
      origin,
      "Google sign-in did not return a valid authorization code.",
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return redirectToAuthError(
      origin,
      "Google sign-in could not be verified. Please try again.",
    );
  }

  return NextResponse.redirect(new URL(next, origin));
}
