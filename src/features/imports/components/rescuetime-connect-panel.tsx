"use client";

import { useActionState } from "react";
import { RefreshCw, TimerReset } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  connectRescueTimeFormAction,
  importRescueTimeAction,
  initialRescueTimeConnectState,
  initialRescueTimeImportState,
} from "@/features/imports/actions/rescuetime-import";

export function RescueTimeConnectPanel() {
  const [connectState, connectAction, isConnecting] = useActionState(
    connectRescueTimeFormAction,
    initialRescueTimeConnectState,
  );
  const [importState, importAction, isImporting] = useActionState(
    importRescueTimeAction,
    initialRescueTimeImportState,
  );

  return (
    <section
      aria-labelledby="rescuetime-connect-heading"
      className="rounded-md border border-border bg-card p-5 text-card-foreground shadow-soft"
      id="rescuetime"
    >
      <p className="text-sm font-medium text-muted-foreground">
        RescueTime import
      </p>
      <h2
        className="mt-2 text-section-title font-semibold text-foreground"
        id="rescuetime-connect-heading"
      >
        Connect activity context.
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Lifeline reads hourly RescueTime productivity summaries through a
        server-side API key. Imported records stay staged here until you attach,
        promote, hide, or discard them in later curation steps.
      </p>

      <form action={connectAction} className="mt-4">
        <Button disabled={isConnecting} type="submit" variant="outline">
          <TimerReset aria-hidden="true" className="size-4" />
          {isConnecting ? "Connecting..." : "Connect RescueTime"}
        </Button>
      </form>
      <ResultAlert result={connectState.result} successTitle="RescueTime connected." />

      <form action={importAction} className="mt-5 grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="rescuetime-from">Import from</Label>
            <Input
              defaultValue={importState.values.fromDate}
              id="rescuetime-from"
              name="fromDate"
              type="date"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="rescuetime-to">Import to</Label>
            <Input
              defaultValue={importState.values.toDate}
              id="rescuetime-to"
              name="toDate"
              type="date"
            />
          </div>
        </div>
        <Button disabled={isImporting} type="submit">
          <RefreshCw aria-hidden="true" className="size-4" />
          {isImporting ? "Importing..." : "Import RescueTime range"}
        </Button>
      </form>
      <ResultAlert
        result={importState.result}
        successTitle={`Imported ${importState.result?.ok ? (importState.result.data.importedCount ?? 0) : 0} RescueTime records.`}
      />
    </section>
  );
}

function ResultAlert({
  result,
  successTitle,
}: {
  result?: { ok: true; data: unknown } | { ok: false; error: { message: string } };
  successTitle: string;
}) {
  if (!result) return null;

  return result.ok ? (
    <Alert className="mt-4" variant="success">
      <AlertTitle>{successTitle}</AlertTitle>
      <AlertDescription>
        Review the staged records below before they become part of your life-line.
      </AlertDescription>
    </Alert>
  ) : (
    <Alert className="mt-4" variant="warning">
      <AlertTitle>RescueTime needs attention.</AlertTitle>
      <AlertDescription>
        {result.error.message} You can retry, reconnect after checking the
        server key, or ignore this for now.
      </AlertDescription>
    </Alert>
  );
}
