import { requireWorkspaceUser } from "@/features/auth/require-workspace-user";
import { ImportReviewSurface } from "@/features/imports/components/import-review-surface";
import { listImportReview } from "@/features/imports/queries/list-import-review";
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
  const importReview = await listImportReview();

  if (!importReview.ok) {
    return (
      <ImportReviewSurface
        hasConnectedSources={false}
        records={[]}
        sources={[]}
        timelineOptions={[]}
      />
    );
  }

  return <ImportReviewSurface {...importReview.data} />;
}
