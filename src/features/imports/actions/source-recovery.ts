"use server";

import { revalidatePath } from "next/cache";

import type { ActionResult } from "@/lib/action-result";
import { ErrorCodes } from "@/lib/errors";
import { createClient } from "@/lib/supabase/server";

type SourceRecoveryState = {
  result?: ActionResult<{ sourceId: string }>;
};

export const initialSourceRecoveryState: SourceRecoveryState = {};

export async function ignoreImportSourceIssueAction(
  _previousState: SourceRecoveryState,
  formData: FormData,
): Promise<SourceRecoveryState> {
  const sourceId = String(formData.get("sourceId") ?? "");
  const result = await updateImportSourceStatus(sourceId, "connected");
  return { result };
}

export async function disconnectImportSourceAction(
  _previousState: SourceRecoveryState,
  formData: FormData,
): Promise<SourceRecoveryState> {
  const sourceId = String(formData.get("sourceId") ?? "");
  const result = await updateImportSourceStatus(sourceId, "disconnected");
  return { result };
}

async function updateImportSourceStatus(
  sourceId: string,
  connectionStatus: "connected" | "disconnected",
): Promise<ActionResult<{ sourceId: string }>> {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims?.sub) {
    return {
      ok: false,
      error: {
        code: ErrorCodes.permissionDenied,
        message: "Sign in again before changing this source.",
      },
    };
  }

  const { error } = await supabase
    .from("import_sources")
    .update({ connection_status: connectionStatus })
    .eq("id", sourceId);

  if (error) {
    return {
      ok: false,
      error: {
        code: ErrorCodes.importCurationFailed,
        message:
          "This source could not be updated yet. Your staged records are unchanged.",
      },
    };
  }

  revalidatePath("/imports");
  return { ok: true, data: { sourceId } };
}
