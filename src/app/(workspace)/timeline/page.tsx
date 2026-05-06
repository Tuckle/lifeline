import { requireWorkspaceUser } from "@/features/auth/require-workspace-user";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LifeLineTimeline } from "@/features/timeline/components/life-line-timeline";
import { TimelineSearchPanel } from "@/features/timeline/components/timeline-search-panel";
import { listTimelineEvents } from "@/features/timeline/queries/list-timeline-events";
import { parseTimelineSearchParams } from "@/features/timeline/queries/search-timeline";
import { Suspense } from "react";

export default function TimelinePage() {
  return (
    <Suspense fallback={null}>
      <TimelineContent />
    </Suspense>
  );
}

async function TimelineContent() {
  await requireWorkspaceUser("/timeline");
  const result = await listTimelineEvents();

  if (!result.ok) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Timeline could not load</AlertTitle>
        <AlertDescription>{result.error.message}</AlertDescription>
      </Alert>
    );
  }

  const searchFilters = parseTimelineSearchParams({});

  return (
    <div className="grid gap-5">
      <TimelineSearchPanel
        activeFilterCount={0}
        description="Start a private search or apply filters from the timeline. Results open with the life-line context preserved."
        filters={searchFilters}
        title="Find a memory or intention"
      />
      <LifeLineTimeline
        events={result.data.events}
        futureIntentions={result.data.futureIntentions}
        reachedInitialLimit={result.data.reachedInitialLimit}
      />
    </div>
  );
}
