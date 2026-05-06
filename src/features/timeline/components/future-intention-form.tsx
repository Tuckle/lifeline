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

export function FutureIntentionForm() {
  const [state, action, isPending] = useActionState(
    createFutureIntentionAction,
    initialFutureIntentionState,
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
