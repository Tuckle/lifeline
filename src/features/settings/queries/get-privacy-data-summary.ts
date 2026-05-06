import type { ActionResult } from "@/lib/action-result";
import { ErrorCodes } from "@/lib/errors";
import { createClient } from "@/lib/supabase/server";

type PrivacyImportSourceRow = {
  connection_status: string;
  display_name: string;
  id: string;
  last_synced_at: string | null;
  source_type: string;
};

export type PrivacyDataSourceSummary = {
  connectionStatus: string;
  displayName: string;
  id: string;
  lastSyncedAt: string | null;
  sourceType: string;
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
        .select("id,source_type,display_name,connection_status,last_synced_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
      supabase
        .from("import_records")
        .select("id", { count: "exact", head: true })
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

  const sources = ((sourcesResult.data ?? []) as PrivacyImportSourceRow[]).map(
    (source) => ({
      connectionStatus: source.connection_status,
      displayName: source.display_name,
      id: source.id,
      lastSyncedAt: source.last_synced_at,
      sourceType: source.source_type,
    }),
  );

  return {
    ok: true,
    data: {
      hasConnectedSources: sources.some(
        (source) => source.connectionStatus === "connected",
      ),
      importedRecordCount: importedRecordsResult.count ?? 0,
      sourceCount: sources.length,
      sources,
      timelineEventCount: timelineEventsResult.count ?? 0,
    },
  };
}
