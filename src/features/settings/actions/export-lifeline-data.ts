"use server";

import type { ActionResult } from "@/lib/action-result";
import { ErrorCodes } from "@/lib/errors";
import { createClient } from "@/lib/supabase/server";

type ExportLifelineDataState = {
  result?: ActionResult<{
    counts: {
      futureIntentions: number;
      importRecords: number;
      importSources: number;
      reflectionPatterns: number;
      reviewSessions: number;
      timelineEvents: number;
    };
    fileName: string;
    generatedAt: string;
    jsonText: string;
  }>;
};

export const initialExportLifelineDataState: ExportLifelineDataState = {};

export async function exportLifelineDataAction(): Promise<ExportLifelineDataState> {
  const result = await buildLifelineExport();
  return { result };
}

async function buildLifelineExport(): Promise<
  ActionResult<{
    counts: {
      futureIntentions: number;
      importRecords: number;
      importSources: number;
      reflectionPatterns: number;
      reviewSessions: number;
      timelineEvents: number;
    };
    fileName: string;
    generatedAt: string;
    jsonText: string;
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
        message: "Sign in again before exporting your Lifeline data.",
      },
    };
  }

  const [
    timelineEvents,
    reviewSessions,
    reflectionPatterns,
    futureIntentions,
    importSources,
    importRecords,
  ] = await Promise.all([
    supabase
      .from("timeline_events")
      .select(
        "id,title,story_text,occurred_on,date_precision,approximate_date_label,period_started_on,period_ended_on,importance,status,source_type,source_label,source_import_record_id,source_metadata,photo_reference_url,photo_alt_text,created_at,updated_at",
      )
      .eq("user_id", userId)
      .neq("status", "deleted")
      .order("created_at", { ascending: true }),
    supabase
      .from("review_sessions")
      .select(
        "id,period_started_on,period_ended_on,summary_text,status,created_at,updated_at",
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: true }),
    supabase
      .from("reflection_patterns")
      .select(
        "id,review_session_id,period_started_on,period_ended_on,title,description,author_state,status,created_at,updated_at",
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: true }),
    supabase
      .from("future_intentions")
      .select("id,title,target_on,target_label,status,created_at,updated_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: true }),
    supabase
      .from("import_sources")
      .select(
        "id,source_type,display_name,connection_status,last_synced_at,source_metadata,created_at,updated_at",
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: true }),
    supabase
      .from("import_records")
      .select(
        "id,source_id,source_type,source_record_id,source_label,content_summary,source_metadata,occurred_at,period_started_at,period_ended_at,imported_at,lifecycle_state,sync_status,suggested_date_label,suggested_timeline_event_id,created_at,updated_at",
      )
      .eq("user_id", userId)
      .neq("lifecycle_state", "deleted")
      .order("imported_at", { ascending: true }),
  ]);

  const failedQuery = [
    timelineEvents,
    reviewSessions,
    reflectionPatterns,
    futureIntentions,
    importSources,
    importRecords,
  ].find((query) => query.error);

  if (failedQuery?.error) {
    console.error("lifeline_export_error", {
      code: ErrorCodes.exportFailed,
      phase: "primary_queries",
      supabaseCode: failedQuery.error.code,
    });

    return {
      ok: false,
      error: {
        code: ErrorCodes.exportFailed,
        message:
          "Your export could not be prepared yet. You can retry from Settings or contact support without sharing private content.",
      },
    };
  }

  const patternIds = ((reflectionPatterns.data ?? []) as Array<{ id: string }>).map(
    (pattern) => pattern.id,
  );
  const futureIntentionIds = (
    (futureIntentions.data ?? []) as Array<{ id: string }>
  ).map((intention) => intention.id);

  const [patternEventLinks, futureIntentionLinks] = await Promise.all([
    patternIds.length > 0
      ? supabase
          .from("reflection_pattern_timeline_events")
          .select("pattern_id,timeline_event_id,created_at")
          .in("pattern_id", patternIds)
      : Promise.resolve({ data: [], error: null }),
    futureIntentionIds.length > 0
      ? supabase
          .from("future_intention_links")
          .select(
            "id,future_intention_id,review_session_id,reflection_pattern_id,timeline_event_id,created_at",
          )
          .in("future_intention_id", futureIntentionIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (patternEventLinks.error || futureIntentionLinks.error) {
    console.error("lifeline_export_error", {
      code: ErrorCodes.exportFailed,
      phase: "link_queries",
      futureIntentionLinkFailed: Boolean(futureIntentionLinks.error),
      patternEventLinkFailed: Boolean(patternEventLinks.error),
    });

    return {
      ok: false,
      error: {
        code: ErrorCodes.exportFailed,
        message:
          "Your export links could not be prepared yet. You can retry from Settings.",
      },
    };
  }

  const generatedAt = new Date().toISOString();
  const exportData = {
    exportedAt: generatedAt,
    exportVersion: 1,
    accountScope: "authenticated_user",
    contentNotes: {
      manualContent:
        "timelineEvents with source_type manual are user-created memories.",
      importedContext:
        "importRecords and timelineEvents with source_type imported preserve source references, source metadata, and lifecycle state where relevant.",
      deletedData:
        "deleted timeline events and deleted imported records are excluded from this export.",
    },
    timelineEvents: timelineEvents.data ?? [],
    reviewSessions: reviewSessions.data ?? [],
    reflectionPatterns: reflectionPatterns.data ?? [],
    reflectionPatternTimelineEvents: patternEventLinks.data ?? [],
    futureIntentions: futureIntentions.data ?? [],
    futureIntentionLinks: futureIntentionLinks.data ?? [],
    importSources: importSources.data ?? [],
    importRecords: importRecords.data ?? [],
  };
  const counts = {
    futureIntentions: exportData.futureIntentions.length,
    importRecords: exportData.importRecords.length,
    importSources: exportData.importSources.length,
    reflectionPatterns: exportData.reflectionPatterns.length,
    reviewSessions: exportData.reviewSessions.length,
    timelineEvents: exportData.timelineEvents.length,
  };

  return {
    ok: true,
    data: {
      counts,
      fileName: `lifeline-export-${generatedAt.slice(0, 10)}.json`,
      generatedAt,
      jsonText: JSON.stringify(exportData, null, 2),
    },
  };
}
