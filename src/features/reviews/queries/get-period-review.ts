import type { ActionResult } from "@/lib/action-result";
import {
  searchTimeline,
  type TimelineSearchFilters,
} from "@/features/timeline/queries/search-timeline";
import type {
  FutureIntentionSummary,
  TimelineEventSummary,
} from "@/features/timeline/types";

type RawSearchParams = Record<string, string | string[] | undefined>;

export type PeriodReviewSelection = {
  fromDate: string;
  toDate: string;
};

export type PeriodReviewResult = {
  events: TimelineEventSummary[];
  futureIntentions: FutureIntentionSummary[];
  periodLabel: string;
  priorityEvents: TimelineEventSummary[];
  supportingEvents: TimelineEventSummary[];
  reachedSearchLimit: boolean;
};

export function parsePeriodReviewParams(
  searchParams: RawSearchParams,
): PeriodReviewSelection {
  const firstDate = getDateParam(readParam(searchParams, "from"));
  const secondDate = getDateParam(readParam(searchParams, "to"));

  if (firstDate && secondDate && firstDate > secondDate) {
    return {
      fromDate: secondDate,
      toDate: firstDate,
    };
  }

  return {
    fromDate: firstDate,
    toDate: secondDate,
  };
}

export function hasSelectedPeriod(selection: PeriodReviewSelection) {
  return selection.fromDate.length > 0 || selection.toDate.length > 0;
}

export async function getPeriodReview(
  selection: PeriodReviewSelection,
): Promise<ActionResult<PeriodReviewResult>> {
  const filters: TimelineSearchFilters = {
    query: "",
    fromDate: selection.fromDate,
    toDate: selection.toDate,
    importance: "all",
    source: "",
    itemType: "all",
  };
  const result = await searchTimeline(filters);

  if (!result.ok) {
    return result;
  }

  const priorityEvents = result.data.events.filter((event) =>
    ["high", "defining"].includes(event.importance),
  );
  const supportingEvents = result.data.events.filter(
    (event) => !["high", "defining"].includes(event.importance),
  );

  return {
    ok: true,
    data: {
      events: result.data.events,
      futureIntentions: result.data.futureIntentions,
      periodLabel: getPeriodLabel(selection),
      priorityEvents,
      supportingEvents,
      reachedSearchLimit: result.data.reachedSearchLimit,
    },
  };
}

export function getPeriodLabel(selection: PeriodReviewSelection) {
  if (selection.fromDate && selection.toDate) {
    return `${selection.fromDate} to ${selection.toDate}`;
  }

  if (selection.fromDate) {
    return `From ${selection.fromDate}`;
  }

  if (selection.toDate) {
    return `Until ${selection.toDate}`;
  }

  return "Choose a period";
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
