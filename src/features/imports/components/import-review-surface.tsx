import Link from "next/link";
import { Database, FileText, TimerReset } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImportStagingCard } from "@/features/imports/components/import-staging-card";
import type {
  ImportRecordSummary,
  ImportSourceSummary,
} from "@/features/imports/types";

type ImportReviewSurfaceProps = {
  hasConnectedSources: boolean;
  records: ImportRecordSummary[];
  sources: ImportSourceSummary[];
};

export function ImportReviewSurface({
  hasConnectedSources,
  records,
  sources,
}: ImportReviewSurfaceProps) {
  const stagedRecords = records.filter((record) => record.lifecycleState === "staged");

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] xl:items-start">
      <aside className="grid gap-5 xl:sticky xl:top-5">
        <section className="rounded-md border border-border bg-card p-5 text-card-foreground shadow-soft">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Import Review</Badge>
            <Badge variant="outline">Staged suggested context</Badge>
          </div>
          <h1 className="mt-4 text-page-title font-semibold text-foreground">
            Review imports before they touch your life-line.
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            RescueTime activity and notes stay here as suggested context until
            you choose what matters. Nothing becomes a primary timeline memory automatically.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <Metric label="Connected sources" value={sources.length} />
            <Metric label="Staged records" value={stagedRecords.length} />
          </div>
        </section>

        <section
          aria-labelledby="import-source-actions-heading"
          className="rounded-md border border-border bg-card p-5 text-card-foreground shadow-soft"
        >
          <p className="text-sm font-medium text-muted-foreground">
            Source setup
          </p>
          <h2
            className="mt-2 text-section-title font-semibold text-foreground"
            id="import-source-actions-heading"
          >
            Bring in context carefully.
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Connectors arrive in the next stories. The staging area is ready to
            keep imported records separate and reviewable.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row xl:flex-col 2xl:flex-row">
            <Button asChild variant="outline">
              <Link href="/imports#rescuetime">
                <TimerReset aria-hidden="true" className="size-4" />
                Connect RescueTime
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/imports#notes">
                <FileText aria-hidden="true" className="size-4" />
                Import notes
              </Link>
            </Button>
          </div>
        </section>

        {sources.length > 0 ? (
          <section
            aria-labelledby="connected-import-sources-heading"
            className="rounded-md border border-border bg-card p-5 text-card-foreground shadow-soft"
          >
            <p className="text-sm font-medium text-muted-foreground">
              Connected sources
            </p>
            <h2
              className="mt-2 text-section-title font-semibold text-foreground"
              id="connected-import-sources-heading"
            >
              Source status
            </h2>
            <ul className="mt-4 grid gap-3">
              {sources.map((source) => (
                <li
                  className="rounded-md border border-border bg-background p-3"
                  key={source.id}
                >
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{formatSourceType(source.sourceType)}</Badge>
                    <Badge variant="outline">
                      {formatState(source.connectionStatus)}
                    </Badge>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-foreground">
                    {source.displayName}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {source.stagedRecordCount} staged records
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </aside>

      <section className="grid gap-4" aria-labelledby="staged-imports-heading">
        <div className="rounded-md border border-border bg-card p-5 text-card-foreground shadow-soft">
          <div className="flex items-start gap-3">
            <Database
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-imported"
            />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Staged records
              </p>
              <h2
                className="mt-2 text-section-title font-semibold text-foreground"
                id="staged-imports-heading"
              >
                Suggested context, not timeline memories
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Review imported material here, then later attach, promote, hide,
                discard, or use it as a reflection prompt.
              </p>
            </div>
          </div>
        </div>

        {records.length > 0 ? (
          records.map((record) => (
            <ImportStagingCard key={record.id} record={record} />
          ))
        ) : (
          <EmptyImportReview hasConnectedSources={hasConnectedSources} />
        )}
      </section>
    </div>
  );
}

function EmptyImportReview({
  hasConnectedSources,
}: {
  hasConnectedSources: boolean;
}) {
  return (
    <Alert>
      <AlertTitle>No staged imports yet.</AlertTitle>
      <AlertDescription>
        {hasConnectedSources
          ? "Connected sources have no staged records right now. Future import stories will add retry and manual import controls here."
          : "Connect RescueTime or import notes when those flows are available. Imported data will stay staged until you choose what belongs on the timeline."}
      </AlertDescription>
    </Alert>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-border bg-background p-3">
      <dt className="text-xs font-medium uppercase text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 text-2xl font-semibold text-foreground">{value}</dd>
    </div>
  );
}

function formatSourceType(value: ImportSourceSummary["sourceType"]) {
  return value === "rescuetime" ? "RescueTime" : "Notes";
}

function formatState(value: string) {
  return value.replaceAll("_", " ");
}
