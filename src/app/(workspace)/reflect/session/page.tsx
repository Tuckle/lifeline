import { redirect } from "next/navigation";
import { Suspense } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { requireWorkspaceUser } from "@/features/auth/require-workspace-user";
import { PatternClarityPanel } from "@/features/reviews/components/pattern-clarity-panel";
import { ReflectionSessionForm } from "@/features/reviews/components/reflection-session-form";
import {
  getPeriodReview,
  getPeriodLabel,
  hasSelectedPeriod,
  parsePeriodReviewParams,
} from "@/features/reviews/queries/get-period-review";
import { listReflectionPatternsForPeriod } from "@/features/reviews/queries/get-reflection-patterns";
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

  const [result, reviewResult, patternsResult] = await Promise.all([
    getReflectionSessionForPeriod(selection),
    getPeriodReview(selection),
    listReflectionPatternsForPeriod(selection),
  ]);

  if (!result.ok) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Reflection could not load</AlertTitle>
        <AlertDescription>{result.error.message}</AlertDescription>
      </Alert>
    );
  }

  if (!reviewResult.ok) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Reflection could not load</AlertTitle>
        <AlertDescription>{reviewResult.error.message}</AlertDescription>
      </Alert>
    );
  }

  if (!patternsResult.ok) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Reflection could not load</AlertTitle>
        <AlertDescription>{patternsResult.error.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid gap-5">
      <ReflectionSessionForm
        existingSession={result.data}
        periodLabel={getPeriodLabel(selection)}
        selection={selection}
      />
      <PatternClarityPanel
        events={reviewResult.data.events}
        patterns={patternsResult.data}
        reviewSessionId={result.data?.id}
        selection={selection}
      />
    </div>
  );
}
