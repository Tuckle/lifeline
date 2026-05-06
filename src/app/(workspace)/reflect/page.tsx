import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { requireWorkspaceUser } from "@/features/auth/require-workspace-user";
import { PeriodReviewSelector } from "@/features/reviews/components/period-review-selector";
import { PeriodReviewSurface } from "@/features/reviews/components/period-review-surface";
import {
  getPeriodReview,
  hasSelectedPeriod,
  parsePeriodReviewParams,
} from "@/features/reviews/queries/get-period-review";
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

  const result = await getPeriodReview(selection);

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

  return (
    <div className="grid gap-5">
      <PeriodReviewSelector selection={selection} showTimelineReturn />
      <PeriodReviewSurface review={result.data} selection={selection} />
    </div>
  );
}
