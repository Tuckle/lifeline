"use server";

import { revalidatePath } from "next/cache";

import type { ActionResult } from "@/lib/action-result";
import { ErrorCodes } from "@/lib/errors";
import { createClient } from "@/lib/supabase/server";
import {
  getDateLabel,
  getOccurredOn,
  getTimelineEventFormValues,
  timelineEventFormSchema,
} from "@/features/timeline/schemas/timeline-event-form";

type ImportCurationState = {
  result?: ActionResult<{ id: string; timelineEventId?: string }>;
};

export const initialImportCurationState: ImportCurationState = {};

type ImportRecordRow = {
  id: string;
  source_label: string;
  content_summary: string;
  source_metadata: Record<string, unknown>;
  lifecycle_state: string;
};

export async function promoteImportRecordAction(
  _previousState: ImportCurationState,
  formData: FormData,
): Promise<ImportCurationState> {
  const recordId = String(formData.get("recordId") ?? "");
  const values = getTimelineEventFormValues(formData);

  if (values.datePrecision === "unknown") {
    return {
      result: {
        ok: false,
        error: {
          code: ErrorCodes.validationFailed,
          message: "Choose an exact date or name an approximate period before promoting.",
        },
      },
    };
  }

  const parsed = timelineEventFormSchema.safeParse(values);

  if (!parsed.success) {
    return {
      result: {
        ok: false,
        error: {
          code: ErrorCodes.validationFailed,
          message: "Add the minimum placement details before promoting this import.",
        },
      },
    };
  }

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (claimsError || !userId) {
    return {
      result: {
        ok: false,
        error: {
          code: ErrorCodes.permissionDenied,
          message: "Sign in again before promoting this import.",
        },
      },
    };
  }

  const record = await loadImportRecord(recordId);
  if (!record.ok) return { result: record };

  const { data, error } = await supabase
    .from("timeline_events")
    .insert({
      user_id: userId,
      title: parsed.data.title,
      story_text: parsed.data.storyText || record.data.content_summary,
      occurred_on: getOccurredOn(parsed.data),
      date_precision: parsed.data.datePrecision,
      approximate_date_label: getDateLabel(parsed.data),
      importance: parsed.data.importance,
      status: "active",
      source_type: "imported",
      source_label: record.data.source_label,
      source_import_record_id: record.data.id,
      source_metadata: record.data.source_metadata,
    })
    .select("id")
    .single();

  if (error || !data?.id) {
    return {
      result: {
        ok: false,
        error: {
          code: ErrorCodes.importCurationFailed,
          message: "This import could not be promoted yet. It is still staged, so you can retry.",
        },
      },
    };
  }

  const update = await setImportRecordLifecycle(recordId, "promoted", data.id);
  if (!update.ok) return { result: update };

  revalidatePath("/imports");
  revalidatePath("/timeline");

  return { result: { ok: true, data: { id: recordId, timelineEventId: data.id } } };
}

export async function attachImportRecordAction(
  _previousState: ImportCurationState,
  formData: FormData,
): Promise<ImportCurationState> {
  const recordId = String(formData.get("recordId") ?? "");
  const timelineEventId = String(formData.get("timelineEventId") ?? "");

  if (!timelineEventId) {
    return {
      result: {
        ok: false,
        error: {
          code: ErrorCodes.validationFailed,
          message: "Choose the memory this import should support.",
        },
      },
    };
  }

  const record = await loadImportRecord(recordId);
  if (!record.ok) return { result: record };

  const update = await setImportRecordLifecycle(recordId, "attached", timelineEventId);
  if (!update.ok) return { result: update };

  revalidatePath("/imports");
  revalidatePath("/timeline");

  return {
    result: {
      ok: true,
      data: { id: recordId, timelineEventId },
    },
  };
}

async function loadImportRecord(
  recordId: string,
): Promise<ActionResult<ImportRecordRow>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("import_records")
    .select("id,source_label,content_summary,source_metadata,lifecycle_state")
    .eq("id", recordId)
    .maybeSingle();

  if (error || !data) {
    return {
      ok: false,
      error: {
        code: ErrorCodes.importCurationFailed,
        message: "This import record could not be found. Refresh Import Review and try again.",
      },
    };
  }

  if (data.lifecycle_state !== "staged") {
    return {
      ok: false,
      error: {
        code: ErrorCodes.importCurationFailed,
        message: "This import has already been curated. Refresh Import Review to see its latest state.",
      },
    };
  }

  return { ok: true, data: data as ImportRecordRow };
}

async function setImportRecordLifecycle(
  recordId: string,
  lifecycleState: "attached" | "promoted",
  timelineEventId: string,
): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("import_records")
    .update({
      lifecycle_state: lifecycleState,
      suggested_timeline_event_id: timelineEventId,
    })
    .eq("id", recordId)
    .eq("lifecycle_state", "staged");

  if (error) {
    return {
      ok: false,
      error: {
        code: ErrorCodes.importCurationFailed,
        message: "This import could not be updated yet. It is still staged, so you can retry.",
      },
    };
  }

  return { ok: true, data: { id: recordId } };
}
