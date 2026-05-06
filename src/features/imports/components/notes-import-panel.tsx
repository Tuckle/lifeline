"use client";

import { useActionState } from "react";
import { FileText, Upload } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  importNotesAction,
  initialNotesImportState,
} from "@/features/imports/actions/notes-import";

export function NotesImportPanel() {
  const [state, action, isImporting] = useActionState(
    importNotesAction,
    initialNotesImportState,
  );

  return (
    <section
      aria-labelledby="notes-import-heading"
      className="rounded-md border border-border bg-card p-5 text-card-foreground shadow-soft"
      id="notes"
    >
      <p className="text-sm font-medium text-muted-foreground">Notes import</p>
      <h2
        className="mt-2 text-section-title font-semibold text-foreground"
        id="notes-import-heading"
      >
        Import written context.
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        MVP notes import supports copied text or an exported plain-text/Markdown
        note. Lifeline copies the content into your private staged records; it
        does not connect to Notion or Google Keep yet, and notes do not become
        timeline memories automatically.
      </p>

      <div className="mt-4 rounded-md border border-dashed border-border bg-background p-3 text-sm leading-6 text-muted-foreground">
        <div className="flex items-start gap-2">
          <FileText aria-hidden="true" className="mt-1 size-4 shrink-0" />
          <p>
            Use one note per block. Put an optional <code>Date: YYYY-MM-DD</code>{" "}
            line anywhere in the block. Separate multiple notes with{" "}
            <code>---</code>. Notes without a date are staged with date review needed.
          </p>
        </div>
      </div>

      <form action={action} className="mt-5 grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="notes-source-name">Source name</Label>
          <Input
            defaultValue={state.values.sourceName}
            id="notes-source-name"
            name="sourceName"
            placeholder="Notion export, Google Keep export, weekly notes..."
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="notes-text">Copied notes or export text</Label>
          <Textarea
            defaultValue={state.values.notesText}
            id="notes-text"
            name="notesText"
            placeholder={"Date: 2024-03-12\nA note title\nWhat I wrote at the time...\n---\nUndated thought\nSomething I want to place later..."}
            rows={9}
          />
        </div>

        <Button disabled={isImporting} type="submit">
          <Upload aria-hidden="true" className="size-4" />
          {isImporting ? "Importing..." : "Import notes to staging"}
        </Button>
      </form>

      <ResultAlert result={state.result} />
    </section>
  );
}

function ResultAlert({
  result,
}: {
  result?:
    | { ok: true; data: { importedCount: number; failedCount: number } }
    | { ok: false; error: { message: string } };
}) {
  if (!result) return null;

  return result.ok ? (
    <Alert className="mt-4" variant={result.data.failedCount > 0 ? "warning" : "success"}>
      <AlertTitle>
        Imported {result.data.importedCount} notes
        {result.data.failedCount > 0 ? `, skipped ${result.data.failedCount}` : ""}.
      </AlertTitle>
      <AlertDescription>
        Successful notes are staged below. Retry skipped blocks, ignore them, or
        use support guidance if the export format keeps failing.
      </AlertDescription>
    </Alert>
  ) : (
    <Alert className="mt-4" variant="warning">
      <AlertTitle>Notes need attention.</AlertTitle>
      <AlertDescription>
        {result.error.message} You can retry this paste, ignore it for now, or
        ask for support if the export format is unclear.
      </AlertDescription>
    </Alert>
  );
}
