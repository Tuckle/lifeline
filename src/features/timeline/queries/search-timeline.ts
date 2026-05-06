import type { ActionResult } from "@/lib/action-result";
import { ErrorCodes } from "@/lib/errors";
import { createClient } from "@/lib/supabase/server";
import type { ReviewSessionSummary } from "@/features/reviews/queries/get-reflection-session";
import { importanceValues } from "@/features/timeline/schemas/timeline-event-form";
import type {
  FutureIntentionSummary,
  TimelineEventSummary,
} from "@/features/timeline/types";

export const SEARCH_RESULT_LIMIT = 1000;

export const timelineItemTypeValues = [
  "all",
  "memory",
  "reflection",
  "future-intention",
] as const;

export type TimelineItemType = (typeof timelineItemTypeValues)[number];
export type TimelineImportanceFilter = "all" | (typeof importanceValues)[number];

export type TimelineSearchFilters = {
  query: string;
  fromDate: string;
  toDate: string;
  importance: TimelineImportanceFilter;
  source: string;
  itemType: TimelineItemType;
};

type RawSearchParams = Record<string, string | string[] | undefined>;

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

type FutureIntentionRow = {
  id: string;
  title: string;
  target_on: string | null;
  target_label: string | null;
  status: string;
  created_at: string;
};

