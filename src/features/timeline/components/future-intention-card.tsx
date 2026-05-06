"use client";

import { useActionState, useState, type FormEvent } from "react";
import { Save, Trash2 } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  deleteFutureIntentionAction,
  initialFutureIntentionState,
  updateFutureIntentionAction,
} from "@/features/timeline/actions/manage-future-intention";
import type { FutureIntentionSummary } from "@/features/timeline/types";

type FutureIntentionCardProps = {
  intention: FutureIntentionSummary;
};

export function FutureIntentionCard({ intention }: FutureIntentionCardProps) {
  const [updateState, updateAction, isUpdating] = useActionState(
    updateFutureIntentionAction,
    {
      ...initialFutureIntentionState,
      values: {
        title: intention.title,
        targetDate: intention.targetOn ?? "",
        targetLabel: intention.targetLabel ?? "",
      },
    },
  );
  const [deleteState, deleteAction, isDeleting] = useActionState(
    deleteFutureIntentionAction,
    initialFutureIntentionState,
  );
  const [values, setValues] = useState(updateState.values);

  function updateValue(name: string, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  function confirmDelete(submitEvent: FormEvent<HTMLFormElement>) {
    const confirmed = window.confirm(
      `Delete "${intention.title}"? This removes the selected future intention. You can cancel safely now.`,
    );

    if (!confirmed) {
      submitEvent.preventDefault();
    }
  }

  return (
    <article
      className="rounded-md border border-future/35 bg-future/10 p-4 text-foreground"
      id={`future-${intention.id}`}
    >
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline">Future intention</Badge>
        <Badge variant="outline">Status: {intention.status}</Badge>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        {intention.targetLabel || intention.targetOn || "Future timing open"}
      </p>
      <h2 className="mt-1 text-section-title font-semibold">
        {intention.title}
      </h2>

      <details className="group mt-4 rounded-md border border-border bg-card/90">
        <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-3 px-3 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background">
          Edit or delete intention
          <span className="text-muted-foreground group-open:hidden">+</span>
          <span className="hidden text-muted-foreground group-open:inline">
            -
          </span>
        </summary>

        <div className="grid gap-4 border-t border-border p-4">
          <form action={updateAction} className="grid gap-4">
            <input name="id" type="hidden" value={intention.id} />
            <div className="grid gap-2">
              <Label htmlFor={`future-title-${intention.id}`}>Title</Label>
              <Input
                id={`future-title-${intention.id}`}
                name="title"
                onChange={(event) => updateValue("title", event.target.value)}
                value={values.title}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor={`future-date-${intention.id}`}>Date</Label>
                <Input
                  id={`future-date-${intention.id}`}
                  name="targetDate"
                  onChange={(event) =>
                    updateValue("targetDate", event.target.value)
                  }
                  type="date"
                  value={values.targetDate}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`future-label-${intention.id}`}>Period</Label>
                <Input
                  id={`future-label-${intention.id}`}
                  name="targetLabel"
                  onChange={(event) =>
                    updateValue("targetLabel", event.target.value)
                  }
                  value={values.targetLabel}
                />
              </div>
            </div>
            {updateState.result ? (
              updateState.result.ok ? (
                <Alert variant="success">
                  <AlertTitle>Intention updated.</AlertTitle>
                  <AlertDescription>
                    The future area will reflect this change.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive">
                  <AlertTitle>Could not save yet</AlertTitle>
                  <AlertDescription>
                    {updateState.result.error.message}
                  </AlertDescription>
                </Alert>
              )
            ) : null}
            <Button disabled={isUpdating} type="submit">
              <Save aria-hidden="true" className="size-4" />
              {isUpdating ? "Saving..." : "Save intention"}
            </Button>
          </form>

          <form action={deleteAction} onSubmit={confirmDelete}>
            <input name="id" type="hidden" value={intention.id} />
            <Button
              className="w-full"
              disabled={isDeleting}
              type="submit"
              variant="destructive"
            >
              <Trash2 aria-hidden="true" className="size-4" />
              {isDeleting ? "Deleting..." : "Delete intention"}
            </Button>
          </form>

          {deleteState.result && !deleteState.result.ok ? (
            <Alert variant="destructive">
              <AlertTitle>Could not delete yet</AlertTitle>
              <AlertDescription>{deleteState.result.error.message}</AlertDescription>
            </Alert>
          ) : null}
        </div>
      </details>
    </article>
  );
}
