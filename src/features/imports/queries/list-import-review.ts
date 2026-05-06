import type { ActionResult } from "@/lib/action-result";
import { ErrorCodes } from "@/lib/errors";
import { createClient } from "@/lib/supabase/server";
import { logImportError } from "@/features/imports/logger";
import type {
  ImportRecordSummary,
  ImportSourceConnectionStatus,
  ImportAttachTimelineEventOption,
  ImportSourceSummary,
  ImportSourceType,
} from "@/features/imports/types";

export const IMPORT_REVIEW_RECORD_LIMIT = 100;

type ImportSourceRow = {
  id: string;
  source_type: string;
  display_name: string;
  connection_status: string;
  last_synced_at: string | null;
  source_metadata: Record<string, unknown> | null;
};

type ImportRecordRow = {
  id: string;
  source_id: string | null;
  source_type: string;
  source_label: string;
  content_summary: string;
  source_metadata: Record<string, unknown> | null;
  occurred_at: string | null;
  period_started_at: string | null;
  period_ended_at: string | null;
  imported_at: string;
  lifecycle_state: string;
  sync_status: string;
  suggested_date_label: string | null;
  suggested_timeline_event_id: string | null;
};

export async function listImportReview(): Promise<
  ActionResult<{
    sources: ImportSourceSummary[];
    records: ImportRecordSummary[];
    timelineOptions: ImportAttachTimelineEventOption[];
    hasConnectedSources: boolean;
  }>
> {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims?.sub) {
    return {
      ok: false,
      error: {
        code: ErrorCodes.permissionDenied,
        message: "Sign in again before loading imports.",
      },
    };
  }

  const [sourcesResult, recordsResult, timelineOptionsResult] = await Promise.all([
    supabase
      .from("import_sources")
      .select("id,source_type,display_name,connection_status,last_synced_at,source_metadata")
      .order("created_at", { ascending: false }),
    supabase
      .from("import_records")
      .select(
        "id,source_id,source_type,source_label,content_summary,source_metadata,occurred_at,period_started_at,period_ended_at,imported_at,lifecycle_state,sync_status,suggested_date_label,suggested_timeline_event_id",
      )
      .neq("lifecycle_state", "deleted")
      .order("imported_at", { ascending: false })
      .limit(IMPORT_REVIEW_RECORD_LIMIT),
    supabase
      .from("timeline_events")
      .select("id,title,approximate_date_label")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  if (sourcesResult.error || recordsResult.error || timelineOptionsResult.error) {
    logImportError("importAuthFailed", {
      technicalContext: {
        sourceQueryFailed: Boolean(sourcesResult.error),
        recordQueryFailed: Boolean(recordsResult.error),
        timelineOptionsQueryFailed: Boolean(timelineOptionsResult.error),
      },
    });

    return {
      ok: false,
      error: {
        code: ErrorCodes.importAuthFailed,
        message: "Import review could not load yet. Try again in a moment.",
      },
    };
  }

  const records = ((recordsResult.data ?? []) as ImportRecordRow[]).map(
    mapImportRecord,
  );
  const stagedCounts = getStagedCounts(records);
  const sources = ((sourcesResult.data ?? []) as ImportSourceRow[]).map((source) =>
    mapImportSource(source, stagedCounts.get(source.id) ?? 0),
  );
  const timelineOptions = ((timelineOptionsResult.data ?? []) as Array<{
    approximate_date_label: string | null;
    id: string;
    title: string;
  }>).map((event) => ({
    id: event.id,
    title: event.title,
    dateLabel: event.approximate_date_label,
  }));

  return {
    ok: true,
    data: {
      sources,
      records,
      timelineOptions,
      hasConnectedSources: sources.some(
        (source) => source.connectionStatus === "connected",
      ),
    },
  };
}

function mapImportSource(
  row: ImportSourceRow,
  stagedRecordCount: number,
): ImportSourceSummary {
  return {
    id: row.id,
    sourceType: toSourceType(row.source_type),
    displayName: row.display_name,
    connectionStatus: toConnectionStatus(row.connection_status),
    lastSyncedAt: row.last_synced_at,
    sourceMetadata: row.source_metadata ?? {},
    stagedRecordCount,
  };
}

function mapImportRecord(row: ImportRecordRow): ImportRecordSummary {
  return {
    id: row.id,
    sourceId: row.source_id,
    sourceType: toSourceType(row.source_type),
    sourceLabel: row.source_label,
    contentSummary: row.content_summary,
    sourceMetadata: row.source_metadata ?? {},
    occurredAt: row.occurred_at,
    periodStartedAt: row.period_started_at,
    periodEndedAt: row.period_ended_at,
    importedAt: row.imported_at,
    lifecycleState: toLifecycleState(row.lifecycle_state),
    syncStatus: toSyncStatus(row.sync_status),
    suggestedDateLabel: row.suggested_date_label,
    suggestedTimelineEventId: row.suggested_timeline_event_id,
  };
}

function getStagedCounts(records: ImportRecordSummary[]) {
  const counts = new Map<string, number>();

  for (const record of records) {
    if (record.sourceId && record.lifecycleState === "staged") {
      counts.set(record.sourceId, (counts.get(record.sourceId) ?? 0) + 1);
    }
  }

  return counts;
}

function toSourceType(value: string): ImportSourceType {
  return value === "notes" ? "notes" : "rescuetime";
}

function toConnectionStatus(value: string): ImportSourceConnectionStatus {
  if (
    value === "connected" ||
    value === "needs_reconnect" ||
    value === "disconnected" ||
    value === "failed"
  ) {
    return value;
  }

  return "not_connected";
}

function toLifecycleState(value: string): ImportRecordSummary["lifecycleState"] {
  if (
    value === "attached" ||
    value === "promoted" ||
    value === "hidden" ||
    value === "discarded" ||
    value === "deleted"
  ) {
    return value;
  }

  return "staged";
}

function toSyncStatus(value: string): ImportRecordSummary["syncStatus"] {
  if (
    value === "pending" ||
    value === "partial" ||
    value === "failed" ||
    value === "duplicate"
  ) {
    return value;
  }

  return "succeeded";
}
