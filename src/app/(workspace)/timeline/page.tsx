import { WorkspacePlaceholder } from "@/components/layout/workspace-placeholder";
import { requireWorkspaceUser } from "@/features/auth/require-workspace-user";
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

  return (
    <WorkspacePlaceholder
      title="Timeline"
      description="Your private life timeline will appear here once timeline events are added."
    />
  );
}
