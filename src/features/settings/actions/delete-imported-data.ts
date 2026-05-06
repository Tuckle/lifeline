"use server";

import { revalidatePath } from "next/cache";

import type { ActionResult } from "@/lib/action-result";
import { ErrorCodes } from "@/lib/errors";
import { logImportError } from "@/features/imports/logger";
import { createClient } from "@/lib/supabase/server";

type DeleteImportedDataState = {
  result?: ActionResult<{
    deletedRecordCount: number;
    deletedTimelineEventCount: number;
    sourceId: string;
  }>;
};

type ImportRecordDeleteRow = {
  id: string;
  lifecycle_state: string;
};

export const initialDeleteImportedDataState: DeleteImportedDataState = {};

export async function deleteImportedDataForSourceAction(
  _previousState: DeleteImportedDataState,
  formData: FormData,
): Promise<DeleteImportedDataState> {
  const sourceId = String(formData.get("sourceId") ?? "");

  if (!sourceId) {
    return {
      result: {
        ok: false,
        error: {
          code: ErrorCodes.validationFailed,
          message: "Choose a source before deleting imported data.",
        },
      },
    };
  }

  const result = await deleteImportedDataForSource(sourceId);
  return { result };
}

async function deleteImportedDataForSource(
  sourceId: string,
): Promise<
  ActionResult<{
    deletedRecordCount: number;
    deletedTimelineEventCount: number;
    sourceId: string;
  }>
> {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (claimsError || !userId) {
    return {
      ok: false,
      error: {
        code: ErrorCodes.permissionDenied,
        message: "Sign in again before deleting imported data.",
      },
    };
  }

  const source = await supabase
    .from("import_sources")
    .select("id")
    .eq("id", sourceId)
    .eq("user_id", userId)
    .maybeSingle();

  if (source.error || !source.data?.id) {
    return {
      ok: false,
      error: {
        code: ErrorCodes.importDeleteFailed,
        message: "This source could not be found. No imported data was deleted.",
      },
    };
  }

  const records = await supabase
    .from("import_records")
    .select("id,lifecycle_state")
    .eq("source_id", sourceId)
    .eq("user_id", userId)
    .neq("lifecycle_state", "deleted");

  if (records.error) {
    logImportError("importDeleteFailed", {
      sourceId,
      technicalContext: {
        phase: "record_lookup",
        supabaseCode: records.error.code,
      },
    });

    return {
      ok: false,
      error: {
        code: ErrorCodes.importDeleteFailed,
        message:
          "Imported records could not be prepared for deletion. Nothing was marked deleted.",
      },
    };
  }

  const rows = (records.data ?? []) as ImportRecordDeleteRow[];
  const recordIds = rows.map((record) => record.id);
  let deletedTimelineEventCount = 0;

  if (recordIds.length > 0) {
    const timelineDelete = await supabase
      .from("timeline_events")
      .update({ status: "deleted" })
      .eq("user_id", userId)
      .eq("source_type", "imported")
      .in("source_import_record_id", recordIds)
      .select("id");

    if (timelineDelete.error) {
      logImportError("importDeleteFailed", {
        sourceId,
        technicalContext: {
          phase: "promoted_timeline_delete",
          recordCount: recordIds.length,
          supabaseCode: timelineDelete.error.code,
        },
      });

      return {
        ok: false,
        error: {
          code: ErrorCodes.importDeleteFailed,
          message:
            "Promoted timeline references could not be updated, so imported records were not marked deleted.",
        },
      };
    }

    deletedTimelineEventCount = (timelineDelete.data ?? []).length;
  }

  const deletedRecords = await supabase
    .from("import_records")
    .update({ lifecycle_state: "deleted" })
    .eq("source_id", sourceId)
    .eq("user_id", userId)
    .neq("lifecycle_state", "deleted")
    .select("id");

  if (deletedRecords.error) {
    logImportError("importDeleteFailed", {
      sourceId,
      technicalContext: {
        phase: "record_lifecycle_delete",
        recordCount: recordIds.length,
        supabaseCode: deletedRecords.error.code,
      },
    });

    return {
      ok: false,
      error: {
        code: ErrorCodes.importDeleteFailed,
        message:
          "Imported records could not be marked deleted. Review the source before trying again.",
      },
    };
  }

  revalidatePath("/imports");
  revalidatePath("/settings");
  revalidatePath("/timeline");

  return {
    ok: true,
    data: {
      deletedRecordCount: (deletedRecords.data ?? []).length,
      deletedTimelineEventCount,
      sourceId,
    },
  };
}
