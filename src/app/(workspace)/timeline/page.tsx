import { requireWorkspaceUser } from "@/features/auth/require-workspace-user";
import { EmptyMemoryAtlasTimeline } from "@/features/timeline/components/empty-memory-atlas-timeline";
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

  return <EmptyMemoryAtlasTimeline />;
}
