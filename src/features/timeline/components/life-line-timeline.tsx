import Link from "next/link";
import { CalendarPlus, Milestone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyMemoryAtlasTimeline } from "@/features/timeline/components/empty-memory-atlas-timeline";
import { MemoryAtlasCard } from "@/features/timeline/components/memory-atlas-card";
import type { TimelineEventSummary } from "@/features/timeline/types";

type LifeLineTimelineProps = {
  events: TimelineEventSummary[];
  reachedInitialLimit: boolean;
};

export function LifeLineTimeline({
  events,
  reachedInitialLimit,
}: LifeLineTimelineProps) {
  if (events.length === 0) {
    return <EmptyMemoryAtlasTimeline />;
  }

  return (
    <section
      aria-labelledby="timeline-heading"
      className="rounded-md border border-border bg-card p-5 text-card-foreground shadow-soft sm:p-8"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-muted-foreground">
            Memory Atlas
          </p>
          <h1
            className="text-page-title font-semibold text-foreground"
            id="timeline-heading"
          >
            Your life-line
          </h1>
          <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
            Memories sit above today for now. Future intentions will live below
            the present as you add them.
          </p>
        </div>
        <Button asChild className="w-full sm:w-fit">
          <Link href="/add">
            <CalendarPlus aria-hidden="true" className="size-4" />
            Add memory
          </Link>
        </Button>
      </div>

      <div className="relative mt-8">
        <div
          aria-hidden="true"
          className="absolute left-5 top-0 h-full w-px bg-timeline sm:left-1/2"
        />

        <ol className="relative grid gap-5">
          {events.map((event, index) => (
            <li
              className="relative grid gap-4 pl-14 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:pl-0"
              key={event.id}
            >
              <div
                aria-hidden="true"
                className="absolute left-1 top-2 flex size-8 items-center justify-center rounded-full border-4 border-background bg-memory text-memory-foreground sm:left-1/2 sm:-translate-x-1/2"
              >
                <Milestone className="size-3.5" />
              </div>
              <div
                className={
                  index % 2 === 0 ? "sm:pr-10" : "sm:col-start-2 sm:pl-10"
                }
              >
                <MemoryAtlasCard event={event} />
              </div>
            </li>
          ))}
        </ol>

        <div className="relative mt-8 grid gap-4 pl-14 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:pl-0">
          <div
            aria-hidden="true"
            className="absolute left-0 flex size-10 items-center justify-center rounded-full border-4 border-background bg-primary text-primary-foreground shadow-soft sm:left-1/2 sm:-translate-x-1/2"
          >
            <Milestone className="size-4" />
          </div>
          <div className="rounded-md border border-primary/25 bg-background p-4 sm:col-start-2 sm:ml-10">
            <p className="text-sm font-semibold text-foreground">Present</p>
            <p className="mt-1 text-sm text-muted-foreground">
              The anchor between remembered history and future intentions.
            </p>
          </div>
        </div>

        <div className="relative mt-5 pl-14 sm:grid sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:pl-0">
          <div className="rounded-md border border-dashed border-future/40 bg-future/10 p-4 sm:col-start-2 sm:ml-10">
            <p className="text-sm font-semibold text-foreground">
              Future space
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Intentions will appear here once that flow is added.
            </p>
          </div>
        </div>
      </div>

      {reachedInitialLimit ? (
        <p className="mt-6 rounded-md border border-warning/30 bg-warning/10 p-3 text-sm text-foreground">
          Showing the first set of memories. Incremental loading will expand
          this as the timeline grows.
        </p>
      ) : null}
    </section>
  );
}
