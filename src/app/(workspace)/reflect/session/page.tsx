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
import { FutureIntentionForm } from "@/features/timeline/components/future-intention-form";
import { listFutureIntentionLinkOptions } from "@/features/timeline/queries/list-timeline-events";

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

  const [result, reviewResult, patternsResult, linkOptionsResult] = await Promise.all([
    getReflectionSessionForPeriod(selection),
    getPeriodReview(selection),
    listReflectionPatternsForPeriod(selection),
    listFutureIntentionLinkOptions(),
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
  const linkOptions = linkOptionsResult.ok ? linkOptionsResult.data : [];
  const completedReflectionLink =
    result.data?.status === "completed"
      ? {
          type: "reflection" as const,
          id: result.data.id,
          title: result.data.summaryText || "Completed reflection",
          href: `/reflect?from=${selection.fromDate}&to=${selection.toDate}`,
        }
      : null;

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
      {completedReflectionLink ? (
        <FutureIntentionForm
          initialLink={completedReflectionLink}
          linkOptions={[completedReflectionLink, ...linkOptions]}
        />
      ) : null}
    </div>
  );
}
