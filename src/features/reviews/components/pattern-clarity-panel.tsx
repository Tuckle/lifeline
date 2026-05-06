"use client";

import Link from "next/link";
import { useActionState } from "react";
import { CheckCircle2, EyeOff, Lightbulb, Save } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  dismissReflectionPatternAction,
  saveReflectionPatternAction,
} from "@/features/reviews/actions/save-reflection-pattern";
import type { ReflectionPatternFormValues } from "@/features/reviews/schemas/reflection-pattern-form";
import type { PeriodReviewSelection } from "@/features/reviews/queries/get-period-review";
import type { ReflectionPatternSummary } from "@/features/reviews/queries/get-reflection-patterns";
import type { TimelineEventSummary } from "@/features/timeline/types";

type PatternClarityPanelProps = {
  events: TimelineEventSummary[];
  patterns: ReflectionPatternSummary[];
  reviewSessionId?: string | null;
  selection: PeriodReviewSelection;
};

export function PatternClarityPanel({
  events,
  patterns,
  reviewSessionId,
  selection,
}: PatternClarityPanelProps) {
  const [createState, createAction, isCreating] = useActionState(
    saveReflectionPatternAction,
    getInitialPatternState({
      fromDate: selection.fromDate,
      toDate: selection.toDate,
      reviewSessionId: reviewSessionId ?? "",
    }),
  );

  return (
    <section
      aria-labelledby="pattern-clarity-heading"
      className="rounded-md border border-reflection/30 bg-card p-5 text-card-foreground shadow-soft"
    >
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">Pattern clarity</Badge>
        <Badge variant="outline">User-authored</Badge>
      </div>
      <h2
        className="mt-3 text-section-title font-semibold text-foreground"
        id="pattern-clarity-heading"
      >
        Name what you notice
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        A possible pattern is only a prompt. Saved patterns are your authored
        interpretation, not a diagnosis or system conclusion.
      </p>

      <details className="mt-4 rounded-md border border-dashed border-reflection/40 bg-reflection/10 p-3">
        <summary className="flex min-h-11 cursor-pointer items-center gap-2 text-sm font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background">
          <Lightbulb aria-hidden="true" className="size-4" />
          Possible pattern prompt
        </summary>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          You might ask: what repeated, turned, or became clearer in this
          period? You can ignore this prompt without doing anything.
        </p>
      </details>

      <form action={createAction} className="mt-5 grid gap-4">
        <PatternHiddenFields
          patternId={createState.values.id}
          reviewSessionId={reviewSessionId}
          selection={selection}
        />
        <div className="grid gap-2">
          <Label htmlFor="new-pattern-title">Insight or pattern name</Label>
          <Input
            defaultValue={createState.values.title}
            id="new-pattern-title"
            name="title"
            placeholder="Example: I kept choosing deep work after quiet weeks"
          />
          {createState.fieldErrors.title ? (
            <p className="text-sm text-destructive" role="alert">
              {createState.fieldErrors.title}
            </p>
          ) : null}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="new-pattern-description">What supports it?</Label>
          <Textarea
            defaultValue={createState.values.description}
            id="new-pattern-description"
            name="description"
            placeholder="Use your own words. Lifeline will not interpret this for you."
          />
        </div>
        <SupportingEventCheckboxes
          selectedIds={createState.values.linkedTimelineEventIds}
          events={events}
        />
        <Button className="w-full sm:w-fit" disabled={isCreating} type="submit">
          <Save aria-hidden="true" className="size-4" />
          Save pattern
        </Button>
        <PatternResultAlert result={createState.result} />
      </form>

      <div className="mt-6 grid gap-3">
        {patterns.length > 0 ? (
          patterns.map((pattern) => (
            <PatternCard
              events={events}
              key={pattern.id}
              pattern={pattern}
              reviewSessionId={reviewSessionId}
              selection={selection}
            />
          ))
        ) : (
          <p className="rounded-md border border-dashed border-border bg-background p-3 text-sm text-muted-foreground">
            No saved patterns for this period yet. You can leave it that way.
          </p>
        )}
      </div>
    </section>
  );
}

