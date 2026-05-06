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
import type {
  FutureIntentionLinkOption,
  FutureIntentionSummary,
} from "@/features/timeline/types";

type FutureIntentionCardProps = {
  intention: FutureIntentionSummary;
  linkOptions?: FutureIntentionLinkOption[];
};

export function FutureIntentionCard({
  intention,
  linkOptions = [],
}: FutureIntentionCardProps) {
  const mergedLinkOptions = mergeLinkOptions(linkOptions, intention.linkedContext);
  const [updateState, updateAction, isUpdating] = useActionState(
    updateFutureIntentionAction,
    {
      ...initialFutureIntentionState,
      values: {
        title: intention.title,
        targetDate: intention.targetOn ?? "",
        targetLabel: intention.targetLabel ?? "",
        linkType: intention.linkedContext?.type ?? "none",
        linkedId: intention.linkedContext?.id ?? "",
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
      {intention.linkedContext ? (
        <p className="mt-3 rounded-md border border-future/30 bg-card px-3 py-2 text-sm text-muted-foreground">
          Grows from{" "}
          <a
            className="font-medium text-primary underline-offset-4 hover:underline"
            href={intention.linkedContext.href}
          >
            {formatLinkType(intention.linkedContext.type)}:{" "}
            {intention.linkedContext.title}
          </a>
        </p>
      ) : null}

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
            <div className="grid gap-2">
              <Label htmlFor={`future-link-${intention.id}`}>
                Linked past context
              </Label>
              <select
                className="min-h-11 rounded-md border border-input bg-card px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                id={`future-link-${intention.id}`}
                name="linkedId"
                onChange={(event) => {
                  const option = mergedLinkOptions.find(
                    (item) => item.id === event.target.value,
                  );
                  updateValue("linkedId", event.target.value);
                  updateValue("linkType", option?.type ?? "none");
                }}
                value={values.linkedId}
              >
                <option value="">No link yet</option>
                {mergedLinkOptions.map((option) => (
                  <option key={`${option.type}-${option.id}`} value={option.id}>
                    {formatLinkType(option.type)}: {option.title}
                  </option>
                ))}
              </select>
              <input name="linkType" type="hidden" value={values.linkType} />
              <p className="text-sm text-muted-foreground">
                Choose No link yet to unlink while keeping the intention.
              </p>
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

function mergeLinkOptions(
  options: FutureIntentionLinkOption[],
  linkedContext: FutureIntentionSummary["linkedContext"],
) {
  if (!linkedContext) {
    return options;
  }

  if (options.some((option) => option.id === linkedContext.id)) {
    return options;
  }

  return [linkedContext, ...options];
}

function formatLinkType(type: FutureIntentionLinkOption["type"]) {
  if (type === "reflection") return "Reflection";
  if (type === "pattern") return "Pattern";
  return "Memory";
}
