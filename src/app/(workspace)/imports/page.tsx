import { WorkspacePlaceholder } from "@/components/layout/workspace-placeholder";
import { requireWorkspaceUser } from "@/features/auth/require-workspace-user";
import { Suspense } from "react";

export default function ImportsPage() {
  return (
    <Suspense fallback={null}>
      <ImportsContent />
    </Suspense>
  );
}

async function ImportsContent() {
  await requireWorkspaceUser("/imports");

  return (
    <WorkspacePlaceholder
      title="Imports"
      description="Staged RescueTime and notes context will be reviewed here once import stories add data."
    />
  );
}
