import type { ActionResult } from "@/lib/action-result";
import { ErrorCodes } from "@/lib/errors";
import { createClient } from "@/lib/supabase/server";
import type { PeriodReviewSelection } from "@/features/reviews/queries/get-period-review";

export type ReflectionPatternSummary = {
  id: string;
  reviewSessionId: string | null;
  periodStartedOn: string | null;
  periodEndedOn: string | null;
  title: string;
  description: string;
  authorState: string;
  status: string;
  linkedEvents: Array<{ id: string; title: string }>;
  createdAt: string;
  updatedAt: string;
};

type ReflectionPatternRow = {
  id: string;
  review_session_id: string | null;
  period_started_on: string | null;
  period_ended_on: string | null;
  title: string;
  description: string;
  author_state: string;
  status: string;
  created_at: string;
  updated_at: string;
};

type ReflectionPatternLinkRow = {
  pattern_id: string;
  timeline_event_id: string;
  timeline_events: { id: string; title: string } | { id: string; title: string }[] | null;
};

export async function listReflectionPatternsForPeriod(
  selection: PeriodReviewSelection,
): Promise<ActionResult<ReflectionPatternSummary[]>> {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims?.sub) {
    return {
      ok: false,
      error: {
        code: ErrorCodes.permissionDenied,
        message: "Sign in again before loading your patterns.",
      },
    };
  }

  let query = supabase
    .from("reflection_patterns")
    .select(
      "id,review_session_id,period_started_on,period_ended_on,title,description,author_state,status,created_at,updated_at",
    )
    .eq("status", "active")
    .order("updated_at", { ascending: false })
    .limit(20);

  query = selection.fromDate
    ? query.eq("period_started_on", selection.fromDate)
    : query.is("period_started_on", null);
  query = selection.toDate
    ? query.eq("period_ended_on", selection.toDate)
    : query.is("period_ended_on", null);

  const { data, error } = await query;

  if (error) {
    return {
      ok: false,
      error: {
        code: ErrorCodes.reflectionPatternSaveFailed,
        message: "Patterns could not load yet. Please try again.",
      },
    };
  }

  const patterns = (data ?? []) as ReflectionPatternRow[];
  const linkedEvents = await loadLinkedEvents(patterns.map((pattern) => pattern.id));

  if (!linkedEvents.ok) {
    return linkedEvents;
  }

  return {
    ok: true,
    data: patterns.map((pattern) =>
      mapReflectionPattern(pattern, linkedEvents.data.get(pattern.id) ?? []),
    ),
  };
}

async function loadLinkedEvents(
  patternIds: string[],
): Promise<ActionResult<Map<string, Array<{ id: string; title: string }>>>> {
  const linkedEvents = new Map<string, Array<{ id: string; title: string }>>();

  if (patternIds.length === 0) {
    return { ok: true, data: linkedEvents };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reflection_pattern_timeline_events")
    .select("pattern_id,timeline_event_id,timeline_events(id,title)")
    .in("pattern_id", patternIds);

  if (error) {
    return {
      ok: false,
      error: {
        code: ErrorCodes.reflectionPatternSaveFailed,
        message: "Pattern support links could not load yet.",
      },
    };
  }

  for (const row of (data ?? []) as ReflectionPatternLinkRow[]) {
    const relation = Array.isArray(row.timeline_events)
      ? row.timeline_events[0]
      : row.timeline_events;
    const list = linkedEvents.get(row.pattern_id) ?? [];

    if (relation) {
      list.push({ id: relation.id, title: relation.title });
      linkedEvents.set(row.pattern_id, list);
    }
  }

  return { ok: true, data: linkedEvents };
}

function mapReflectionPattern(
  row: ReflectionPatternRow,
  linkedEvents: Array<{ id: string; title: string }>,
): ReflectionPatternSummary {
  return {
    id: row.id,
    reviewSessionId: row.review_session_id,
    periodStartedOn: row.period_started_on,
    periodEndedOn: row.period_ended_on,
    title: row.title,
    description: row.description,
    authorState: row.author_state,
    status: row.status,
    linkedEvents,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
