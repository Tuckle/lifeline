import type { ActionResult } from "@/lib/action-result";
import { ErrorCodes } from "@/lib/errors";
import { createClient } from "@/lib/supabase/server";
import type {
  ImportRecordLifecycleState,
  ImportRecordSyncStatus,
  ImportSourceConnectionStatus,
  ImportSourceType,
} from "@/features/imports/types";

type PrivacyImportSourceRow = {
  connection_status: string;
  display_name: string;
  id: string;
  last_synced_at: string | null;
  source_metadata: Record<string, unknown> | null;
  source_type: string;
};

type PrivacyImportRecordRow = {
  lifecycle_state: string;
  source_id: string | null;
  sync_status: string;
};

type ImportLifecycleCounts = Record<ImportRecordLifecycleState, number>;
type ImportSyncCounts = Record<ImportRecordSyncStatus, number>;

export type PrivacyDataSourceSummary = {
  connectionStatus: ImportSourceConnectionStatus;
  displayName: string;
  futureAccessSummary: string;
  id: string;
  importedContextSummary: string;
  importedRecordCount: number;
  issueSummary: string;
  lastSyncedAt: string | null;
  lifecycleCounts: ImportLifecycleCounts;
  managementActions: string[];
  metadataDetails: string[];
  permissionSummary: string;
  sourceType: ImportSourceType;
  syncCounts: ImportSyncCounts;
};

export type PrivacyDataSummary = {
  hasConnectedSources: boolean;
  importedRecordCount: number;
  sourceCount: number;
  sources: PrivacyDataSourceSummary[];
  timelineEventCount: number;
};

export async function getPrivacyDataSummary(): Promise<
  ActionResult<PrivacyDataSummary>
