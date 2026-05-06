"use server";

import { revalidatePath } from "next/cache";

import type { ActionResult } from "@/lib/action-result";
import { ErrorCodes } from "@/lib/errors";
import { createClient } from "@/lib/supabase/server";
import { logImportError } from "@/features/imports/logger";
import { fetchRescueTimeHourlyProductivity } from "@/features/imports/rescuetime/client";

type RescueTimeImportState = {
  result?: ActionResult<{
    sourceId?: string;
    importedCount?: number;
    failedCount?: number;
  }>;
  values: {
    fromDate: string;
    toDate: string;
  };
};

type RescueTimeConnectState = {
  result?: ActionResult<{ sourceId: string }>;
};

export const initialRescueTimeConnectState: RescueTimeConnectState = {};

export const initialRescueTimeImportState: RescueTimeImportState = {
  values: getDefaultImportRange(),
};

export async function connectRescueTimeFormAction(
  _previousState: RescueTimeConnectState,
): Promise<RescueTimeConnectState> {
  return { result: await connectRescueTimeAction() };
}

export async function connectRescueTimeAction(): Promise<
  ActionResult<{ sourceId: string }>
> {
  const apiKey = process.env.RESCUETIME_API_KEY;

  if (!apiKey) {
    return {
      ok: false,
      error: {
        code: ErrorCodes.importAuthFailed,
        message: "Add RESCUETIME_API_KEY on the server before connecting RescueTime.",
      },
    };
  }

  const user = await getImportUser();
  if (!user.ok) return user;

  const supabase = await createClient();
  const existing = await supabase
    .from("import_sources")
    .select("id")
    .eq("source_type", "rescuetime")
    .eq("display_name", "RescueTime")
    .maybeSingle();

  if (existing.error) {
    return {
      ok: false,
      error: {
        code: ErrorCodes.importAuthFailed,
        message: "RescueTime could not connect yet. Try again in a moment.",
      },
    };
  }

  if (existing.data?.id) {
    const { error } = await supabase
      .from("import_sources")
      .update({
        connection_status: "connected",
        source_metadata: {
          connectionMethod: "server_api_key",
          endpoint: "anapi/data",
        },
      })
      .eq("id", existing.data.id);

    if (error) {
      return {
        ok: false,
        error: {
          code: ErrorCodes.importAuthFailed,
          message: "RescueTime connection could not be refreshed yet.",
        },
      };
    }

    revalidatePath("/imports");
    return { ok: true, data: { sourceId: existing.data.id } };
  }

  const { data, error } = await supabase
    .from("import_sources")
    .insert({
      user_id: user.data.userId,
      source_type: "rescuetime",
      display_name: "RescueTime",
      connection_status: "connected",
      source_metadata: {
        connectionMethod: "server_api_key",
        endpoint: "anapi/data",
      },
    })
    .select("id")
    .single();

  if (error || !data?.id) {
    return {
      ok: false,
      error: {
        code: ErrorCodes.importAuthFailed,
        message: "RescueTime could not connect yet. Try again in a moment.",
      },
    };
  }

  revalidatePath("/imports");
  return { ok: true, data: { sourceId: data.id } };
}

export async function importRescueTimeAction(
  _previousState: RescueTimeImportState,
  formData: FormData,
): Promise<RescueTimeImportState> {
  const values = {
    fromDate: String(formData.get("fromDate") ?? ""),
    toDate: String(formData.get("toDate") ?? ""),
  };
  const apiKey = process.env.RESCUETIME_API_KEY;

  if (!apiKey) {
    return {
      values,
      result: {
        ok: false,
        error: {
          code: ErrorCodes.importAuthFailed,
          message: "Add RESCUETIME_API_KEY on the server before importing RescueTime data.",
        },
      },
    };
  }

  if (!isDateOnly(values.fromDate) || !isDateOnly(values.toDate)) {
    return {
      values,
      result: {
        ok: false,
        error: {
          code: ErrorCodes.validationFailed,
          message: "Choose a valid RescueTime date range.",
        },
      },
    };
  }

  const connection = await connectRescueTimeAction();
  if (!connection.ok) {
    return { values, result: connection };
  }

  try {
    const records = await fetchRescueTimeHourlyProductivity({
      apiKey,
      fromDate: values.fromDate,
      toDate: values.toDate,
    });
    const user = await getImportUser();

    if (!user.ok) return { values, result: user };

    const supabase = await createClient();
    const rows = records.map((record) => ({
      user_id: user.data.userId,
      source_id: connection.data.sourceId,
      source_type: "rescuetime",
      source_record_id: record.sourceRecordId,
      source_label: "RescueTime",
      content_summary: record.contentSummary,
      source_metadata: record.sourceMetadata,
      occurred_at: record.occurredAt,
      period_started_at: record.periodStartedAt,
      period_ended_at: record.periodEndedAt,
      lifecycle_state: "staged",
      sync_status: "succeeded",
      suggested_date_label: getSuggestedDateLabel(record.periodStartedAt),
    }));

    if (rows.length > 0) {
      const { error } = await supabase
        .from("import_records")
        .upsert(rows, {
          onConflict: "user_id,source_type,source_record_id",
        });

      if (error) {
        throw error;
      }
    }

    await supabase
      .from("import_sources")
      .update({ last_synced_at: new Date().toISOString(), connection_status: "connected" })
      .eq("id", connection.data.sourceId);

    revalidatePath("/imports");

    return {
      values,
      result: {
        ok: true,
        data: { sourceId: connection.data.sourceId, importedCount: rows.length },
      },
    };
  } catch (error) {
    logImportError("importAuthFailed", {
      sourceType: "rescuetime",
      sourceId: connection.data.sourceId,
      syncStatus: "failed",
      technicalContext: {
        name: error instanceof Error ? error.name : "unknown_error",
      },
    });

    return {
      values,
      result: {
        ok: false,
        error: {
          code: ErrorCodes.importAuthFailed,
          message:
            "RescueTime import could not finish. Existing staged records are still available, and you can retry this range.",
        },
      },
    };
  }
}

async function getImportUser(): Promise<ActionResult<{ userId: string }>> {
  const supabase = await createClient();
  const { data: claimsData, error } = await supabase.auth.getClaims();

  if (error || !claimsData?.claims?.sub) {
    return {
      ok: false,
      error: {
        code: ErrorCodes.permissionDenied,
        message: "Sign in again before changing imports.",
      },
    };
  }

  return { ok: true, data: { userId: claimsData.claims.sub } };
}

function isDateOnly(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function getDefaultImportRange() {
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - 7);

  return {
    fromDate: start.toISOString().slice(0, 10),
    toDate: end.toISOString().slice(0, 10),
  };
}

function getSuggestedDateLabel(value: string | null) {
  if (!value) return null;

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
