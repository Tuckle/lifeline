import { WorkspacePlaceholder } from "@/components/layout/workspace-placeholder";
import { requireWorkspaceUser } from "@/features/auth/require-workspace-user";
import { Suspense } from "react";

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchContent />
    </Suspense>
  );
}

async function SearchContent() {
  await requireWorkspaceUser("/search");

  return (
    <WorkspacePlaceholder
      title="Search"
      description="Private timeline search and filters will appear here when timeline data exists."
    />
  );
}
