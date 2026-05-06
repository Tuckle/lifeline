import {
  ArchiveX,
  CircleSlash,
  GitBranchPlus,
  LinkIcon,
  PenLine,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ImportRecordSummary } from "@/features/imports/types";

type ImportStagingCardProps = {
  record: ImportRecordSummary;
};

export function ImportStagingCard({ record }: ImportStagingCardProps) {
  return (
    <article className="rounded-md border border-border bg-card p-4 text-card-foreground shadow-soft">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{formatSourceType(record.sourceType)}</Badge>
        <Badge variant="outline">Lifecycle: {formatState(record.lifecycleState)}</Badge>
        <Badge variant="outline">Sync: {formatState(record.syncStatus)}</Badge>
      </div>

      <div className="mt-4 grid gap-2">
        <p className="text-sm font-medium text-muted-foreground">
          {record.sourceLabel}
        </p>
        <h2 className="text-card-title font-semibold text-foreground">
          {record.contentSummary}
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          {getDateDescription(record)}
        </p>
      </div>

      <dl className="mt-4 grid gap-2 rounded-md border border-border bg-background p-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-medium text-foreground">Imported</dt>
          <dd className="mt-1 text-muted-foreground">
            {formatDateTime(record.importedAt)}
          </dd>
        </div>
        <div>
          <dt className="font-medium text-foreground">Suggested match</dt>
          <dd className="mt-1 text-muted-foreground">
            {record.suggestedDateLabel ?? "No suggested period yet"}
          </dd>
        </div>
      </dl>

      <details className="mt-4 rounded-md border border-dashed border-border bg-background p-3">
        <summary className="min-h-11 cursor-pointer text-sm font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background">
          Source details
        </summary>
        <dl className="mt-2 grid gap-2 text-sm text-muted-foreground">
          <div>
            <dt className="font-medium text-foreground">Record ID</dt>
            <dd className="mt-1 break-all">{record.id}</dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">Metadata fields</dt>
            <dd className="mt-1">
              {Object.keys(record.sourceMetadata).length > 0
                ? Object.keys(record.sourceMetadata).join(", ")
                : "No extra metadata"}
            </dd>
          </div>
        </dl>
      </details>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button disabled variant="outline">
          <LinkIcon aria-hidden="true" className="size-4" />
          Attach
        </Button>
        <Button disabled variant="outline">
          <Sparkles aria-hidden="true" className="size-4" />
          Promote
        </Button>
        <Button disabled variant="outline">
          <PenLine aria-hidden="true" className="size-4" />
          Reflect
        </Button>
        <Button disabled variant="outline">
          <CircleSlash aria-hidden="true" className="size-4" />
          Hide
        </Button>
        <Button disabled variant="outline">
          <ArchiveX aria-hidden="true" className="size-4" />
          Discard
        </Button>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        Curation actions will be enabled by the promotion and attach stories.
      </p>
    </article>
  );
}

function getDateDescription(record: ImportRecordSummary) {
  if (record.periodStartedAt || record.periodEndedAt) {
    return `Covers ${formatDateTime(record.periodStartedAt)} to ${formatDateTime(record.periodEndedAt)}.`;
  }

  if (record.occurredAt) {
    return `Timestamp: ${formatDateTime(record.occurredAt)}.`;
  }

  return "No source timestamp was provided.";
}

function formatDateTime(value: string | null) {
  if (!value) return "Unknown";

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatSourceType(value: ImportRecordSummary["sourceType"]) {
  return value === "rescuetime" ? "RescueTime" : "Notes";
}

function formatState(value: string) {
  return value.replaceAll("_", " ");
}
