"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ArrowLeft, Check, Pause, Save } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveReflectionSessionAction } from "@/features/reviews/actions/save-reflection-session";
import type { PeriodReviewSelection } from "@/features/reviews/queries/get-period-review";
import type { ReviewSessionSummary } from "@/features/reviews/queries/get-reflection-session";

type ReflectionSessionFormProps = {
  selection: PeriodReviewSelection;
  periodLabel: string;
  existingSession: ReviewSessionSummary | null;
};

export function ReflectionSessionForm({
  selection,
  periodLabel,
  existingSession,
}: ReflectionSessionFormProps) {
  const [state, formAction, isPending] = useActionState(
    saveReflectionSessionAction,
    {
      values: {
        id: existingSession?.id ?? "",
        fromDate: selection.fromDate,
        toDate: selection.toDate,
        summaryText: existingSession?.summaryText ?? "",
        status:
          (existingSession?.status as "draft" | "paused" | "completed") ??
          "draft",
      },
      fieldErrors: {},
    },
  );
  const reviewHref = `/reflect?from=${selection.fromDate}&to=${selection.toDate}`;

  return (
    <section
      aria-labelledby="reflection-session-heading"
      className="rounded-md border border-border bg-card p-5 text-card-foreground shadow-soft sm:p-6"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Reflection session
          </p>
          <h1
            className="text-page-title font-semibold text-foreground"
            id="reflection-session-heading"
          >
            Write about {periodLabel}
          </h1>
          <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
            Use the prompts if they help. You can save a draft, pause, complete
            a summary, or leave without being locked into a conclusion.
          </p>
        </div>
        <Button asChild className="w-full sm:w-fit" variant="outline">
          <Link href={reviewHref}>
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to period
          </Link>
        </Button>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <aside className="rounded-md border border-reflection/30 bg-reflection/10 p-4">
          <h2 className="text-section-title font-semibold text-foreground">
            Optional prompts
          </h2>
          <ul className="mt-3 grid gap-3 text-sm leading-6 text-muted-foreground">
            <li>What happened during this period?</li>
            <li>What repeated, changed, or surprised you?</li>
            <li>What do you want to carry forward?</li>
          </ul>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Lifeline stores your words as your reflection. It does not decide
            what this period means for you.
          </p>
        </aside>

        <form action={formAction} className="grid gap-4">
          <input name="id" type="hidden" value={state.values.id ?? ""} />
          <input name="fromDate" type="hidden" value={selection.fromDate} />
          <input name="toDate" type="hidden" value={selection.toDate} />

          <div className="grid gap-2">
            <Label htmlFor="reflection-summary">Reflection draft</Label>
            <Textarea
              aria-describedby="reflection-sync-state"
              defaultValue={state.values.summaryText}
              id="reflection-summary"
              name="summaryText"
              placeholder="Write what you notice. A few honest lines are enough."
            />
            {state.fieldErrors.summaryText ? (
              <p className="text-sm text-destructive" role="alert">
                {state.fieldErrors.summaryText}
              </p>
            ) : null}
          </div>

          <p
            className="rounded-md border border-border bg-background p-3 text-sm text-muted-foreground"
            id="reflection-sync-state"
          >
            {state.result?.ok
              ? `Synced as ${state.result.data.status}.`
              : "Local draft is in this editor until you save, pause, or complete it."}
          </p>

          {state.result && !state.result.ok ? (
            <Alert variant="destructive">
              <AlertTitle>Reflection not synced</AlertTitle>
              <AlertDescription>{state.result.error.message}</AlertDescription>
            </Alert>
          ) : null}

          <div className="grid gap-2 sm:grid-cols-3">
            <Button disabled={isPending} name="status" type="submit" value="draft">
              <Save aria-hidden="true" className="size-4" />
              Save draft
            </Button>
            <Button
              disabled={isPending}
              name="status"
              type="submit"
              value="paused"
              variant="outline"
            >
              <Pause aria-hidden="true" className="size-4" />
              Pause
            </Button>
            <Button disabled={isPending} name="status" type="submit" value="completed">
              <Check aria-hidden="true" className="size-4" />
              Complete
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
