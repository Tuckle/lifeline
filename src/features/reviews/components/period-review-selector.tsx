import Link from "next/link";
import { ArrowLeft, CalendarRange } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PeriodReviewSelection } from "@/features/reviews/queries/get-period-review";

type PeriodReviewSelectorProps = {
  selection: PeriodReviewSelection;
  title?: string;
  description?: string;
  showTimelineReturn?: boolean;
};

export function PeriodReviewSelector({
  selection,
  title = "Choose a life period",
  description = "Pick a date range to review memories and future intentions in context. Reflection drafting comes next, after you have the period in view.",
  showTimelineReturn = false,
}: PeriodReviewSelectorProps) {
  return (
    <section
      aria-labelledby="period-review-selector-heading"
      className="rounded-md border border-border bg-card p-4 text-card-foreground shadow-soft sm:p-5"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Period review
          </p>
          <h1
            className="text-page-title font-semibold text-foreground"
            id="period-review-selector-heading"
          >
            {title}
          </h1>
          <p className="mt-2 max-w-2xl leading-7 text-muted-foreground">
            {description}
          </p>
        </div>
        {showTimelineReturn ? (
          <Button asChild className="w-full sm:w-fit" variant="outline">
            <Link href="/timeline">
              <ArrowLeft aria-hidden="true" className="size-4" />
              Return to timeline
            </Link>
          </Button>
        ) : null}
      </div>

      <form action="/reflect" className="mt-5 grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
        <div className="grid gap-2">
          <Label htmlFor="period-review-from">From</Label>
          <Input
            defaultValue={selection.fromDate}
            id="period-review-from"
            name="from"
            type="date"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="period-review-to">To</Label>
          <Input
            defaultValue={selection.toDate}
            id="period-review-to"
            name="to"
            type="date"
          />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row md:flex-col xl:flex-row">
          <Button className="w-full md:w-fit" type="submit">
            <CalendarRange aria-hidden="true" className="size-4" />
            Review period
          </Button>
          <Button asChild className="w-full md:w-fit" variant="outline">
            <Link href="/reflect">Clear period</Link>
          </Button>
        </div>
      </form>
    </section>
  );
}
