"use server";

import { revalidatePath } from "next/cache";

import type { ActionResult } from "@/lib/action-result";
import { ErrorCodes } from "@/lib/errors";
import { createClient } from "@/lib/supabase/server";
import {
  getDateLabel,
  getOccurredOn,
  timelineEventFormSchema,
} from "@/features/timeline/schemas/timeline-event-form";

type OfflineDraftSyncState = {
  result?: ActionResult<{
    draftId: string;
    duplicate: boolean;
    timelineEventId: string;
  }>;
};

export const initialOfflineDraftSyncState: OfflineDraftSyncState = {};

export async function syncOfflineDraftAction(
  _previousState: OfflineDraftSyncState,
  formData: FormData,
): Promise<OfflineDraftSyncState> {
  const draftId = String(formData.get("draftId") ?? "");
  const values = {
    title: String(formData.get("title") ?? ""),
    storyText: "",
    datePrecision: String(formData.get("datePrecision") ?? "unknown"),
    exactDate: String(formData.get("exactDate") ?? ""),
    monthDate: "",
    yearDate: "",
    periodLabel: String(formData.get("periodLabel") ?? ""),
    importance: "unset",
    photoReferenceUrl: "",
    photoAltText: "",
  };
  const parsed = timelineEventFormSchema.safeParse(values);

  if (!draftId || !parsed.success) {
    return {
      result: {
        ok: false,
        error: {
          code: ErrorCodes.validationFailed,
          message: "Check the draft title and date before syncing.",
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
          message: "Sign in again before syncing this draft.",
        },
      },
    };
  }

  const existing = await supabase
    .from("timeline_events")
    .select("id")
    .eq("user_id", userId)
    .contains("source_metadata", { offlineDraftId: draftId })
    .maybeSingle();

  if (existing.data?.id) {
    return {
      result: {
        ok: true,
        data: {
          draftId,
          duplicate: true,
          timelineEventId: existing.data.id,
        },
      },
    };
  }

  const dateLabel = getDateLabel(parsed.data);
  const { data, error } = await supabase
    .from("timeline_events")
    .insert({
      user_id: userId,
      title: parsed.data.title,
      story_text: null,
      occurred_on: getOccurredOn(parsed.data),
      date_precision: parsed.data.datePrecision,
      approximate_date_label: dateLabel,
      importance: parsed.data.importance,
      status: "active",
      source_type: "manual",
      source_label: "Offline draft",
      source_metadata: {
        offlineDraftId: draftId,
        syncedFrom: "localStorage",
      },
    })
    .select("id")
    .single();

  if (error || !data?.id) {
    return {
      result: {
        ok: false,
        error: {
          code: ErrorCodes.timelineEventCreateFailed,
          message: "This draft could not sync yet. It is still saved locally.",
        },
      },
    };
  }

  revalidatePath("/timeline");
  revalidatePath("/add");

  return {
    result: {
      ok: true,
      data: {
        draftId,
        duplicate: false,
        timelineEventId: data.id,
      },
    },
  };
}
