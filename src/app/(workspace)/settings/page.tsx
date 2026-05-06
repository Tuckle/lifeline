import { WorkspacePlaceholder } from "@/components/layout/workspace-placeholder";
import { requireWorkspaceUser } from "@/features/auth/require-workspace-user";
import { ProductBoundaryNote } from "@/features/reviews/components/product-boundary-note";
import { Suspense } from "react";

export default function SettingsPage() {
  return (
    <Suspense fallback={null}>
      <SettingsContent />
    </Suspense>
  );
}

async function SettingsContent() {
  await requireWorkspaceUser("/settings");

  return (
    <div className="grid gap-5">
      <WorkspacePlaceholder
        title="Settings"
        description="Privacy, source management, export, and deletion controls will be added here in later stories."
      />
      <ProductBoundaryNote />
    </div>
  );
}
