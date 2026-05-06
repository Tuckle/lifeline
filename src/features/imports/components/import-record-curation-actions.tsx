"use client";

import { useActionState } from "react";
import { ArchiveX, CircleSlash, LinkIcon, Sparkles } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  attachImportRecordAction,
  discardImportRecordAction,
  hideImportRecordAction,
  initialImportCurationState,
  promoteImportRecordAction,
} from "@/features/imports/actions/curate-import-record";
import type {
  ImportAttachTimelineEventOption,
  ImportRecordSummary,
} from "@/features/imports/types";

type ImportRecordCurationActionsProps = {
  record: ImportRecordSummary;
  timelineOptions: ImportAttachTimelineEventOption[];
};

export function ImportRecordCurationActions({
  record,
  timelineOptions,
}: ImportRecordCurationActionsProps) {
  const [promoteState, promoteAction, isPromoting] = useActionState(
    promoteImportRecordAction,
    initialImportCurationState,
  );
  const [attachState, attachAction, isAttaching] = useActionState(
    attachImportRecordAction,
    initialImportCurationState,
  );
  const [hideState, hideAction, isHiding] = useActionState(
    hideImportRecordAction,
    initialImportCurationState,
  );
  const [discardState, discardAction, isDiscarding] = useActionState(
    discardImportRecordAction,
    initialImportCurationState,
  );
  const defaultDate = record.occurredAt?.slice(0, 10) ?? "";
  const canCurate = record.lifecycleState === "staged";

  return (
    <div className="mt-4 grid gap-3">
      <details className="rounded-md border border-border bg-background p-3">
        <summary className="min-h-11 cursor-pointer text-sm font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background">
          Promote to timeline
        </summary>
        <form action={promoteAction} className="mt-3 grid gap-3">
          <input name="recordId" type="hidden" value={record.id} />
          <input name="storyText" type="hidden" value={record.contentSummary} />
          <input name="importance" type="hidden" value="low" />
          <input name="photoReferenceUrl" type="hidden" value="" />
          <input name="photoAltText" type="hidden" value="" />
          <div className="grid gap-2">
            <Label htmlFor={`promote-title-${record.id}`}>Timeline title</Label>
            <Input
              defaultValue={record.contentSummary}
              id={`promote-title-${record.id}`}
              name="title"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`promote-date-precision-${record.id}`}>
              Placement
            </Label>
            <select
              className="min-h-11 rounded-md border border-input bg-card px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              defaultValue={defaultDate ? "exact" : "period"}
              id={`promote-date-precision-${record.id}`}
              name="datePrecision"
            >
              <option value="exact">Exact date</option>
              <option value="period">Approximate period</option>
            </select>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor={`promote-exact-${record.id}`}>Exact date</Label>
              <Input
                defaultValue={defaultDate}
                id={`promote-exact-${record.id}`}
                name="exactDate"
                type="date"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`promote-period-${record.id}`}>
                Approximate period
              </Label>
              <Input
                defaultValue={record.suggestedDateLabel ?? ""}
                id={`promote-period-${record.id}`}
                name="periodLabel"
                placeholder="Early 2024, spring break, that launch week..."
              />
            </div>
          </div>
          <input name="monthDate" type="hidden" value="" />
          <input name="yearDate" type="hidden" value="" />
          <Button disabled={!canCurate || isPromoting} type="submit">
            <Sparkles aria-hidden="true" className="size-4" />
            {isPromoting ? "Promoting..." : "Promote"}
          </Button>
        </form>
        <CurationResultAlert result={promoteState.result} />
      </details>

      <details className="rounded-md border border-border bg-background p-3">
        <summary className="min-h-11 cursor-pointer text-sm font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background">
          Attach to existing memory
        </summary>
        <form action={attachAction} className="mt-3 grid gap-3">
          <input name="recordId" type="hidden" value={record.id} />
          <div className="grid gap-2">
            <Label htmlFor={`attach-event-${record.id}`}>Memory</Label>
            <select
              className="min-h-11 rounded-md border border-input bg-card px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              id={`attach-event-${record.id}`}
              name="timelineEventId"
            >
              <option value="">Choose a memory</option>
              {timelineOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.title}
                  {option.dateLabel ? ` (${option.dateLabel})` : ""}
                </option>
              ))}
            </select>
          </div>
          <Button disabled={!canCurate || isAttaching} type="submit" variant="outline">
            <LinkIcon aria-hidden="true" className="size-4" />
            {isAttaching ? "Attaching..." : "Attach"}
          </Button>
        </form>
        <CurationResultAlert result={attachState.result} />
      </details>

      <div className="rounded-md border border-border bg-background p-3">
        <p className="text-sm font-medium text-foreground">Control resurfacing</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Hide keeps the record out of normal suggestions. Discard marks it as
          not useful for review without deleting the source metadata.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <form action={hideAction}>
            <input name="recordId" type="hidden" value={record.id} />
            <Button disabled={!canCurate || isHiding} type="submit" variant="outline">
              <CircleSlash aria-hidden="true" className="size-4" />
              {isHiding ? "Hiding..." : "Hide"}
            </Button>
          </form>
          <form
            action={discardAction}
            onSubmit={(event) => {
              if (
                !window.confirm(
                  "Discard this imported record from normal review? It will not be promoted or attached.",
                )
              ) {
                event.preventDefault();
              }
            }}
          >
            <input name="recordId" type="hidden" value={record.id} />
            <Button disabled={!canCurate || isDiscarding} type="submit" variant="outline">
              <ArchiveX aria-hidden="true" className="size-4" />
              {isDiscarding ? "Discarding..." : "Discard"}
            </Button>
          </form>
        </div>
        <CurationResultAlert result={hideState.result ?? discardState.result} />
      </div>
    </div>
  );
}

function CurationResultAlert({
  result,
}: {
  result?: { ok: true; data: unknown } | { ok: false; error: { message: string } };
}) {
  if (!result) return null;

  return result.ok ? (
    <Alert className="mt-3" variant="success">
      <AlertTitle>Import curated.</AlertTitle>
      <AlertDescription>
        Its state is updated. Refreshing Import Review will show the linked timeline state.
      </AlertDescription>
    </Alert>
  ) : (
    <Alert className="mt-3" variant="warning">
      <AlertTitle>Import stayed staged.</AlertTitle>
      <AlertDescription>{result.error.message}</AlertDescription>
    </Alert>
  );
}
