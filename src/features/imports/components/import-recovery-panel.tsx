"use client";

import type { ReactNode } from "react";
import { useActionState } from "react";
import { Ban, LifeBuoy, RefreshCw, ShieldAlert, Wifi } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  disconnectImportSourceAction,
  ignoreImportSourceIssueAction,
  initialSourceRecoveryState,
} from "@/features/imports/actions/source-recovery";
import type { ImportSourceSummary } from "@/features/imports/types";

type ImportRecoveryPanelProps = {
  sources: ImportSourceSummary[];
};

export function ImportRecoveryPanel({ sources }: ImportRecoveryPanelProps) {
  const problemSources = sources.filter((source) =>
    ["failed", "needs_reconnect", "disconnected"].includes(source.connectionStatus),
  );

  return (
    <section
      aria-labelledby="import-recovery-heading"
      className="rounded-md border border-border bg-card p-5 text-card-foreground shadow-soft"
    >
      <p className="text-sm font-medium text-muted-foreground">
        Import recovery
      </p>
      <h2
        className="mt-2 text-section-title font-semibold text-foreground"
        id="import-recovery-heading"
      >
        Fix import issues without touching your timeline.
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Recovery affects import staging and sync only. Existing timeline
        content, exports, account access, and already staged successful records
        stay available unless a later delete control says otherwise.
      </p>

      <div className="mt-4 grid gap-3">
        <IssueCategory
          description="Reconnect the source. Reconnecting refreshes access for future imports; it does not promote, delete, or rewrite staged records."
          icon={<ShieldAlert aria-hidden="true" className="size-4" />}
          title="Authorization or expired access"
        />
        <IssueCategory
          description="Retry the same source or range. Duplicate staged records are avoided when source record IDs can be matched."
          icon={<RefreshCw aria-hidden="true" className="size-4" />}
          title="Network, source availability, or partial sync"
        />
        <IssueCategory
          description="Review the supported format, retry the export, or ignore the issue. Successful records remain usable in staging."
          icon={<Wifi aria-hidden="true" className="size-4" />}
          title="Source data or unknown issue"
        />
      </div>

      <div className="mt-5 grid gap-3">
        {problemSources.length > 0 ? (
          problemSources.map((source) => (
            <SourceRecoveryCard key={source.id} source={source} />
          ))
        ) : (
          <Alert>
            <AlertTitle>No source issues need action right now.</AlertTitle>
            <AlertDescription>
              Retry and reconnect controls stay available on each source panel
              when you need them.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <Button asChild className="mt-4 w-full sm:w-fit" variant="outline">
        <a
          href="mailto:support@lifeline.local?subject=Lifeline%20import%20support&body=Source%20type%3A%20%0AIssue%20category%3A%20%0AAffected%20area%3A%20import%20staging%20or%20sync%0A%0APlease%20do%20not%20include%20note%20content%2C%20reflection%20text%2C%20timeline%20content%2C%20or%20detailed%20activity%20data%20unless%20you%20choose%20to."
        >
          <LifeBuoy aria-hidden="true" className="size-4" />
          Contact support without private content
        </a>
      </Button>
    </section>
  );
}

function IssueCategory({
  description,
  icon,
  title,
}: {
  description: string;
  icon: ReactNode;
  title: string;
}) {
  return (
    <div className="rounded-md border border-border bg-background p-3">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        {icon}
        {title}
      </div>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function SourceRecoveryCard({ source }: { source: ImportSourceSummary }) {
  const [ignoreState, ignoreAction, isIgnoring] = useActionState(
    ignoreImportSourceIssueAction,
    initialSourceRecoveryState,
  );
  const [disconnectState, disconnectAction, isDisconnecting] = useActionState(
    disconnectImportSourceAction,
    initialSourceRecoveryState,
  );
  const result = ignoreState.result ?? disconnectState.result;

  return (
    <article className="rounded-md border border-warning/40 bg-warning/10 p-3">
      <p className="text-sm font-semibold text-foreground">
        {source.displayName}
      </p>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">
        Status: {source.connectionStatus.replaceAll("_", " ")}. Affected area:
        import staging and source sync. Timeline content and account access are not changed by this recovery panel.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button asChild variant="outline">
          <a href={source.sourceType === "rescuetime" ? "#rescuetime" : "#notes"}>
            <RefreshCw aria-hidden="true" className="size-4" />
            Retry or reconnect
          </a>
        </Button>
        <form action={ignoreAction}>
          <input name="sourceId" type="hidden" value={source.id} />
          <Button disabled={isIgnoring} type="submit" variant="outline">
            <Ban aria-hidden="true" className="size-4" />
            {isIgnoring ? "Ignoring..." : "Ignore issue"}
          </Button>
        </form>
        <form action={disconnectAction}>
          <input name="sourceId" type="hidden" value={source.id} />
          <Button disabled={isDisconnecting} type="submit" variant="outline">
            <Wifi aria-hidden="true" className="size-4" />
            {isDisconnecting ? "Disconnecting..." : "Disconnect source"}
          </Button>
        </form>
      </div>
      {result ? (
        result.ok ? (
          <Alert className="mt-3" variant="success">
            <AlertTitle>Source recovery saved.</AlertTitle>
            <AlertDescription>
              Staged records were not deleted or promoted.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="mt-3" variant="warning">
            <AlertTitle>Source stayed unchanged.</AlertTitle>
            <AlertDescription>{result.error.message}</AlertDescription>
          </Alert>
        )
      ) : null}
    </article>
  );
}
