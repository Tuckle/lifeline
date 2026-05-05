"use client";

import { useActionState, useMemo, useState, type ReactNode } from "react";
import { CalendarPlus, CheckCircle2, Milestone } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createTimelineEventAction,
  initialTimelineEventFormState,
} from "@/features/timeline/actions/create-timeline-event";
import {
  datePrecisionValues,
  getDateLabel,
  importanceValues,
} from "@/features/timeline/schemas/timeline-event-form";

const datePrecisionLabels = {
  exact: "Exact date",
  month: "Month and year",
  year: "Year only",
  period: "Life period",
  unknown: "Unknown for now",
};

const importanceLabels = {
  unset: "Unset",
  low: "Low",
  medium: "Medium",
  high: "High",
  defining: "Defining",
};

export function MemoryCreationForm() {
  const [state, formAction, isPending] = useActionState(
    createTimelineEventAction,
    initialTimelineEventFormState,
  );
  const [values, setValues] = useState(state.values);

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

  return (
    <section
      aria-labelledby="add-memory-heading"
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]"
    >
      <form
        action={formAction}
        className="rounded-md border border-border bg-card p-5 text-card-foreground shadow-soft sm:p-8"
      >
        <div className="flex max-w-3xl flex-col gap-3">
          <p className="text-sm font-medium text-muted-foreground">
            Add memory
          </p>
          <h1
            id="add-memory-heading"
            className="text-page-title font-semibold text-foreground"
          >
            Place a moment on your life-line.
          </h1>
          <p className="max-w-2xl leading-7 text-muted-foreground">
            A title and your best date estimate are enough. Story details and
            importance can stay light for now.
          </p>
        </div>

        <div className="mt-8 grid gap-6">
          <FieldBlock
            error={state.fieldErrors.title}
            help="Keep it short; you can add more detail later."
            label="Memory title"
          >
            <Input
              aria-invalid={Boolean(state.fieldErrors.title)}
              name="title"
              onChange={(event) => updateValue("title", event.target.value)}
              placeholder="Moved to Bucharest, started therapy, childhood summer..."
              required
              value={values.title}
            />
          </FieldBlock>

          <fieldset className="grid gap-3">
            <legend className="text-sm font-medium text-foreground">
              Date precision
            </legend>
            <div className="grid gap-2 sm:grid-cols-2">
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

          <DatePrecisionFields
            errors={state.fieldErrors}
            precision={values.datePrecision}
            updateValue={updateValue}
            values={values}
          />

          <div className="rounded-md border border-timeline bg-background/70 p-4">
            <p className="text-sm font-medium text-foreground">
              Timeline preview
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              This memory will appear as:{" "}
              <span className="font-medium text-foreground">{previewLabel}</span>
            </p>
          </div>

          <FieldBlock
            help="Optional. A few lines are enough."
            label="Story notes"
          >
            <Textarea
              name="storyText"
              onChange={(event) => updateValue("storyText", event.target.value)}
              placeholder="What happened? Why does this moment matter?"
              value={values.storyText}
            />
          </FieldBlock>

          <fieldset className="grid gap-3">
            <legend className="text-sm font-medium text-foreground">
              Importance
            </legend>
            <div className="grid gap-2 sm:grid-cols-3">
              {importanceValues.map((importance) => (
                <label
                  className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md border border-border bg-background/60 px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-focus focus-within:ring-offset-2 focus-within:ring-offset-background"
                  key={importance}
                >
                  <input
                    checked={values.importance === importance}
                    className="size-4 accent-primary"
                    name="importance"
                    onChange={() => updateValue("importance", importance)}
                    type="radio"
                    value={importance}
                  />
                  <span>{importanceLabels[importance]}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {state.result && !state.result.ok ? (
            <Alert variant="destructive">
              <AlertTitle>Could not save yet</AlertTitle>
              <AlertDescription>{state.result.error.message}</AlertDescription>
            </Alert>
          ) : null}

          <Button className="w-full sm:w-fit" disabled={isPending} type="submit">
            <CalendarPlus aria-hidden="true" className="size-4" />
            {isPending ? "Saving..." : "Save memory"}
          </Button>
        </div>
      </form>

      <aside className="space-y-4">
        {state.result?.ok ? (
          <SavedMemoryPreview memory={state.result.data} />
        ) : (
          <div className="rounded-md border border-border bg-card p-5 text-card-foreground shadow-soft">
            <p className="text-sm font-medium text-muted-foreground">
              Save now, enrich later
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Lifeline accepts approximate memories because real life rarely
              arrives with perfect metadata.
            </p>
          </div>
        )}
      </aside>
    </section>
  );
}

type FieldBlockProps = {
  children: ReactNode;
  error?: string;
  help?: string;
  label: string;
};

function FieldBlock({ children, error, help, label }: FieldBlockProps) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      {children}
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : help ? (
        <p className="text-sm text-muted-foreground">{help}</p>
      ) : null}
    </div>
  );
}

