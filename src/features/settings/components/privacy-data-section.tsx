import Link from "next/link";
import {
  Database,
  Download,
  FileText,
  Link2,
  ShieldCheck,
  Trash2,
  Unplug,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/lib/action-result";
import type { PrivacyDataSummary } from "@/features/settings/queries/get-privacy-data-summary";

type PrivacyDataSectionProps = {
  summary: ActionResult<PrivacyDataSummary>;
};

const privacyControls = [
  {
    description:
      "Review imported context and source status without changing your timeline.",
    href: "/imports",
    icon: Link2,
    id: "connected-sources",
    label: "Review sources",
    title: "Connected sources",
    tone: "default",
  },
  {
    description:
      "See what each source can provide and how imported records stay staged first.",
    href: "#connected-source-permissions",
    icon: ShieldCheck,
    id: "connected-source-permissions",
    label: "View permissions",
    title: "Source permissions",
    tone: "default",
  },
  {
    description:
      "Stops future access for a source. Already imported records are kept unless you delete them separately.",
    href: "#disconnect-source",
    icon: Unplug,
    id: "disconnect-source",
    label: "Review disconnect",
    title: "Disconnect source",
    tone: "critical",
  },
  {
    description:
      "Removes imported context for a chosen source scope. Manual memories remain separate.",
    href: "#delete-imported-data",
    icon: Trash2,
    id: "delete-imported-data",
    label: "Review deletion",
    title: "Delete imported data",
    tone: "destructive",
  },
  {
    description:
      "Prepare a structured copy of your timeline, reflections, intentions, and source references.",
    href: "#export-data",
    icon: Download,
    id: "export-data",
    label: "Review export",
    title: "Export data",
    tone: "default",
  },
] as const;

export function PrivacyDataSection({ summary }: PrivacyDataSectionProps) {
  if (!summary.ok) {
    return (
      <Alert variant="warning">
        <AlertTitle>Privacy settings could not load</AlertTitle>
        <AlertDescription>{summary.error.message}</AlertDescription>
      </Alert>
    );
  }

  const { data } = summary;

  return (
    <section aria-labelledby="privacy-data-heading" className="grid gap-5">
      <div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">Privacy and Data</Badge>
          <Badge variant="outline">Private workspace</Badge>
        </div>
        <h1
          className="mt-3 text-page-title font-semibold text-foreground"
          id="privacy-data-heading"
        >
          Privacy and Data
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          Your timeline, reflections, future intentions, and imported context
          belong to your signed-in account. These controls help you understand
          what is connected, what can be exported, and which actions affect
          imported data.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <SummaryMetric
          icon={Database}
          label="Timeline items"
          value={data.timelineEventCount}
        />
        <SummaryMetric
          icon={FileText}
          label="Imported records"
          value={data.importedRecordCount}
        />
        <SummaryMetric icon={Link2} label="Sources" value={data.sourceCount} />
      </div>

      <section
        aria-labelledby="connected-source-status-heading"
        className="rounded-md border border-border bg-card p-5 shadow-soft"
      >
        <h2
          className="text-section-title font-semibold text-foreground"
          id="connected-source-status-heading"
        >
          Connected source status
        </h2>
        {data.sources.length === 0 ? (
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            No import sources are connected yet. You can still export
            user-owned timeline data created in Lifeline, and future source
            controls will appear here after you connect RescueTime or notes.
          </p>
        ) : (
          <div className="mt-4 grid gap-3">
            {data.sources.map((source) => (
              <div
                className="rounded-md border border-border bg-background p-3"
                key={source.id}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-foreground">
                    {source.displayName}
                  </p>
                  <Badge variant="outline">{source.connectionStatus}</Badge>
                  <Badge variant="secondary">{source.sourceType}</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Last sync:{" "}
                  {source.lastSyncedAt
                    ? new Date(source.lastSyncedAt).toLocaleString()
                    : "Not synced yet"}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="data-control-heading" className="grid gap-3">
        <div>
          <h2
            className="text-section-title font-semibold text-foreground"
            id="data-control-heading"
          >
            Data controls
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Privacy-critical actions are separated from ordinary navigation and
            include consequence copy before later stories add confirmations.
          </p>
        </div>
        <div className="grid gap-3 lg:grid-cols-2">
          {privacyControls.map((control) => (
            <article
              className={
                control.tone === "destructive"
                  ? "rounded-md border border-destructive/40 bg-card p-4 shadow-soft"
                  : control.tone === "critical"
                    ? "rounded-md border border-warning/60 bg-card p-4 shadow-soft"
                    : "rounded-md border border-border bg-card p-4 shadow-soft"
              }
              id={control.id}
              key={control.id}
            >
              <div className="flex items-start gap-3">
                <control.icon
                  aria-hidden="true"
                  className="mt-1 size-4 text-muted-foreground"
                />
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {control.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {control.description}
                  </p>
                </div>
              </div>
              <Button
                asChild
                className="mt-3 w-full sm:w-fit"
                variant={control.tone === "destructive" ? "destructive" : "outline"}
              >
                <Link href={control.href}>{control.label}</Link>
              </Button>
            </article>
          ))}
        </div>
      </section>

      {!data.hasConnectedSources ? (
        <Alert>
          <AlertTitle>No connected sources</AlertTitle>
          <AlertDescription>
            Lifeline has no active source connection to manage right now. Your
            private timeline data remains available for future export controls.
          </AlertDescription>
        </Alert>
      ) : null}
    </section>
  );
}

function SummaryMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Database;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-md border border-border bg-card p-4 shadow-soft">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon aria-hidden="true" className="size-4" />
        {label}
      </div>
      <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
    </div>
  );
}
