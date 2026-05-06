"use client";

import { useActionState, useState } from "react";
import { Sunrise } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createFutureIntentionAction,
  initialFutureIntentionState,
} from "@/features/timeline/actions/manage-future-intention";
import type { FutureIntentionLinkOption } from "@/features/timeline/types";

type FutureIntentionFormProps = {
  linkOptions?: FutureIntentionLinkOption[];
  initialLink?: FutureIntentionLinkOption | null;
};

export function FutureIntentionForm({
  linkOptions = [],
  initialLink = null,
}: FutureIntentionFormProps) {
  const [state, action, isPending] = useActionState(
    createFutureIntentionAction,
    {
      ...initialFutureIntentionState,
      values: {
        ...initialFutureIntentionState.values,
        linkType: initialLink?.type ?? "none",
        linkedId: initialLink?.id ?? "",
      },
    },
  );
  const [values, setValues] = useState(state.values);

  function updateValue(name: string, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  return (
    <section
      aria-labelledby="future-intention-heading"
      className="rounded-md border border-future/35 bg-card p-5 text-card-foreground shadow-soft sm:p-8"
      id="future-intention"
    >
      <div className="flex max-w-3xl flex-col gap-3">
        <p className="text-sm font-medium text-muted-foreground">
          Future intention
        </p>
        <h2
          className="text-section-title font-semibold text-foreground"
          id="future-intention-heading"
        >
          Add something you want to move toward.
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          This does not need a reflection, pattern, or full plan yet. A clear
          direction is enough.
        </p>
      </div>

      <form action={action} className="mt-6 grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="future-title">Intention title</Label>
          <Input
            aria-invalid={Boolean(state.fieldErrors.title)}
            id="future-title"
            name="title"
            onChange={(event) => updateValue("title", event.target.value)}
            placeholder="Call my sister every Sunday"
            value={values.title}
          />
          {state.fieldErrors.title ? (
            <p className="text-sm text-destructive" role="alert">
              {state.fieldErrors.title}
            </p>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="future-date">Optional date</Label>
            <Input
              id="future-date"
              name="targetDate"
              onChange={(event) => updateValue("targetDate", event.target.value)}
              type="date"
              value={values.targetDate}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="future-period">Optional period</Label>
            <Input
              id="future-period"
              name="targetLabel"
              onChange={(event) => updateValue("targetLabel", event.target.value)}
              placeholder="This summer"
              value={values.targetLabel}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="future-link">Linked past context</Label>
          <select
            className="min-h-11 rounded-md border border-input bg-card px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            id="future-link"
            name="linkedId"
            onChange={(event) => {
              const option = linkOptions.find(
                (item) => item.id === event.target.value,
              );
              updateValue("linkedId", event.target.value);
              updateValue("linkType", option?.type ?? "none");
            }}
            value={values.linkedId}
          >
            <option value="">No link yet</option>
            {linkOptions.map((option) => (
              <option key={`${option.type}-${option.id}`} value={option.id}>
                {formatLinkType(option.type)}: {option.title}
              </option>
            ))}
          </select>
          <input name="linkType" type="hidden" value={values.linkType} />
          <p className="text-sm text-muted-foreground">
            Optional. Link this intention to a reflection, pattern, or memory
            that inspired it.
          </p>
        </div>

        {state.result ? (
          state.result.ok ? (
            <Alert variant="success">
              <AlertTitle>Intention saved.</AlertTitle>
              <AlertDescription>
                It will appear below the present point on your timeline.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="destructive">
              <AlertTitle>Could not save yet</AlertTitle>
              <AlertDescription>{state.result.error.message}</AlertDescription>
            </Alert>
          )
        ) : null}

        <Button className="w-full sm:w-fit" disabled={isPending} type="submit">
          <Sunrise aria-hidden="true" className="size-4" />
          {isPending ? "Saving..." : "Save intention"}
        </Button>
      </form>
    </section>
  );
}

function formatLinkType(type: FutureIntentionLinkOption["type"]) {
  if (type === "reflection") return "Reflection";
  if (type === "pattern") return "Pattern";
  return "Memory";
}