type DatePrecisionFieldsProps = {
  errors: Partial<Record<string, string>>;
  precision: string;
  updateValue: (name: string, value: string) => void;
  values: Record<string, string>;
};

function DatePrecisionFields({
  errors,
  precision,
  updateValue,
  values,
}: DatePrecisionFieldsProps) {
  if (precision === "exact") {
    return (
      <FieldBlock error={errors.exactDate} label="Exact date">
        <Input
          aria-invalid={Boolean(errors.exactDate)}
          name="exactDate"
          onChange={(event) => updateValue("exactDate", event.target.value)}
          type="date"
          value={values.exactDate}
        />
      </FieldBlock>
    );
  }

  if (precision === "month") {
    return (
      <FieldBlock error={errors.monthDate} label="Month and year">
        <Input
          aria-invalid={Boolean(errors.monthDate)}
          name="monthDate"
          onChange={(event) => updateValue("monthDate", event.target.value)}
          type="month"
          value={values.monthDate}
        />
      </FieldBlock>
    );
  }

  if (precision === "year") {
    return (
      <FieldBlock error={errors.yearDate} label="Year">
        <Input
          aria-invalid={Boolean(errors.yearDate)}
          inputMode="numeric"
          max="2100"
          min="1800"
          name="yearDate"
          onChange={(event) => updateValue("yearDate", event.target.value)}
          placeholder="2019"
          type="number"
          value={values.yearDate}
        />
      </FieldBlock>
    );
  }

  if (precision === "period") {
    return (
      <FieldBlock
        error={errors.periodLabel}
        help="Use your own words: childhood, first year at university, winter 2020."
        label="Period label"
      >
        <Input
          aria-invalid={Boolean(errors.periodLabel)}
          name="periodLabel"
          onChange={(event) => updateValue("periodLabel", event.target.value)}
          placeholder="Childhood summers"
          value={values.periodLabel}
        />
      </FieldBlock>
    );
  }

  return (
    <div className="rounded-md border border-border bg-background/70 p-4 text-sm text-muted-foreground">
      You can save this memory without a date and return when the timing feels
      clearer.
    </div>
  );
}

type SavedMemoryPreviewProps = {
  memory: {
    title: string;
    dateLabel: string;
    importance: string;
    sourceLabel: string;
  };
};

function SavedMemoryPreview({ memory }: SavedMemoryPreviewProps) {
  return (
    <div className="rounded-md border border-border bg-card p-5 text-card-foreground shadow-soft">
      <div className="flex items-center gap-2 text-sm font-medium text-success">
        <CheckCircle2 aria-hidden="true" className="size-4" />
        Saved on the line
      </div>
      <div className="mt-5 flex gap-4">
        <div
          aria-hidden="true"
          className="flex flex-col items-center gap-2 pt-1"
        >
          <div className="h-8 w-px bg-timeline" />
          <div className="flex size-10 items-center justify-center rounded-full bg-memory text-memory-foreground">
            <Milestone className="size-4" />
          </div>
          <div className="h-12 w-px bg-timeline" />
        </div>
        <div className="min-w-0 space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">{memory.dateLabel}</p>
            <h2 className="mt-1 text-section-title font-semibold">
              {memory.title}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{memory.sourceLabel}</Badge>
            <Badge variant="outline">Importance: {memory.importance}</Badge>
            <Badge variant="outline">Saved</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
