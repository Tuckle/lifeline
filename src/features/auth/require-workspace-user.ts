import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { hasEnvVars } from "@/lib/utils";

function getLoginPath(nextPath?: string) {
  if (nextPath?.startsWith("/") && !nextPath.startsWith("//")) {
    return `/auth/login?next=${encodeURIComponent(nextPath)}`;
  }

  return "/auth/login";
}

export async function requireWorkspaceUser(nextPath?: string) {
  if (!hasEnvVars) {
    redirect(getLoginPath(nextPath));
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect(getLoginPath(nextPath));
  }

  return data.claims;
}
