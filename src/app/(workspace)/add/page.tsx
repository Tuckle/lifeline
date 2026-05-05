import { requireWorkspaceUser } from "@/features/auth/require-workspace-user";
import { MemoryCreationForm } from "@/features/timeline/components/memory-creation-form";
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

  return <MemoryCreationForm />;
}
