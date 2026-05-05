import type { ActionResult } from "@/lib/action-result";
import { ErrorCodes } from "@/lib/errors";
import { createClient } from "@/lib/supabase/server";
import type { TimelineEventSummary } from "@/features/timeline/types";

export const INITIAL_TIMELINE_EVENT_LIMIT = 50;

type TimelineEventRow = {
  id: string;
  title: string;
  story_text: string | null;
  occurred_on: string | null;
  date_precision: string;
  approximate_date_label: string | null;
  importance: string;
  status: string;
  source_label: string;
  created_at: string;
};

export async function listTimelineEvents(): Promise<
  ActionResult<{ events: TimelineEventSummary[]; reachedInitialLimit: boolean }>
> {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims?.sub) {
    return {
      ok: false,
      error: {
        code: ErrorCodes.permissionDenied,
        message: "Sign in again before loading your timeline.",
      },
    };
  }

  const { data, error } = await supabase
    .from("timeline_events")
    .select(
      "id,title,story_text,occurred_on,date_precision,approximate_date_label,importance,status,source_label,created_at",
    )
    .eq("status", "active")
    .order("occurred_on", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: true })
    .limit(INITIAL_TIMELINE_EVENT_LIMIT);

  if (error) {
    return {
      ok: false,
      error: {
        code: ErrorCodes.timelineEventNotFound,
        message: "Your timeline could not be loaded yet. Please try again.",
      },
    };
  }

  const rows = (data ?? []) as TimelineEventRow[];

  return {
    ok: true,
    data: {
      events: rows.map(mapTimelineEvent),
      reachedInitialLimit: rows.length === INITIAL_TIMELINE_EVENT_LIMIT,
    },
  };
}

function mapTimelineEvent(row: TimelineEventRow): TimelineEventSummary {
  return {
    id: row.id,
    title: row.title,
    storyText: row.story_text,
    occurredOn: row.occurred_on,
    datePrecision: row.date_precision,
    approximateDateLabel: row.approximate_date_label,
    importance: row.importance,
    status: row.status,
    sourceLabel: row.source_label,
    createdAt: row.created_at,
  };
}
