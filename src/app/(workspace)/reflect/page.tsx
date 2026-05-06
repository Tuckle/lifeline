import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { requireWorkspaceUser } from "@/features/auth/require-workspace-user";
import { PeriodReviewSelector } from "@/features/reviews/components/period-review-selector";
import { PeriodReviewSurface } from "@/features/reviews/components/period-review-surface";
import {
  getPeriodReview,
  hasSelectedPeriod,
  parsePeriodReviewParams,
} from "@/features/reviews/queries/get-period-review";
import { listReflectionPatternsForPeriod } from "@/features/reviews/queries/get-reflection-patterns";
import { listReviewSessionsForPeriod } from "@/features/reviews/queries/get-reflection-session";
import { Suspense } from "react";

type ReflectPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function ReflectPage({ searchParams }: ReflectPageProps) {
  return (
    <Suspense fallback={null}>
      <ReflectContent searchParamsPromise={searchParams} />
    </Suspense>
  );
}

async function ReflectContent({
  searchParamsPromise,
}: {
  searchParamsPromise: ReflectPageProps["searchParams"];
}) {
  await requireWorkspaceUser("/reflect");
  const searchParams = await searchParamsPromise;
  const selection = parsePeriodReviewParams(searchParams);
  const hasPeriod = hasSelectedPeriod(selection);

  if (!hasPeriod) {
    return <PeriodReviewSelector selection={selection} showTimelineReturn />;
  }

  const [result, sessionsResult, patternsResult] = await Promise.all([
    getPeriodReview(selection),
    listReviewSessionsForPeriod(selection),
    listReflectionPatternsForPeriod(selection),
  ]);

  if (!result.ok) {
    return (
      <div className="grid gap-5">
        <PeriodReviewSelector selection={selection} showTimelineReturn />
        <Alert variant="destructive">
          <AlertTitle>Period could not load</AlertTitle>
          <AlertDescription>{result.error.message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!sessionsResult.ok) {
    return (
      <div className="grid gap-5">
        <PeriodReviewSelector selection={selection} showTimelineReturn />
        <Alert variant="destructive">
          <AlertTitle>Period could not load</AlertTitle>
          <AlertDescription>{sessionsResult.error.message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!patternsResult.ok) {
    return (
      <div className="grid gap-5">
        <PeriodReviewSelector selection={selection} showTimelineReturn />
        <Alert variant="destructive">
          <AlertTitle>Period could not load</AlertTitle>
          <AlertDescription>{patternsResult.error.message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      <PeriodReviewSelector selection={selection} showTimelineReturn />
      <PeriodReviewSurface
        patterns={patternsResult.data}
        review={result.data}
        reviewSessions={sessionsResult.data}
        selection={selection}
      />
    </div>
  );
}
