import { redirect } from "next/navigation";
import { Suspense } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { requireWorkspaceUser } from "@/features/auth/require-workspace-user";
import { ReflectionSessionForm } from "@/features/reviews/components/reflection-session-form";
import {
  getPeriodLabel,
  hasSelectedPeriod,
  parsePeriodReviewParams,
} from "@/features/reviews/queries/get-period-review";
import { getReflectionSessionForPeriod } from "@/features/reviews/queries/get-reflection-session";

type ReflectionSessionPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function ReflectionSessionPage({
  searchParams,
}: ReflectionSessionPageProps) {
  return (
    <Suspense fallback={null}>
      <ReflectionSessionContent searchParamsPromise={searchParams} />
    </Suspense>
  );
}

async function ReflectionSessionContent({
  searchParamsPromise,
}: {
  searchParamsPromise: ReflectionSessionPageProps["searchParams"];
}) {
  await requireWorkspaceUser("/reflect/session");
  const searchParams = await searchParamsPromise;
  const selection = parsePeriodReviewParams(searchParams);

  if (!hasSelectedPeriod(selection)) {
    redirect("/reflect");
  }

  const result = await getReflectionSessionForPeriod(selection);

  if (!result.ok) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Reflection could not load</AlertTitle>
        <AlertDescription>{result.error.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <ReflectionSessionForm
      existingSession={result.data}
      periodLabel={getPeriodLabel(selection)}
      selection={selection}
    />
  );
}
