import type { ActionResult } from "@/lib/action-result";
import { ErrorCodes } from "@/lib/errors";
import { createClient } from "@/lib/supabase/server";
import type {
  FutureIntentionSummary,
  TimelineEventSummary,
} from "@/features/timeline/types";

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
  photo_reference_url: string | null;
  photo_alt_text: string | null;
  created_at: string;
};

export async function listTimelineEvents(): Promise<
  ActionResult<{
    events: TimelineEventSummary[];
    futureIntentions: FutureIntentionSummary[];
    reachedInitialLimit: boolean;
  }>
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
      "id,title,story_text,occurred_on,date_precision,approximate_date_label,importance,status,source_label,photo_reference_url,photo_alt_text,created_at",
    )
    .eq("status", "active")
    .order("occurred_on", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: true })
    .limit(INITIAL_TIMELINE_EVENT_LIMIT);

  const { data: intentionsData, error: intentionsError } = await supabase
    .from("future_intentions")
    .select("id,title,target_on,target_label,status,created_at")
    .eq("status", "active")
    .order("target_on", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: true });

  if (error || intentionsError) {
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
      futureIntentions: ((intentionsData ?? []) as FutureIntentionRow[]).map(
        mapFutureIntention,
      ),
      reachedInitialLimit: rows.length === INITIAL_TIMELINE_EVENT_LIMIT,
    },
  };
}

type FutureIntentionRow = {
  id: string;
  title: string;
  target_on: string | null;
  target_label: string | null;
  status: string;
  created_at: string;
};

function mapTimelineEvent(row: TimelineEventRow): TimelineEventSummary {
  const occurredOn = row.occurred_on ?? "";

  return {
    id: row.id,
    title: row.title,
    storyText: row.story_text,
    occurredOn: row.occurred_on,
    datePrecision: row.date_precision,
    exactDate: row.date_precision === "exact" ? occurredOn : "",
    monthDate: row.date_precision === "month" ? occurredOn.slice(0, 7) : "",
    yearDate: row.date_precision === "year" ? occurredOn.slice(0, 4) : "",
    periodLabel: row.date_precision === "period" ? (row.approximate_date_label ?? "") : "",
    approximateDateLabel: row.approximate_date_label,
    importance: row.importance,
    status: row.status,
    sourceLabel: row.source_label,
    photoReferenceUrl: row.photo_reference_url,
    photoAltText: row.photo_alt_text,
    createdAt: row.created_at,
  };
}

function mapFutureIntention(row: FutureIntentionRow): FutureIntentionSummary {
  return {
    id: row.id,
    title: row.title,
    targetOn: row.target_on,
    targetLabel: row.target_label,
    status: row.status,
    createdAt: row.created_at,
  };
}