> {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (claimsError || !userId) {
    return {
      ok: false,
      error: {
        code: ErrorCodes.permissionDenied,
        message: "Sign in again before loading Privacy and Data settings.",
      },
    };
  }

  const [sourcesResult, importedRecordsResult, timelineEventsResult] =
    await Promise.all([
      supabase
        .from("import_sources")
        .select(
          "id,source_type,display_name,connection_status,last_synced_at,source_metadata",
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
      supabase
        .from("import_records")
        .select("source_id,lifecycle_state,sync_status")
        .eq("user_id", userId)
        .neq("lifecycle_state", "deleted"),
      supabase
        .from("timeline_events")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .neq("status", "deleted"),
    ]);

  if (
    sourcesResult.error ||
    importedRecordsResult.error ||
    timelineEventsResult.error
  ) {
    return {
      ok: false,
      error: {
        code: ErrorCodes.settingsLoadFailed,
        message:
          "Privacy and Data settings could not load yet. Try again in a moment.",
      },
    };
  }

  const recordsBySource = groupRecordsBySource(
    (importedRecordsResult.data ?? []) as PrivacyImportRecordRow[],
  );
  const sources = ((sourcesResult.data ?? []) as PrivacyImportSourceRow[]).map(
    (source) => mapPrivacySource(source, recordsBySource.get(source.id) ?? []),
  );

  return {
    ok: true,
    data: {
      hasConnectedSources: sources.some(
        (source) => source.connectionStatus === "connected",
      ),
      importedRecordCount: ((importedRecordsResult.data ?? []) as unknown[])
        .length,
      sourceCount: sources.length,
      sources,
      timelineEventCount: timelineEventsResult.count ?? 0,
    },
  };
}

function groupRecordsBySource(records: PrivacyImportRecordRow[]) {
  const recordsBySource = new Map<string, PrivacyImportRecordRow[]>();

  for (const record of records) {
    if (!record.source_id) continue;

    const current = recordsBySource.get(record.source_id) ?? [];
    current.push(record);
    recordsBySource.set(record.source_id, current);
  }

  return recordsBySource;
}

function mapPrivacySource(
  source: PrivacyImportSourceRow,
  records: PrivacyImportRecordRow[],
): PrivacyDataSourceSummary {
  const sourceType = toSourceType(source.source_type);
  const connectionStatus = toConnectionStatus(source.connection_status);
  const lifecycleCounts = countLifecycleStates(records);
  const syncCounts = countSyncStates(records);

  return {
    connectionStatus,
    displayName: source.display_name,
    futureAccessSummary: getFutureAccessSummary(sourceType, connectionStatus),
    id: source.id,
    importedContextSummary: getImportedContextSummary(sourceType, records.length),
    importedRecordCount: records.length,
    issueSummary: getIssueSummary({
      connectionStatus,
      metadata: source.source_metadata ?? {},
      syncCounts,
    }),
    lastSyncedAt: source.last_synced_at,
    lifecycleCounts,
    managementActions: getManagementActions(connectionStatus),
    metadataDetails: getSafeMetadataDetails(sourceType, source.source_metadata ?? {}),
    permissionSummary: getPermissionSummary(sourceType),
    sourceType,
    syncCounts,
  };
}

function countLifecycleStates(records: PrivacyImportRecordRow[]) {
  const counts = {
    staged: 0,
    attached: 0,
    promoted: 0,
    hidden: 0,
    discarded: 0,
    deleted: 0,
  } satisfies ImportLifecycleCounts;

  for (const record of records) {
    counts[toLifecycleState(record.lifecycle_state)] += 1;
  }

  return counts;
}

function countSyncStates(records: PrivacyImportRecordRow[]) {
  const counts = {
    pending: 0,
    succeeded: 0,
    partial: 0,
    failed: 0,
    duplicate: 0,
  } satisfies ImportSyncCounts;

  for (const record of records) {
    counts[toSyncStatus(record.sync_status)] += 1;
  }

  return counts;
}

function getPermissionSummary(sourceType: ImportSourceType) {
  if (sourceType === "rescuetime") {
    return "Lifeline can import RescueTime activity context through the server connection you configured. It stays staged until you promote, attach, hide, or discard it.";
  }

  return "Lifeline stores only the notes export content you choose to import. Imported notes stay staged until you decide what belongs on the timeline.";
}

function getFutureAccessSummary(
  sourceType: ImportSourceType,
  connectionStatus: ImportSourceConnectionStatus,
) {
  if (connectionStatus === "disconnected") {
    return "Future sync is stopped. Already imported records stay available until you delete them separately.";
  }

  if (sourceType === "rescuetime") {
    return "Future imports can run while the RescueTime source remains connected.";
  }

  return "Future notes access happens only when you provide another notes export.";
}

function getImportedContextSummary(
  sourceType: ImportSourceType,
  importedRecordCount: number,
) {
  const label = sourceType === "rescuetime" ? "RescueTime records" : "notes records";
  return `${importedRecordCount} ${label} imported into reviewable staging context.`;
}

function getIssueSummary({
  connectionStatus,
  metadata,
  syncCounts,
}: {
  connectionStatus: ImportSourceConnectionStatus;
  metadata: Record<string, unknown>;
  syncCounts: ImportSyncCounts;
}) {
  if (connectionStatus === "needs_reconnect") {
    return "Authorization needs attention before future sync can continue.";
  }

  if (connectionStatus === "failed") {
    const failedCount =
      typeof metadata.failedCount === "number" ? metadata.failedCount : null;

    if (failedCount && failedCount > 0) {
      return `Source data issue: ${failedCount} item(s) could not be imported cleanly.`;
    }

    return "Import failed. The known issue may be authorization, network, source availability, source data, or an unknown source response.";
  }

  if (syncCounts.partial > 0 || syncCounts.failed > 0) {
    return "Some records need attention. Imported context that succeeded remains available.";
  }

  return "No active source issue reported.";
}

function getManagementActions(connectionStatus: ImportSourceConnectionStatus) {
  if (connectionStatus === "failed" || connectionStatus === "needs_reconnect") {
    return ["Open import recovery", "Review disconnect", "Review delete"];
  }

  if (connectionStatus === "disconnected") {
    return ["Review imported records", "Review delete"];
  }

  return ["Open import review", "Review disconnect", "Review delete"];
}

function getSafeMetadataDetails(
  sourceType: ImportSourceType,
  metadata: Record<string, unknown>,
) {
  const details: string[] = [];

  if (sourceType === "rescuetime") {
    if (metadata.connectionMethod) {
      details.push(`Connection method: ${String(metadata.connectionMethod)}`);
    }

    if (metadata.endpoint) {
      details.push(`Source endpoint: ${String(metadata.endpoint)}`);
    }
  }

  if (sourceType === "notes") {
    if (metadata.importMethod) {
      details.push(`Import method: ${String(metadata.importMethod)}`);
    }

    if (typeof metadata.copiedIntoLifeline === "boolean") {
      details.push(
        `Copied into Lifeline: ${metadata.copiedIntoLifeline ? "yes" : "no"}`,
      );
    }

    if (typeof metadata.failedCount === "number") {
      details.push(`Failed item count: ${metadata.failedCount}`);
    }
  }

  return details.length > 0 ? details : ["No extra source metadata stored."];
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

function toLifecycleState(value: string): ImportRecordLifecycleState {
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

function toSyncStatus(value: string): ImportRecordSyncStatus {
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