type ReviewSessionRow = {
  id: string;
  period_started_on: string | null;
  period_ended_on: string | null;
  summary_text: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export function parseTimelineSearchParams(
  searchParams: RawSearchParams,
): TimelineSearchFilters {
  const itemType = getAllowedValue(
    readParam(searchParams, "itemType"),
    timelineItemTypeValues,
    "all",
  );
  const importance = getAllowedValue(
    readParam(searchParams, "importance"),
    ["all", ...importanceValues] as const,
    "all",
  );

  return {
    query: readParam(searchParams, "q").slice(0, 120),
    fromDate: getDateParam(readParam(searchParams, "from")),
    toDate: getDateParam(readParam(searchParams, "to")),
    importance,
    source: readParam(searchParams, "source").slice(0, 80),
    itemType,
  };
}

export function hasActiveTimelineSearchFilters(filters: TimelineSearchFilters) {
  return (
    filters.query.length > 0 ||
    filters.fromDate.length > 0 ||
    filters.toDate.length > 0 ||
    filters.importance !== "all" ||
    filters.source.length > 0 ||
    filters.itemType !== "all"
  );
}

export async function searchTimeline(
  filters: TimelineSearchFilters,
): Promise<
  ActionResult<{
    events: TimelineEventSummary[];
    futureIntentions: FutureIntentionSummary[];
    reviewSessions: ReviewSessionSummary[];
    reachedSearchLimit: boolean;
  }>
> {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims?.sub) {
    return {
      ok: false,
      error: {
        code: ErrorCodes.permissionDenied,
        message: "Sign in again before searching your timeline.",
      },
    };
  }

  const shouldLoadEvents = filters.itemType !== "future-intention";
  const shouldLoadIntentions =
    !["memory", "reflection"].includes(filters.itemType) &&
    filters.importance === "all";
  const shouldLoadReviewSessions =
    !["memory", "future-intention"].includes(filters.itemType) &&
    filters.importance === "all";

  const [eventsResult, intentionsResult, reviewSessionsResult] = await Promise.all([
    shouldLoadEvents
      ? supabase
          .from("timeline_events")
          .select(
            "id,title,story_text,occurred_on,date_precision,approximate_date_label,importance,status,source_label,photo_reference_url,photo_alt_text,created_at",
          )
          .eq("status", "active")
          .order("occurred_on", { ascending: true, nullsFirst: false })
          .order("created_at", { ascending: true })
          .limit(SEARCH_RESULT_LIMIT)
      : Promise.resolve({ data: [], error: null }),
    shouldLoadIntentions
      ? supabase
          .from("future_intentions")
          .select("id,title,target_on,target_label,status,created_at")
          .eq("status", "active")
          .order("target_on", { ascending: true, nullsFirst: false })
          .order("created_at", { ascending: true })
          .limit(SEARCH_RESULT_LIMIT)
      : Promise.resolve({ data: [], error: null }),
    shouldLoadReviewSessions
      ? supabase
          .from("review_sessions")
          .select("id,period_started_on,period_ended_on,summary_text,status,created_at,updated_at")
          .order("updated_at", { ascending: false })
          .limit(SEARCH_RESULT_LIMIT)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (eventsResult.error || intentionsResult.error || reviewSessionsResult.error) {
    return {
      ok: false,
      error: {
        code: ErrorCodes.timelineSearchFailed,
        message: "Search could not finish yet. Try again or clear a filter.",
      },
    };
  }

  const eventRows = (eventsResult.data ?? []) as TimelineEventRow[];
  const intentionRows = (intentionsResult.data ?? []) as FutureIntentionRow[];
  const reviewSessionRows = (reviewSessionsResult.data ?? []) as ReviewSessionRow[];
  const events = eventRows.map(mapTimelineEvent).filter((event) =>
    eventMatchesFilters(event, filters),
  );
  const futureIntentions = intentionRows.map(mapFutureIntention).filter(
    (intention) => intentionMatchesFilters(intention, filters),
  );
  const reviewSessions = reviewSessionRows.map(mapReviewSession).filter(
    (session) => reviewSessionMatchesFilters(session, filters),
  );

  return {
    ok: true,
    data: {
      events,
      futureIntentions,
      reviewSessions,
      reachedSearchLimit:
        eventRows.length === SEARCH_RESULT_LIMIT ||
        intentionRows.length === SEARCH_RESULT_LIMIT ||
        reviewSessionRows.length === SEARCH_RESULT_LIMIT,
    },
  };
}

function eventMatchesFilters(
  event: TimelineEventSummary,
  filters: TimelineSearchFilters,
) {
  if (filters.query && !matchesText(eventSearchText(event), filters.query)) {
    return false;
  }

  if (filters.source && !matchesText(event.sourceLabel, filters.source)) {
    return false;
  }

  if (filters.importance !== "all" && event.importance !== filters.importance) {
    return false;
  }

  return matchesDateRange(event.occurredOn, filters);
}

function intentionMatchesFilters(
  intention: FutureIntentionSummary,
  filters: TimelineSearchFilters,
) {
  if (filters.query && !matchesText(intentionSearchText(intention), filters.query)) {
    return false;
  }

  if (filters.source && !matchesText("Future intention", filters.source)) {
    return false;
  }

  return matchesDateRange(intention.targetOn, filters);
}

function reviewSessionMatchesFilters(
  session: ReviewSessionSummary,
  filters: TimelineSearchFilters,
) {
  if (filters.query && !matchesText(reviewSessionSearchText(session), filters.query)) {
    return false;
  }

  if (filters.source && !matchesText("Reflection", filters.source)) {
    return false;
  }

  return matchesDateRange(session.periodStartedOn ?? session.periodEndedOn, filters);
}

function eventSearchText(event: TimelineEventSummary) {
  return [
    event.title,
    event.storyText,
    event.occurredOn,
    event.approximateDateLabel,
    event.datePrecision,
    event.importance,
    event.sourceLabel,
  ]
    .filter(Boolean)
    .join(" ");
}

function intentionSearchText(intention: FutureIntentionSummary) {
  return [
    intention.title,
    intention.targetOn,
    intention.targetLabel,
    "future intention",
  ]
    .filter(Boolean)
    .join(" ");
}

function reviewSessionSearchText(session: ReviewSessionSummary) {
  return [
    session.summaryText,
    session.periodStartedOn,
    session.periodEndedOn,
    session.status,
    "reflection",
    "review session",
  ]
    .filter(Boolean)
    .join(" ");
}

function matchesText(value: string, query: string) {
  return normalizeSearchText(value).includes(normalizeSearchText(query));
}

function matchesDateRange(
  dateValue: string | null,
  filters: Pick<TimelineSearchFilters, "fromDate" | "toDate">,
) {
  if (!filters.fromDate && !filters.toDate) {
    return true;
  }

  if (!dateValue) {
    return false;
  }

  if (filters.fromDate && dateValue < filters.fromDate) {
    return false;
  }

  if (filters.toDate && dateValue > filters.toDate) {
    return false;
  }

  return true;
}

function normalizeSearchText(value: string) {
  return value.toLocaleLowerCase().replace(/\s+/g, " ").trim();
}

function readParam(searchParams: RawSearchParams, key: string) {
  const value = searchParams[key];

  if (Array.isArray(value)) {
    return (value[0] ?? "").trim();
  }

  return (value ?? "").trim();
}

function getDateParam(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : "";
}

function getAllowedValue<const T extends readonly string[]>(
  value: string,
  allowedValues: T,
  fallback: T[number],
) {
  return allowedValues.includes(value) ? (value as T[number]) : fallback;
}

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

function mapReviewSession(row: ReviewSessionRow): ReviewSessionSummary {
  return {
    id: row.id,
    periodStartedOn: row.period_started_on,
    periodEndedOn: row.period_ended_on,
    summaryText: row.summary_text,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
