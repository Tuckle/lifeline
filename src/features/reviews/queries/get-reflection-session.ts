import type { ActionResult } from "@/lib/action-result";
import { ErrorCodes } from "@/lib/errors";
import { createClient } from "@/lib/supabase/server";
import type { PeriodReviewSelection } from "@/features/reviews/queries/get-period-review";

export type ReviewSessionSummary = {
  id: string;
  periodStartedOn: string | null;
  periodEndedOn: string | null;
  summaryText: string;
  status: string;
  createdAt: string;
  updatedAt: string;
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

export async function getReflectionSessionForPeriod(
  selection: PeriodReviewSelection,
): Promise<ActionResult<ReviewSessionSummary | null>> {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims?.sub) {
    return {
      ok: false,
      error: {
        code: ErrorCodes.permissionDenied,
        message: "Sign in again before loading this reflection.",
      },
    };
  }

  let query = supabase
    .from("review_sessions")
    .select("id,period_started_on,period_ended_on,summary_text,status,created_at,updated_at")
    .order("updated_at", { ascending: false })
    .limit(1);

  query = selection.fromDate
    ? query.eq("period_started_on", selection.fromDate)
    : query.is("period_started_on", null);
  query = selection.toDate
    ? query.eq("period_ended_on", selection.toDate)
    : query.is("period_ended_on", null);

  const { data, error } = await query.maybeSingle();

  if (error) {
    return {
      ok: false,
      error: {
        code: ErrorCodes.reflectionSessionSaveFailed,
        message: "This reflection could not load yet. Please try again.",
      },
    };
  }

  return {
    ok: true,
    data: data ? mapReviewSession(data as ReviewSessionRow) : null,
  };
}

export async function listReviewSessionsForPeriod(
  selection: PeriodReviewSelection,
): Promise<ActionResult<ReviewSessionSummary[]>> {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims?.sub) {
    return {
      ok: false,
      error: {
        code: ErrorCodes.permissionDenied,
        message: "Sign in again before loading reflections.",
      },
    };
  }

  let query = supabase
    .from("review_sessions")
    .select("id,period_started_on,period_ended_on,summary_text,status,created_at,updated_at")
    .order("updated_at", { ascending: false })
    .limit(10);

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
        code: ErrorCodes.reflectionSessionSaveFailed,
        message: "Saved reflections could not load yet.",
      },
    };
  }

  return {
    ok: true,
    data: ((data ?? []) as ReviewSessionRow[]).map(mapReviewSession),
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
