import { requireWorkspaceUser } from "@/features/auth/require-workspace-user";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LifeLineTimeline } from "@/features/timeline/components/life-line-timeline";
import { listTimelineEvents } from "@/features/timeline/queries/list-timeline-events";
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

  return (
    <LifeLineTimeline
      events={result.data.events}
      reachedInitialLimit={result.data.reachedInitialLimit}
    />
  );
}
