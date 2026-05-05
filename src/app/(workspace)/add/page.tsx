import { WorkspacePlaceholder } from "@/components/layout/workspace-placeholder";
import { requireWorkspaceUser } from "@/features/auth/require-workspace-user";
import { Suspense } from "react";

export default function AddPage() {
  return (
    <Suspense fallback={null}>
      <AddContent />
    </Suspense>
  );
}

async function AddContent() {
  await requireWorkspaceUser("/add");

  return (
    <WorkspacePlaceholder
      title="Add memory"
      description="The first memory creation flow will live here in the timeline stories."
    />
  );
}
