import { createClient } from "@/lib/supabase/server";
import { hasEnvVars } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function Home() {
  if (!hasEnvVars) {
    redirect("/auth/login");
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (data?.claims) {
    redirect("/protected");
  }

  redirect("/auth/login");
}
