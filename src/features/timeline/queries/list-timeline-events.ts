import type { ActionResult } from "@/lib/action-result";
import { ErrorCodes } from "@/lib/errors";
import { createClient } from "@/lib/supabase/server";
import type {
  FutureIntentionLinkedContext,
  FutureIntentionLinkOption,
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
  const intentionRows = (intentionsData ?? []) as FutureIntentionRow[];
  const intentionLinks = await loadFutureIntentionLinks(
    intentionRows.map((intention) => intention.id),
  );

  if (!intentionLinks.ok) {
    return intentionLinks;
  }

  return {
    ok: true,
    data: {
      events: rows.map(mapTimelineEvent),
      futureIntentions: intentionRows.map((intention) =>
        mapFutureIntention(intention, intentionLinks.data.get(intention.id) ?? null),
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

type FutureIntentionLinkRow = {
  future_intention_id: string;
  review_session_id: string | null;
  reflection_pattern_id: string | null;
  timeline_event_id: string | null;
  review_sessions:
    | { id: string; summary_text: string; period_started_on: string | null; period_ended_on: string | null }
    | { id: string; summary_text: string; period_started_on: string | null; period_ended_on: string | null }[]
    | null;
  reflection_patterns:
    | { id: string; title: string }
    | { id: string; title: string }[]
    | null;
  timeline_events:
    | { id: string; title: string }
    | { id: string; title: string }[]
    | null;
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

function mapFutureIntention(
  row: FutureIntentionRow,
  linkedContext: FutureIntentionLinkedContext | null,
): FutureIntentionSummary {
  return {
    id: row.id,
    title: row.title,
    targetOn: row.target_on,
    targetLabel: row.target_label,
    status: row.status,
    createdAt: row.created_at,
    linkedContext,
  };
}

async function loadFutureIntentionLinks(
  futureIntentionIds: string[],
): Promise<ActionResult<Map<string, FutureIntentionLinkedContext>>> {
  const linkedContext = new Map<string, FutureIntentionLinkedContext>();

  if (futureIntentionIds.length === 0) {
    return { ok: true, data: linkedContext };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("future_intention_links")
    .select(
      "future_intention_id,review_session_id,reflection_pattern_id,timeline_event_id,review_sessions(id,summary_text,period_started_on,period_ended_on),reflection_patterns(id,title),timeline_events(id,title)",
    )
    .in("future_intention_id", futureIntentionIds);

  if (error) {
    return {
      ok: false,
      error: {
        code: ErrorCodes.futureIntentionSaveFailed,
        message: "Future intention links could not load yet.",
      },
    };
  }

  for (const row of (data ?? []) as FutureIntentionLinkRow[]) {
    const context = mapLinkedContext(row);

    if (context) {
      linkedContext.set(row.future_intention_id, context);
    }
  }

  return { ok: true, data: linkedContext };
}

function mapLinkedContext(
  row: FutureIntentionLinkRow,
): FutureIntentionLinkedContext | null {
  const reviewSession = getRelation(row.review_sessions);
  const pattern = getRelation(row.reflection_patterns);
  const memory = getRelation(row.timeline_events);

  if (row.review_session_id && reviewSession && "summary_text" in reviewSession) {
    const title = reviewSession.summary_text
      ? getPreview(reviewSession.summary_text)
      : "Saved reflection";

    return {
      type: "reflection",
      id: reviewSession.id,
      title,
      href: `/reflect?from=${reviewSession.period_started_on ?? ""}&to=${reviewSession.period_ended_on ?? ""}`,
    };
  }

  if (row.reflection_pattern_id && pattern && "title" in pattern) {
    return {
      type: "pattern",
      id: pattern.id,
      title: pattern.title,
      href: "/reflect",
    };
  }

  if (row.timeline_event_id && memory && "title" in memory) {
    return {
      type: "memory",
      id: memory.id,
      title: memory.title,
      href: `/timeline#memory-${memory.id}`,
    };
  }

  return null;
}

function getRelation<T>(relation: T | T[] | null) {
  return Array.isArray(relation) ? relation[0] : relation;
}

function getPreview(value: string) {
  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized.length > 70 ? `${normalized.slice(0, 67)}...` : normalized;
}

export async function listFutureIntentionLinkOptions(): Promise<
  ActionResult<FutureIntentionLinkOption[]>
> {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims?.sub) {
    return {
      ok: false,
      error: {
        code: ErrorCodes.permissionDenied,
        message: "Sign in again before loading link options.",
      },
    };
  }

  const [events, sessions, patterns] = await Promise.all([
    supabase
      .from("timeline_events")
      .select("id,title")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("review_sessions")
      .select("id,summary_text,period_started_on,period_ended_on")
      .order("updated_at", { ascending: false })
      .limit(20),
    supabase
      .from("reflection_patterns")
      .select("id,title")
      .eq("status", "active")
      .order("updated_at", { ascending: false })
      .limit(20),
  ]);

  if (events.error || sessions.error || patterns.error) {
    return {
      ok: false,
      error: {
        code: ErrorCodes.futureIntentionSaveFailed,
        message: "Link options could not load yet.",
      },
    };
  }

  return {
    ok: true,
    data: [
      ...((sessions.data ?? []) as Array<{
        id: string;
        summary_text: string;
        period_started_on: string | null;
        period_ended_on: string | null;
      }>).map((session) => ({
        type: "reflection" as const,
        id: session.id,
        title: session.summary_text ? getPreview(session.summary_text) : "Saved reflection",
        href: `/reflect?from=${session.period_started_on ?? ""}&to=${session.period_ended_on ?? ""}`,
      })),
      ...((patterns.data ?? []) as Array<{ id: string; title: string }>).map(
        (pattern) => ({
          type: "pattern" as const,
          id: pattern.id,
          title: pattern.title,
          href: "/reflect",
        }),
      ),
      ...((events.data ?? []) as Array<{ id: string; title: string }>).map(
        (event) => ({
          type: "memory" as const,
          id: event.id,
          title: event.title,
          href: `/timeline#memory-${event.id}`,
        }),
      ),
    ],
  };
}
