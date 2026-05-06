import Link from "next/link";
import { Search, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatImportanceLabel } from "@/features/timeline/components/importance-control";
import { importanceValues } from "@/features/timeline/schemas/timeline-event-form";
import type { TimelineSearchFilters } from "@/features/timeline/queries/search-timeline";

type TimelineSearchPanelProps = {
  filters: TimelineSearchFilters;
  activeFilterCount: number;
  action?: string;
  title?: string;
  description?: string;
};

export function TimelineSearchPanel({
  filters,
  activeFilterCount,
  action = "/search",
  title = "Search your life-line",
  description = "Find memories, dates, sources, importance levels, and future intentions without losing the shape of the timeline.",
}: TimelineSearchPanelProps) {
  return (
    <section
      aria-labelledby="timeline-search-heading"
      className="rounded-md border border-border bg-card p-4 text-card-foreground shadow-soft sm:p-5"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Private search
          </p>
          <h2
            className="text-section-title font-semibold text-foreground"
            id="timeline-search-heading"
          >
            {title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
        {activeFilterCount > 0 ? (
          <Badge variant="secondary">{activeFilterCount} active</Badge>
        ) : null}
      </div>

      <form action={action} className="mt-5 grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="timeline-search-query">Search</Label>
          <div className="relative">
            <Search
              aria-hidden="true"
              className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              className="pl-9"
              defaultValue={filters.query}
              id="timeline-search-query"
              name="q"
              placeholder="Memory title, story, date, source, or intention"
              type="search"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div className="grid gap-2">
            <Label htmlFor="timeline-search-from">From</Label>
            <Input
              defaultValue={filters.fromDate}
              id="timeline-search-from"
              name="from"
              type="date"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="timeline-search-to">To</Label>
            <Input
              defaultValue={filters.toDate}
              id="timeline-search-to"
              name="to"
              type="date"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="timeline-search-importance">Importance</Label>
            <select
              className="min-h-11 rounded-md border border-input bg-card px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              defaultValue={filters.importance}
              id="timeline-search-importance"
              name="importance"
            >
              <option value="all">Any importance</option>
              {importanceValues.map((importance) => (
                <option key={importance} value={importance}>
                  {formatImportanceLabel(importance)}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="timeline-search-source">Source</Label>
            <Input
              defaultValue={filters.source}
              id="timeline-search-source"
              name="source"
              placeholder="Manual or future"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="timeline-search-item-type">Item type</Label>
            <select
              className="min-h-11 rounded-md border border-input bg-card px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              defaultValue={filters.itemType}
              id="timeline-search-item-type"
              name="itemType"
            >
              <option value="all">Memories and intentions</option>
              <option value="memory">Memories only</option>
              <option value="reflection">Reflections only</option>
              <option value="future-intention">Future intentions only</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button className="w-full sm:w-fit" type="submit">
            <Search aria-hidden="true" className="size-4" />
            Search timeline
          </Button>
          <Button asChild className="w-full sm:w-fit" variant="outline">
            <Link href="/search">
              <X aria-hidden="true" className="size-4" />
              Clear filters
            </Link>
          </Button>
        </div>
      </form>
    </section>
  );
}
