"use server";

import { revalidatePath } from "next/cache";

import type { ActionResult } from "@/lib/action-result";
import { ErrorCodes } from "@/lib/errors";
import { createClient } from "@/lib/supabase/server";
import { logOfflineSyncError } from "@/features/offline/logger";
import {
  getDateLabel,
  getOccurredOn,
  timelineEventFormSchema,
  type TimelineEventFormValues,
} from "@/features/timeline/schemas/timeline-event-form";

type OfflineDraftConflict = {
  draftId: string;
  server: {
    approximateDateLabel: string | null;
    datePrecision: string;
    occurredOn: string | null;
    timelineEventId: string;
    title: string;
  };
};

type OfflineDraftSyncState = {
  result?: ActionResult<{
    draftId: string;
    duplicate: boolean;
    timelineEventId: string;
  }>;
  conflict?: OfflineDraftConflict;
};

type OfflineDraftConflictResolutionState = {
  result?: ActionResult<{
    draftId: string;
    resolution: "keep_local" | "use_server";
    timelineEventId: string;
  }>;
};

export const initialOfflineDraftSyncState: OfflineDraftSyncState = {};
export const initialOfflineDraftConflictResolutionState: OfflineDraftConflictResolutionState =
  {};

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
    logOfflineSyncError({
      draftId,
      errorCode: "permissionDenied",
      syncStatus: "failed",
      technicalContext: { phase: "claims" },
    });

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
    .select("id,title,occurred_on,date_precision,approximate_date_label")
    .eq("user_id", userId)
    .contains("source_metadata", { offlineDraftId: draftId })
    .maybeSingle();

  if (existing.error) {
    logOfflineSyncError({
      draftId,
      errorCode: "timelineEventCreateFailed",
      syncStatus: "failed",
      technicalContext: {
        phase: "dedupe_lookup",
        supabaseCode: existing.error.code,
      },
    });

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

  if (existing.data?.id) {
    if (hasOfflineDraftConflict(parsed.data, existing.data)) {
      const conflict = {
        draftId,
        server: {
          approximateDateLabel: existing.data.approximate_date_label,
          datePrecision: existing.data.date_precision,
          occurredOn: existing.data.occurred_on,
          timelineEventId: existing.data.id,
          title: existing.data.title,
        },
      };

      logOfflineSyncError({
        draftId,
        errorCode: "offlineConflict",
        syncStatus: "conflict",
        technicalContext: {
          phase: "dedupe_lookup",
          timelineEventId: existing.data.id,
        },
      });

      return {
        conflict,
        result: {
          ok: false,
          error: {
            code: ErrorCodes.offlineConflict,
            message:
              "This draft conflicts with a timeline version. Review both versions before choosing what to keep.",
          },
        },
      };
    }

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
    logOfflineSyncError({
      draftId,
      errorCode: "timelineEventCreateFailed",
      syncStatus: "failed",
      technicalContext: {
        phase: "insert",
        supabaseCode: error?.code,
      },
    });

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

export async function resolveOfflineDraftConflictAction(
  _previousState: OfflineDraftConflictResolutionState,
  formData: FormData,
): Promise<OfflineDraftConflictResolutionState> {
  const draftId = String(formData.get("draftId") ?? "");
  const timelineEventId = String(formData.get("timelineEventId") ?? "");
  const resolution = String(formData.get("resolution") ?? "");
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

  if (
    !draftId ||
    !timelineEventId ||
    (resolution !== "keep_local" && resolution !== "use_server") ||
    !parsed.success
  ) {
    return {
      result: {
        ok: false,
        error: {
          code: ErrorCodes.validationFailed,
          message: "Choose a valid conflict resolution and try again.",
        },
      },
    };
  }

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (claimsError || !userId) {
    logOfflineSyncError({
      draftId,
      errorCode: "permissionDenied",
      syncStatus: "failed",
      technicalContext: { phase: "resolve_claims", timelineEventId },
    });

    return {
      result: {
        ok: false,
        error: {
          code: ErrorCodes.permissionDenied,
          message: "Sign in again before resolving this draft.",
        },
      },
    };
  }

  const existing = await supabase
    .from("timeline_events")
    .select("id,source_metadata")
    .eq("id", timelineEventId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existing.error || !existing.data?.id) {
    logOfflineSyncError({
      draftId,
      errorCode: "timelineEventNotFound",
      syncStatus: "failed",
      technicalContext: {
        phase: "resolve_lookup",
        supabaseCode: existing.error?.code,
        timelineEventId,
      },
    });

    return {
      result: {
        ok: false,
        error: {
          code: ErrorCodes.timelineEventNotFound,
          message:
            "That timeline version could not be found. Your local draft is still saved.",
        },
      },
    };
  }

  if (resolution === "use_server") {
    revalidatePath("/timeline");
    revalidatePath("/add");

    return {
      result: {
        ok: true,
        data: { draftId, resolution, timelineEventId },
      },
    };
  }

  const sourceMetadata =
    existing.data.source_metadata &&
    typeof existing.data.source_metadata === "object" &&
    !Array.isArray(existing.data.source_metadata)
      ? existing.data.source_metadata
      : {};
  const { error } = await supabase
    .from("timeline_events")
    .update({
      title: parsed.data.title,
      occurred_on: getOccurredOn(parsed.data),
      date_precision: parsed.data.datePrecision,
      approximate_date_label: getDateLabel(parsed.data),
      source_metadata: {
        ...sourceMetadata,
        conflictResolvedAt: new Date().toISOString(),
        offlineDraftId: draftId,
      },
    })
    .eq("id", timelineEventId)
    .eq("user_id", userId);

  if (error) {
    logOfflineSyncError({
      draftId,
      errorCode: "timelineEventUpdateFailed",
      syncStatus: "failed",
      technicalContext: {
        phase: "resolve_update",
        supabaseCode: error.code,
        timelineEventId,
      },
    });

    return {
      result: {
        ok: false,
        error: {
          code: ErrorCodes.timelineEventUpdateFailed,
          message: "This conflict could not be resolved yet. Try again.",
        },
      },
    };
  }

  revalidatePath("/timeline");
  revalidatePath("/add");

  return {
    result: {
      ok: true,
      data: { draftId, resolution, timelineEventId },
    },
  };
}

function hasOfflineDraftConflict(
  draft: TimelineEventFormValues,
  server: {
    approximate_date_label: string | null;
    date_precision: string;
    occurred_on: string | null;
    title: string;
  },
) {
  return (
    draft.title !== server.title ||
    draft.datePrecision !== server.date_precision ||
    getOccurredOn(draft) !== server.occurred_on ||
    getDateLabel(draft) !== server.approximate_date_label
  );
}
