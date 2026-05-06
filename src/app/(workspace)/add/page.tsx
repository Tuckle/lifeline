import { requireWorkspaceUser } from "@/features/auth/require-workspace-user";
import { FutureIntentionForm } from "@/features/timeline/components/future-intention-form";
import { MemoryCreationForm } from "@/features/timeline/components/memory-creation-form";
import { listFutureIntentionLinkOptions } from "@/features/timeline/queries/list-timeline-events";
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
  const linkOptionsResult = await listFutureIntentionLinkOptions();
  const linkOptions = linkOptionsResult.ok ? linkOptionsResult.data : [];

  return (
    <div className="grid gap-6">
      <MemoryCreationForm />
      <FutureIntentionForm linkOptions={linkOptions} />
    </div>
  );
}
