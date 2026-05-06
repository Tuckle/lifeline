"use client";

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
import { useActionState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { ActionResult } from "@/lib/action-result";
import {
  disconnectImportSourceAction,
  initialSourceRecoveryState,
} from "@/features/imports/actions/source-recovery";
import {
  deleteImportedDataForSourceAction,
  initialDeleteImportedDataState,
} from "@/features/settings/actions/delete-imported-data";
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
                <SourcePermissionDetails source={source} />
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

function SourcePermissionDetails({
  source,
}: {
  source: PrivacyDataSummary["sources"][number];
}) {
  return (
    <div className="mt-3 grid gap-3">
      <div className="grid gap-3 lg:grid-cols-2">
        <div className="rounded-md border border-border bg-card p-3">
          <p className="text-sm font-medium text-foreground">
            Future source access
          </p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {source.permissionSummary}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {source.futureAccessSummary}
          </p>
        </div>

        <div className="rounded-md border border-border bg-card p-3">
          <p className="text-sm font-medium text-foreground">
            Already imported records
          </p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {source.importedContextSummary}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {source.issueSummary}
          </p>
        </div>
      </div>

      <div className="rounded-md border border-border bg-card p-3">
        <p className="text-sm font-medium text-foreground">
          Aggregate record states
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge variant="outline">Staged {source.lifecycleCounts.staged}</Badge>
          <Badge variant="outline">
            Promoted {source.lifecycleCounts.promoted}
          </Badge>
          <Badge variant="outline">
            Attached {source.lifecycleCounts.attached}
          </Badge>
          <Badge variant="outline">Hidden {source.lifecycleCounts.hidden}</Badge>
          <Badge variant="outline">
            Discarded {source.lifecycleCounts.discarded}
          </Badge>
          <Badge variant="outline">Failed {source.syncCounts.failed}</Badge>
          <Badge variant="outline">Partial {source.syncCounts.partial}</Badge>
        </div>
      </div>

      <div className="rounded-md border border-border bg-card p-3">
        <p className="text-sm font-medium text-foreground">
          Source metadata for export/delete decisions
        </p>
        <ul className="mt-2 grid gap-1 text-sm leading-6 text-muted-foreground">
          {source.metadataDetails.map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap gap-2">
        {source.managementActions.map((action) => (
          <Button asChild key={action} variant="outline">
            <Link href={getManagementActionHref(action)}>{action}</Link>
          </Button>
        ))}
        <DisconnectSourceControl source={source} />
        <DeleteImportedDataControl source={source} />
      </div>
    </div>
  );
}

function DisconnectSourceControl({
  source,
}: {
  source: PrivacyDataSummary["sources"][number];
}) {
  const [state, action, isPending] = useActionState(
    disconnectImportSourceAction,
    initialSourceRecoveryState,
  );
  const isDisconnected = source.connectionStatus === "disconnected";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={isDisconnected} type="button" variant="outline">
          <Unplug aria-hidden="true" className="size-4" />
          Disconnect source
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Disconnect {source.displayName}</DialogTitle>
          <DialogDescription>
            Future sync and source access will stop for this source. Already
            imported records stay in Lifeline with their current staged,
            promoted, attached, hidden, or discarded state unless you delete
            imported data separately.
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-md border border-border bg-background p-3 text-sm leading-6 text-muted-foreground">
          Manual memories, reflections, and future intentions are separate from
          this source and will not be changed by disconnecting it.
        </div>
        <form action={action} className="grid gap-3">
          <input name="sourceId" type="hidden" value={source.id} />
          <DialogFooter>
            <DialogClose asChild>
              <Button disabled={isPending} type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button disabled={isPending} type="submit" variant="destructive">
              {isPending ? "Disconnecting..." : "Disconnect source"}
            </Button>
          </DialogFooter>
        </form>
        {state.result && !state.result.ok ? (
          <p className="text-sm text-destructive" role="alert">
            {state.result.error.message} The source has not changed; try again
            when you are ready.
          </p>
        ) : null}
        {state.result?.ok ? (
          <p className="text-sm text-muted-foreground" role="status">
            Source disconnected. Existing imported records remain available for
            review and future delete controls.
          </p>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function DeleteImportedDataControl({
  source,
}: {
  source: PrivacyDataSummary["sources"][number];
}) {
  const [state, action, isPending] = useActionState(
    deleteImportedDataForSourceAction,
    initialDeleteImportedDataState,
  );
  const hasImportedRecords = source.importedRecordCount > 0;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={!hasImportedRecords} type="button" variant="destructive">
          <Trash2 aria-hidden="true" className="size-4" />
          Delete imported data
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete imported data from {source.displayName}</DialogTitle>
          <DialogDescription>
            This marks imported records from this source as deleted. Manual
            memories, reflections, and future intentions stay separate and will
            not be deleted.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 text-sm leading-6 text-muted-foreground">
          <div className="rounded-md border border-border bg-background p-3">
            Affected scope: {source.importedRecordCount} imported record(s) from{" "}
            {source.displayName}. Future sync behavior is unchanged unless you
            disconnect the source separately.
          </div>
          <div className="rounded-md border border-border bg-background p-3">
            Promoted imported timeline events created from these records will be
            marked deleted. Attached manual memories keep their memory content;
            the imported supporting record is removed from normal Import Review.
          </div>
        </div>
        <form action={action} className="grid gap-3">
          <input name="sourceId" type="hidden" value={source.id} />
          <DialogFooter>
            <DialogClose asChild>
              <Button disabled={isPending} type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button disabled={isPending} type="submit" variant="destructive">
              {isPending ? "Deleting imported data..." : "Delete imported data"}
            </Button>
          </DialogFooter>
        </form>
        {state.result && !state.result.ok ? (
          <p className="text-sm text-destructive" role="alert">
            {state.result.error.message} No data is shown as deleted until the
            server confirms the change.
          </p>
        ) : null}
        {state.result?.ok ? (
          <p className="text-sm text-muted-foreground" role="status">
            Deleted {state.result.data.deletedRecordCount} imported record(s).
            Promoted imported timeline events updated:{" "}
            {state.result.data.deletedTimelineEventCount}.
          </p>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function getManagementActionHref(action: string) {
  if (action === "Open import review" || action === "Open import recovery") {
    return "/imports";
  }

  if (action === "Review disconnect") {
    return "#disconnect-source";
  }

  if (action === "Review delete") {
    return "#delete-imported-data";
  }

  return "#connected-source-permissions";
}
