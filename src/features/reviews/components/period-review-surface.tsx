import Link from "next/link";
import { ArrowLeft, CalendarPlus, PenLine } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LifeLineTimeline } from "@/features/timeline/components/life-line-timeline";
import { formatImportanceLabel } from "@/features/timeline/components/importance-control";
import type {
  PeriodReviewResult,
  PeriodReviewSelection,
} from "@/features/reviews/queries/get-period-review";
import type { ReviewSessionSummary } from "@/features/reviews/queries/get-reflection-session";

type PeriodReviewSurfaceProps = {
  review: PeriodReviewResult;
  reviewSessions: ReviewSessionSummary[];
  selection: PeriodReviewSelection;
};

export function PeriodReviewSurface({
  review,
  reviewSessions,
  selection,
}: PeriodReviewSurfaceProps) {
  const totalItems = review.events.length + review.futureIntentions.length;

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)] xl:items-start">
      <aside className="grid gap-5 xl:sticky xl:top-5">
        <section
          aria-labelledby="period-review-summary-heading"
          className="rounded-md border border-border bg-card p-5 text-card-foreground shadow-soft"
        >
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Selected period</Badge>
            <Badge variant="outline">{review.periodLabel}</Badge>
          </div>
          <h2
            className="mt-4 text-section-title font-semibold text-foreground"
            id="period-review-summary-heading"
          >
            What is in this period
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Lifeline is showing saved memories and intentions in this range.
            You decide what they mean; this summary does not diagnose patterns.
          </p>

          <dl className="mt-5 grid grid-cols-2 gap-3">
            <Metric label="Memories" value={review.events.length} />
            <Metric label="Intentions" value={review.futureIntentions.length} />
            <Metric label="Priority memories" value={review.priorityEvents.length} />
            <Metric label="Total items" value={totalItems} />
          </dl>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row xl:flex-col 2xl:flex-row">
            <Button asChild variant="outline">
              <Link href="/timeline">
                <ArrowLeft aria-hidden="true" className="size-4" />
                Return to timeline
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/reflect/session?from=${selection.fromDate}&to=${selection.toDate}`}>
                <PenLine aria-hidden="true" className="size-4" />
                Start reflection
              </Link>
            </Button>
          </div>
        </section>

        <section className="rounded-md border border-border bg-card p-5 text-card-foreground shadow-soft">
          <p className="text-sm font-medium text-muted-foreground">
            Saved reflections
          </p>
          <h2 className="mt-2 text-section-title font-semibold text-foreground">
            Notes from this period
          </h2>
          {reviewSessions.length > 0 ? (
            <ul className="mt-4 grid gap-3">
              {reviewSessions.map((session) => (
                <li
                  className="rounded-md border border-border bg-background p-3"
                  key={session.id}
                >
                  <p className="text-sm font-semibold text-foreground">
                    {session.status === "completed"
                      ? "Completed reflection"
                      : "Reflection draft"}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {session.summaryText || "Draft saved without text yet."}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 rounded-md border border-dashed border-border bg-background p-3 text-sm text-muted-foreground">
              No reflection has been saved for this period yet.
            </p>
          )}
        </section>

        <section className="rounded-md border border-border bg-card p-5 text-card-foreground shadow-soft">
          <p className="text-sm font-medium text-muted-foreground">
            Priority memories
          </p>
          <h2 className="mt-2 text-section-title font-semibold text-foreground">
            Strong signals first
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            High and defining memories are surfaced first, while lighter context
            stays visible on the line.
          </p>
          {review.priorityEvents.length > 0 ? (
            <ul className="mt-4 grid gap-3">
              {review.priorityEvents.map((event) => (
                <li
                  className="rounded-md border border-reflection/30 bg-reflection/10 p-3"
                  key={event.id}
                >
                  <p className="text-sm font-semibold text-foreground">
                    {event.title}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {event.approximateDateLabel ?? event.occurredOn ?? "Date unknown"} ·{" "}
                    {formatImportanceLabel(event.importance)} · {event.sourceLabel}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 rounded-md border border-dashed border-border bg-background p-3 text-sm text-muted-foreground">
              No high-priority memories are marked in this period yet. The
              supporting context is still available on the line.
            </p>
          )}
        </section>
      </aside>

      <LifeLineTimeline
        description={`Reviewing ${review.periodLabel}. Lower-importance memories remain visible so the period stays coherent.`}
        emptyState={<EmptyPeriodReview />}
        events={review.events}
        eyebrow="Period context"
        futureIntentions={review.futureIntentions}
        heading="Selected life period"
        limitMessage="This review reached the MVP scan limit. Narrow the period if you want a smaller view."
        reachedInitialLimit={review.reachedSearchLimit}
        showAddAction={false}
      />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-border bg-background p-3">
      <dt className="text-xs font-medium uppercase text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 text-2xl font-semibold text-foreground">{value}</dd>
    </div>
  );
}

function EmptyPeriodReview() {
  return (
    <section className="rounded-md border border-dashed border-border bg-card p-6 text-card-foreground shadow-soft">
      <p className="text-sm font-medium text-muted-foreground">
        Period context
      </p>
      <h2 className="mt-2 text-page-title font-semibold text-foreground">
        Nothing is on this part of the line yet
      </h2>
      <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
        You can widen the dates, choose a different period, or add a memory if
        something belongs here.
      </p>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <Button asChild className="w-full sm:w-fit" variant="outline">
          <Link href="/reflect">Adjust period</Link>
        </Button>
        <Button asChild className="w-full sm:w-fit">
          <Link href="/add">
            <CalendarPlus aria-hidden="true" className="size-4" />
            Add memory
          </Link>
        </Button>
      </div>
    </section>
  );
}
