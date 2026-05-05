"use client";

import {
  useActionState,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { EyeOff, Save, Trash2 } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  deleteTimelineEventAction,
  hideTimelineEventAction,
  initialManageMemoryState,
  updateTimelineEventAction,
} from "@/features/timeline/actions/manage-timeline-event";
import {
  datePrecisionValues,
  getDateLabel,
  importanceValues,
} from "@/features/timeline/schemas/timeline-event-form";
import { ImportanceControl } from "@/features/timeline/components/importance-control";
import type { TimelineEventSummary } from "@/features/timeline/types";

const datePrecisionLabels = {
  exact: "Exact date",
  month: "Month and year",
  year: "Year only",
  period: "Life period",
  unknown: "Unknown for now",
};

type MemoryDetailPanelProps = {
  event: TimelineEventSummary;
};

export function MemoryDetailPanel({ event }: MemoryDetailPanelProps) {
  const [updateState, updateAction, isUpdating] = useActionState(
    updateTimelineEventAction,
    initialManageMemoryState,
  );
  const [hideState, hideAction, isHiding] = useActionState(
    hideTimelineEventAction,
    initialManageMemoryState,
  );
  const [deleteState, deleteAction, isDeleting] = useActionState(
    deleteTimelineEventAction,
    initialManageMemoryState,
  );
  const initialValues = updateState.values ?? {
    id: event.id,
    title: event.title,
    storyText: event.storyText ?? "",
    datePrecision: event.datePrecision,
    exactDate: event.exactDate,
    monthDate: event.monthDate,
    yearDate: event.yearDate,
    periodLabel: event.periodLabel,
    importance: event.importance,
    photoReferenceUrl: event.photoReferenceUrl ?? "",
    photoAltText: event.photoAltText ?? "",
  };
  const [values, setValues] = useState(initialValues);

  const previewLabel = useMemo(
    () =>
      getDateLabel({
        ...values,
        datePrecision: datePrecisionValues.includes(
          values.datePrecision as (typeof datePrecisionValues)[number],
        )
          ? (values.datePrecision as (typeof datePrecisionValues)[number])
          : "unknown",
        importance: importanceValues.includes(
          values.importance as (typeof importanceValues)[number],
        )
          ? (values.importance as (typeof importanceValues)[number])
          : "unset",
      }),
    [values],
  );

  function updateValue(name: string, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  function confirmDelete(submitEvent: FormEvent<HTMLFormElement>) {
    const confirmed = window.confirm(
      `Delete "${event.title}"? This removes the selected timeline event from your Lifeline. You can cancel safely now.`,
    );

    if (!confirmed) {
      submitEvent.preventDefault();
    }
  }

  return (
    <div className="mt-4 border-t border-border pt-4">
      <div className="grid gap-4">
        <section aria-labelledby={`memory-detail-${event.id}`}>
          <h3
            className="text-sm font-semibold text-foreground"
            id={`memory-detail-${event.id}`}
          >
            Memory detail
          </h3>
          <dl className="mt-3 grid gap-2 text-sm text-muted-foreground">
            <div className="flex flex-wrap gap-2">
              <dt className="font-medium text-foreground">Source</dt>
              <dd>{event.sourceLabel}</dd>
            </div>
            <div className="flex flex-wrap gap-2">
              <dt className="font-medium text-foreground">Status</dt>
              <dd>{event.status}</dd>
            </div>
            <div className="flex flex-wrap gap-2">
              <dt className="font-medium text-foreground">Date</dt>
              <dd>{event.approximateDateLabel ?? event.occurredOn}</dd>
            </div>
          </dl>
          {event.storyText ? (
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-foreground">
              {event.storyText}
            </p>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              No story text yet.
            </p>
          )}
        </section>

        <form action={updateAction} className="grid gap-4">
          <input name="id" type="hidden" value={event.id} />
          <div className="grid gap-2">
            <Label htmlFor={`edit-title-${event.id}`}>Title</Label>
            <Input
              aria-invalid={Boolean(updateState.fieldErrors.title)}
              id={`edit-title-${event.id}`}
              name="title"
              onChange={(changeEvent) =>
                updateValue("title", changeEvent.target.value)
              }
              value={values.title}
            />
            {updateState.fieldErrors.title ? (
              <p className="text-sm text-destructive" role="alert">
                {updateState.fieldErrors.title}
              </p>
            ) : null}
          </div>

          <fieldset className="grid gap-3">
            <legend className="text-sm font-medium text-foreground">
              Date precision
            </legend>
            <div className="grid gap-2">
              {datePrecisionValues.map((precision) => (
                <label
                  className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md border border-border bg-background/60 px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-focus focus-within:ring-offset-2 focus-within:ring-offset-background"
                  key={precision}
                >
                  <input
                    checked={values.datePrecision === precision}
                    className="size-4 accent-primary"
                    name="datePrecision"
                    onChange={() => updateValue("datePrecision", precision)}
                    type="radio"
                    value={precision}
                  />
                  <span>{datePrecisionLabels[precision]}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <EditDateFields
            errors={updateState.fieldErrors}
            precision={values.datePrecision}
            updateValue={updateValue}
            values={values}
          />

          <div className="rounded-md border border-timeline bg-background/70 p-3 text-sm text-muted-foreground">
            Date preview:{" "}
            <span className="font-medium text-foreground">{previewLabel}</span>
          </div>

          <div className="grid gap-2">
            <Label htmlFor={`edit-story-${event.id}`}>Story notes</Label>
            <Textarea
              id={`edit-story-${event.id}`}
              name="storyText"
              onChange={(changeEvent) =>
                updateValue("storyText", changeEvent.target.value)
              }
              value={values.storyText}
            />
          </div>

          <div className="grid gap-4 rounded-md border border-border bg-background/70 p-4">
            <div>
              <h3 className="text-sm font-medium text-foreground">
                Photo reference
              </h3>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Clear the URL to remove the photo reference while keeping the
                memory.
              </p>
            </div>
            <InlineField
              error={updateState.fieldErrors.photoReferenceUrl}
              label="Photo reference URL"
            >
              <Input
                aria-invalid={Boolean(updateState.fieldErrors.photoReferenceUrl)}
                name="photoReferenceUrl"
                onChange={(changeEvent) =>
                  updateValue("photoReferenceUrl", changeEvent.target.value)
                }
                type="url"
                value={values.photoReferenceUrl}
              />
            </InlineField>
            <InlineField label="Photo description">
              <Input
                name="photoAltText"
                onChange={(changeEvent) =>
                  updateValue("photoAltText", changeEvent.target.value)
                }
                value={values.photoAltText}
              />
            </InlineField>
          </div>

          <ImportanceControl
            onChange={(importance) => updateValue("importance", importance)}
            value={values.importance}
          />

          {updateState.result ? (
            <MutationFeedback
              success="Memory updated."
              state={updateState.result}
            />
          ) : null}

          <Button disabled={isUpdating} type="submit">
            <Save aria-hidden="true" className="size-4" />
            {isUpdating ? "Saving..." : "Save changes"}
          </Button>
        </form>

        <div className="grid gap-3 rounded-md border border-border bg-background/70 p-4">
          <p className="text-sm font-medium text-foreground">
            Visibility controls
          </p>
          <p className="text-sm leading-6 text-muted-foreground">
            Hide keeps the record but removes it from normal timeline browsing.
            Delete removes this selected timeline event.
          </p>

          <div className="grid gap-2 sm:grid-cols-2">
            <form action={hideAction}>
              <input name="id" type="hidden" value={event.id} />
              <Button
                className="w-full"
                disabled={isHiding}
                type="submit"
                variant="outline"
              >
                <EyeOff aria-hidden="true" className="size-4" />
                {isHiding ? "Hiding..." : "Hide memory"}
              </Button>
            </form>

            <form action={deleteAction} onSubmit={confirmDelete}>
              <input name="id" type="hidden" value={event.id} />
              <Button
                className="w-full"
                disabled={isDeleting}
                type="submit"
                variant="destructive"
              >
                <Trash2 aria-hidden="true" className="size-4" />
                {isDeleting ? "Deleting..." : "Delete memory"}
              </Button>
            </form>
          </div>

          {hideState.result ? (
            <MutationFeedback
              success="Memory hidden from normal browsing."
              state={hideState.result}
            />
          ) : null}
          {deleteState.result ? (
            <MutationFeedback
              success="Memory deleted from your timeline."
              state={deleteState.result}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

type EditDateFieldsProps = {
  errors: Partial<Record<string, string>>;
  precision: string;
  updateValue: (name: string, value: string) => void;
  values: Record<string, string>;
};

function EditDateFields({
  errors,
  precision,
  updateValue,
  values,
}: EditDateFieldsProps) {
  if (precision === "exact") {
    return (
      <InlineField error={errors.exactDate} label="Exact date">
        <Input
          aria-invalid={Boolean(errors.exactDate)}
          name="exactDate"
          onChange={(event) => updateValue("exactDate", event.target.value)}
          type="date"
          value={values.exactDate}
        />
      </InlineField>
    );
  }

  if (precision === "month") {
    return (
      <InlineField error={errors.monthDate} label="Month and year">
        <Input
          aria-invalid={Boolean(errors.monthDate)}
          name="monthDate"
          onChange={(event) => updateValue("monthDate", event.target.value)}
          type="month"
          value={values.monthDate}
        />
      </InlineField>
    );
  }

  if (precision === "year") {
    return (
      <InlineField error={errors.yearDate} label="Year">
        <Input
          aria-invalid={Boolean(errors.yearDate)}
          inputMode="numeric"
          max="2100"
          min="1800"
          name="yearDate"
          onChange={(event) => updateValue("yearDate", event.target.value)}
          type="number"
          value={values.yearDate}
        />
      </InlineField>
    );
  }

  if (precision === "period") {
    return (
      <InlineField error={errors.periodLabel} label="Period label">
        <Input
          aria-invalid={Boolean(errors.periodLabel)}
          name="periodLabel"
          onChange={(event) => updateValue("periodLabel", event.target.value)}
          value={values.periodLabel}
        />
      </InlineField>
    );
  }

  return (
    <div className="rounded-md border border-border bg-background/70 p-3 text-sm text-muted-foreground">
      This memory can stay saved without a date.
    </div>
  );
}

type InlineFieldProps = {
  children: ReactNode;
  error?: string;
  label: string;
};

function InlineField({ children, error, label }: InlineFieldProps) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      {children}
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type MutationFeedbackProps = {
  state: {
    ok: boolean;
    error?: { message: string };
  };
  success: string;
};

function MutationFeedback({ state, success }: MutationFeedbackProps) {
  return state.ok ? (
    <Alert variant="success">
      <AlertTitle>{success}</AlertTitle>
      <AlertDescription>The timeline will reflect this change.</AlertDescription>
    </Alert>
  ) : (
    <Alert variant="destructive">
      <AlertTitle>Could not finish that change</AlertTitle>
      <AlertDescription>
        {state.error?.message ?? "Please try again."}
      </AlertDescription>
    </Alert>
  );
}
