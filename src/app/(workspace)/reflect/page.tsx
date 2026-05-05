import { WorkspacePlaceholder } from "@/components/layout/workspace-placeholder";
import { requireWorkspaceUser } from "@/features/auth/require-workspace-user";
import { Suspense } from "react";

export default function ReflectPage() {
  return (
    <Suspense fallback={null}>
      <ReflectContent />
    </Suspense>
  );
}

async function ReflectContent() {
  await requireWorkspaceUser("/reflect");

  return (
    <WorkspacePlaceholder
      title="Reflect"
      description="Private review sessions and pattern clarity moments will begin here in later stories."
    />
  );
}
