import { requireWorkspaceUser } from "@/features/auth/require-workspace-user";
import { ProductBoundaryNote } from "@/features/reviews/components/product-boundary-note";
import { PrivacyDataSection } from "@/features/settings/components/privacy-data-section";
import { getPrivacyDataSummary } from "@/features/settings/queries/get-privacy-data-summary";
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
  const privacyDataSummary = await getPrivacyDataSummary();

  return (
    <div className="grid gap-5">
      <PrivacyDataSection summary={privacyDataSummary} />
      <ProductBoundaryNote />
    </div>
  );
}