function PatternCard({
  events,
  pattern,
  reviewSessionId,
  selection,
}: {
  events: TimelineEventSummary[];
  pattern: ReflectionPatternSummary;
  reviewSessionId?: string | null;
  selection: PeriodReviewSelection;
}) {
  const [editState, editAction, isEditing] = useActionState(
    saveReflectionPatternAction,
    getInitialPatternState({
      id: pattern.id,
      reviewSessionId: pattern.reviewSessionId ?? reviewSessionId ?? "",
      fromDate: selection.fromDate,
      toDate: selection.toDate,
      title: pattern.title,
      description: pattern.description,
      linkedTimelineEventIds: pattern.linkedEvents.map((event) => event.id),
    }),
  );
  const [dismissState, dismissAction, isDismissing] = useActionState(
    dismissReflectionPatternAction,
    getInitialPatternState({
      id: pattern.id,
      reviewSessionId: pattern.reviewSessionId ?? reviewSessionId ?? "",
      fromDate: selection.fromDate,
      toDate: selection.toDate,
      title: pattern.title,
      description: pattern.description,
      linkedTimelineEventIds: pattern.linkedEvents.map((event) => event.id),
    }),
  );

  return (
    <article className="rounded-md border border-border bg-background p-4">
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline">User-authored insight</Badge>
        <Badge variant="outline">Not a diagnosis</Badge>
      </div>
      <h3 className="mt-3 text-base font-semibold text-foreground">
        {pattern.title}
      </h3>
      {pattern.description ? (
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {pattern.description}
        </p>
      ) : null}
      {pattern.linkedEvents.length > 0 ? (
        <div className="mt-3">
          <p className="text-sm font-medium text-foreground">
            Supporting memories
          </p>
          <ul className="mt-2 grid gap-1 text-sm text-muted-foreground">
            {pattern.linkedEvents.map((event) => (
              <li key={event.id}>
                <Link
                  className="text-primary underline-offset-4 hover:underline"
                  href={`/timeline#memory-${event.id}`}
                >
                  {event.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <details className="mt-4 rounded-md border border-border bg-card">
        <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-3 px-3 py-2 text-sm font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background">
          Edit or dismiss pattern
          <span className="text-muted-foreground">+</span>
        </summary>
        <div className="grid gap-4 p-3">
          <form action={editAction} className="grid gap-3">
            <PatternHiddenFields
              patternId={pattern.id}
              reviewSessionId={pattern.reviewSessionId ?? reviewSessionId}
              selection={selection}
            />
            <div className="grid gap-2">
              <Label htmlFor={`pattern-title-${pattern.id}`}>Pattern name</Label>
              <Input
                defaultValue={editState.values.title}
                id={`pattern-title-${pattern.id}`}
                name="title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`pattern-description-${pattern.id}`}>
                Your interpretation
              </Label>
              <Textarea
                defaultValue={editState.values.description}
                id={`pattern-description-${pattern.id}`}
                name="description"
              />
            </div>
            <SupportingEventCheckboxes
              selectedIds={editState.values.linkedTimelineEventIds}
              events={events}
            />
            <Button disabled={isEditing} type="submit">
              <CheckCircle2 aria-hidden="true" className="size-4" />
              Save changes
            </Button>
            <PatternResultAlert result={editState.result} />
          </form>

          <form action={dismissAction}>
            <PatternHiddenFields
              patternId={pattern.id}
              reviewSessionId={pattern.reviewSessionId ?? reviewSessionId}
              selection={selection}
            />
            <input name="title" type="hidden" value={pattern.title} />
            <input name="description" type="hidden" value={pattern.description} />
            {pattern.linkedEvents.map((event) => (
              <input
                key={event.id}
                name="linkedTimelineEventIds"
                type="hidden"
                value={event.id}
              />
            ))}
            <Button disabled={isDismissing} type="submit" variant="outline">
              <EyeOff aria-hidden="true" className="size-4" />
              Dismiss pattern
            </Button>
            <PatternResultAlert result={dismissState.result} />
          </form>
        </div>
      </details>
    </article>
  );
}

function getInitialPatternState(values?: Partial<ReflectionPatternFormValues>) {
  return {
    values: {
      id: values?.id ?? "",
      reviewSessionId: values?.reviewSessionId ?? "",
      fromDate: values?.fromDate ?? "",
      toDate: values?.toDate ?? "",
      title: values?.title ?? "",
      description: values?.description ?? "",
      linkedTimelineEventIds: values?.linkedTimelineEventIds ?? [],
    },
    fieldErrors: {},
  };
}

function PatternHiddenFields({
  patternId,
  reviewSessionId,
  selection,
}: {
  patternId?: string;
  reviewSessionId?: string | null;
  selection: PeriodReviewSelection;
}) {
  return (
    <>
      <input name="id" type="hidden" value={patternId ?? ""} />
      <input name="reviewSessionId" type="hidden" value={reviewSessionId ?? ""} />
      <input name="fromDate" type="hidden" value={selection.fromDate} />
      <input name="toDate" type="hidden" value={selection.toDate} />
    </>
  );
}

function SupportingEventCheckboxes({
  events,
  selectedIds,
}: {
  events: TimelineEventSummary[];
  selectedIds: string[];
}) {
  if (events.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-border bg-background p-3 text-sm text-muted-foreground">
        Add memories to this period when you want supporting context.
      </p>
    );
  }

  return (
    <fieldset className="grid gap-2">
      <legend className="text-sm font-medium text-foreground">
        Supporting memories
      </legend>
      <div className="grid gap-2">
        {events.map((event) => (
          <label
            className="flex min-h-11 items-start gap-3 rounded-md border border-border bg-card px-3 py-2 text-sm"
            key={event.id}
          >
            <input
              className="mt-1 size-4 accent-primary"
              defaultChecked={selectedIds.includes(event.id)}
              name="linkedTimelineEventIds"
              type="checkbox"
              value={event.id}
            />
            <span>
              <span className="font-medium text-foreground">{event.title}</span>
              <span className="block text-muted-foreground">
                {event.approximateDateLabel ?? event.occurredOn ?? "Date unknown"}
              </span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function PatternResultAlert({
  result,
}: {
  result?: { ok: true; data: { id: string } } | { ok: false; error: { message: string } };
}) {
  if (!result) {
    return null;
  }

  if (!result.ok) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Pattern not synced</AlertTitle>
        <AlertDescription>{result.error.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert>
      <AlertTitle>Pattern synced</AlertTitle>
      <AlertDescription>
        Your authored insight is saved with this period.
      </AlertDescription>
    </Alert>
  );
}
