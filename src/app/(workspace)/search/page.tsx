import Link from "next/link";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { requireWorkspaceUser } from "@/features/auth/require-workspace-user";
import type { ReflectionPatternSummary } from "@/features/reviews/queries/get-reflection-patterns";
import type { ReviewSessionSummary } from "@/features/reviews/queries/get-reflection-session";
import { LifeLineTimeline } from "@/features/timeline/components/life-line-timeline";
import { TimelineSearchPanel } from "@/features/timeline/components/timeline-search-panel";
import {
  hasActiveTimelineSearchFilters,
  parseTimelineSearchParams,
  searchTimeline,
} from "@/features/timeline/queries/search-timeline";
import { Suspense } from "react";

type SearchPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchContent searchParamsPromise={searchParams} />
    </Suspense>
  );
}

async function SearchContent({
  searchParamsPromise,
}: {
  searchParamsPromise: SearchPageProps["searchParams"];
}) {
  await requireWorkspaceUser("/search");
  const searchParams = await searchParamsPromise;
  const filters = parseTimelineSearchParams(searchParams);
  const hasActiveFilters = hasActiveTimelineSearchFilters(filters);
  const result = await searchTimeline(filters);

  if (!result.ok) {
    return (
      <div className="grid gap-5">
        <TimelineSearchPanel
          activeFilterCount={getActiveFilterCount(filters)}
          filters={filters}
        />
        <Alert variant="destructive">
          <AlertTitle>Search could not load</AlertTitle>
          <AlertDescription>{result.error.message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const totalResults =
    result.data.events.length +
    result.data.futureIntentions.length +
    result.data.reviewSessions.length +
    result.data.patterns.length;

  return (
    <div className="grid gap-5">
      <TimelineSearchPanel
        activeFilterCount={getActiveFilterCount(filters)}
        filters={filters}
      />

      <ReflectionSearchResults reviewSessions={result.data.reviewSessions} />
      <PatternSearchResults patterns={result.data.patterns} />

      <LifeLineTimeline
        description={
          hasActiveFilters
            ? `${totalResults} private result${totalResults === 1 ? "" : "s"} found across memories and future intentions.`
            : "Showing your searchable timeline context. Add a term or filter above to narrow the line."
        }
        emptyState={<EmptySearchResults hasActiveFilters={hasActiveFilters} />}
        events={result.data.events}
        eyebrow="Search results"
        futureIntentions={result.data.futureIntentions}
        heading={hasActiveFilters ? "Matching life-line items" : "Searchable timeline"}
        limitMessage="Search scanned the MVP result limit. Narrow the query or add dates if you need a smaller view."
        reachedInitialLimit={result.data.reachedSearchLimit}
        showAddAction={false}
      />
    </div>
  );
}

function PatternSearchResults({
  patterns,
}: {
  patterns: ReflectionPatternSummary[];
}) {
  if (patterns.length === 0) {
    return null;
  }

  return (
    <section className="rounded-md border border-border bg-card p-5 text-card-foreground shadow-soft">
      <p className="text-sm font-medium text-muted-foreground">
        Pattern results
      </p>
      <h2 className="mt-2 text-section-title font-semibold text-foreground">
        User-authored insights
      </h2>
      <ul className="mt-4 grid gap-3">
        {patterns.map((pattern) => (
          <li className="rounded-md border border-border bg-background p-4" key={pattern.id}>
            <p className="text-sm font-semibold text-foreground">
              {pattern.title} · {pattern.authorState === "user_authored" ? "User-authored" : "User-confirmed"}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {pattern.description || "Saved without extra notes."}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ReflectionSearchResults({
  reviewSessions,
}: {
  reviewSessions: ReviewSessionSummary[];
}) {
  if (reviewSessions.length === 0) {
    return null;
  }

  return (
    <section className="rounded-md border border-border bg-card p-5 text-card-foreground shadow-soft">
      <p className="text-sm font-medium text-muted-foreground">
        Reflection results
      </p>
      <h2 className="mt-2 text-section-title font-semibold text-foreground">
        Saved reflections
      </h2>
      <ul className="mt-4 grid gap-3">
        {reviewSessions.map((session) => (
          <li className="rounded-md border border-border bg-background p-4" key={session.id}>
            <p className="text-sm font-semibold text-foreground">
              {session.periodStartedOn ?? "Open start"} to{" "}
              {session.periodEndedOn ?? "open end"} · {session.status}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {session.summaryText || "Saved reflection without text yet."}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SearchLoading() {
  const filters = parseTimelineSearchParams({});

  return (
    <div className="grid gap-5">
      <TimelineSearchPanel activeFilterCount={0} filters={filters} />
      <section className="rounded-md border border-border bg-card p-5 shadow-soft">
        <p className="text-sm font-medium text-muted-foreground">
          Searching private timeline...
        </p>
        <div className="mt-4 grid gap-3">
          <div className="h-16 rounded-md bg-muted" />
          <div className="h-24 rounded-md bg-muted" />
          <div className="h-16 rounded-md bg-muted" />
        </div>
      </section>
    </div>
  );
}

function EmptySearchResults({ hasActiveFilters }: { hasActiveFilters: boolean }) {
  return (
    <section className="rounded-md border border-dashed border-border bg-card p-6 text-card-foreground shadow-soft">
      <p className="text-sm font-medium text-muted-foreground">
        Search results
      </p>
      <h1 className="mt-2 text-page-title font-semibold text-foreground">
        {hasActiveFilters ? "No matching items yet" : "Your searchable line is quiet"}
      </h1>
      <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
        {hasActiveFilters
          ? "Try a broader term, widen the date range, or clear one filter to see more of the line."
          : "Add a memory or future intention, then return here to search across your private timeline."}
      </p>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <Button asChild className="w-full sm:w-fit" variant="outline">
          <Link href="/search">Clear filters</Link>
        </Button>
        <Button asChild className="w-full sm:w-fit">
          <Link href="/add">Add to the line</Link>
        </Button>
      </div>
    </section>
  );
}

function getActiveFilterCount(filters: ReturnType<typeof parseTimelineSearchParams>) {
  return [
    filters.query,
    filters.fromDate,
    filters.toDate,
    filters.importance !== "all" ? filters.importance : "",
    filters.source,
    filters.itemType !== "all" ? filters.itemType : "",
  ].filter(Boolean).length;
}
