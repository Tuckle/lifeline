"use client";

import { useEffect, useMemo, useState } from "react";
import { HardDrive, Save, Trash2 } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const OFFLINE_MEMORY_DRAFTS_KEY = "lifeline:offline-memory-drafts";

type OfflineSyncStatus =
  | "local_only"
  | "sync_pending"
  | "synced"
  | "conflict"
  | "failed";

const offlineStatusLabels = {
  local_only: "Local only",
  sync_pending: "Sync pending",
  synced: "Synced",
  conflict: "Conflict",
  failed: "Failed",
} satisfies Record<OfflineSyncStatus, string>;

type OfflineDraft = {
  id: string;
  title: string;
  datePrecision: "exact" | "period" | "unknown";
  exactDate: string;
  periodLabel: string;
  createdAt: string;
  syncStatus: OfflineSyncStatus;
};

type OfflineDraftFields = Pick<
  OfflineDraft,
  "datePrecision" | "exactDate" | "periodLabel" | "title"
>;

type DraftErrors = Record<string, string | undefined>;

type DraftEdits = Record<string, OfflineDraftFields | undefined>;

export function OfflineMemoryDraftPanel() {
  const [drafts, setDrafts] = useState<OfflineDraft[]>(() =>
    typeof window === "undefined" ? [] : readOfflineDrafts(),
  );
  const [title, setTitle] = useState("");
  const [datePrecision, setDatePrecision] =
    useState<OfflineDraft["datePrecision"]>("unknown");
  const [exactDate, setExactDate] = useState("");
  const [periodLabel, setPeriodLabel] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [draftErrors, setDraftErrors] = useState<DraftErrors>({});
  const [draftEdits, setDraftEdits] = useState<DraftEdits>({});
  const [isOnline, setIsOnline] = useState(() =>
    typeof navigator === "undefined" ? true : navigator.onLine,
  );

  useEffect(() => {
    function updateOnlineState() {
      setIsOnline(navigator.onLine);
    }

    window.addEventListener("online", updateOnlineState);
    window.addEventListener("offline", updateOnlineState);

    return () => {
      window.removeEventListener("online", updateOnlineState);
      window.removeEventListener("offline", updateOnlineState);
    };
  }, []);

  const statusLabel = useMemo(
    () => (isOnline ? "Online, local draft available" : "Offline, local only"),
    [isOnline],
  );

  function saveDraft() {
    setError(null);
    const validationError = validateDraftFields({
      datePrecision,
      exactDate,
      periodLabel,
      title,
    });

    if (validationError) {
      setError(validationError);
      return;
    }

    const nextDraft: OfflineDraft = {
      id: crypto.randomUUID(),
      title: title.trim(),
      datePrecision,
      exactDate,
      periodLabel: periodLabel.trim(),
      createdAt: new Date().toISOString(),
      syncStatus: "local_only",
    };
    const nextDrafts = [nextDraft, ...drafts];

    try {
      saveOfflineDrafts(nextDrafts);
      setDrafts(nextDrafts);
      setTitle("");
      setDatePrecision("unknown");
      setExactDate("");
      setPeriodLabel("");
    } catch {
      setError(
        "This device could not store the draft. Keep this page open, check browser storage, and try again.",
      );
    }
  }

  function deleteDraft(id: string) {
    const nextDrafts = drafts.filter((draft) => draft.id !== id);

    try {
      saveOfflineDrafts(nextDrafts);
      setDrafts(nextDrafts);
      setDraftErrors((current) => ({ ...current, [id]: undefined }));
      setDraftEdits((current) => ({ ...current, [id]: undefined }));
    } catch {
      setError("This draft could not be removed locally yet. Try again.");
    }
  }

  function updateDraftEdit(
    id: string,
    fallback: OfflineDraft,
    field: keyof OfflineDraftFields,
    value: string,
  ) {
    setDraftEdits((current) => ({
      ...current,
      [id]: {
        datePrecision: fallback.datePrecision,
        exactDate: fallback.exactDate,
        periodLabel: fallback.periodLabel,
        title: fallback.title,
        ...current[id],
        [field]: value,
      },
    }));
  }

  function saveDraftEdit(draft: OfflineDraft) {
    const edit = draftEdits[draft.id] ?? draft;
    const validationError = validateDraftFields(edit);

    if (validationError) {
      setDraftErrors((current) => ({
        ...current,
        [draft.id]: validationError,
      }));
      return;
    }

    const nextDrafts = drafts.map((item) =>
      item.id === draft.id
        ? {
            ...item,
            datePrecision: edit.datePrecision,
            exactDate: edit.exactDate,
            periodLabel: edit.periodLabel.trim(),
            syncStatus: "local_only" as const,
            title: edit.title.trim(),
          }
        : item,
    );

    try {
      saveOfflineDrafts(nextDrafts);
      setDrafts(nextDrafts);
      setDraftErrors((current) => ({ ...current, [draft.id]: undefined }));
      setDraftEdits((current) => ({ ...current, [draft.id]: undefined }));
    } catch {
      setDraftErrors((current) => ({
        ...current,
        [draft.id]:
          "This device could not update the draft. Your edits are still visible here; check browser storage and try again.",
      }));
    }
  }

  return (
    <section
      aria-labelledby="offline-draft-heading"
      className="rounded-md border border-border bg-card p-5 text-card-foreground shadow-soft sm:p-8"
    >
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">Offline draft</Badge>
        <Badge variant="outline">{statusLabel}</Badge>
      </div>
      <h2
        className="mt-3 text-section-title font-semibold text-foreground"
        id="offline-draft-heading"
      >
        Capture a memory on this device.
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        This saves only the mandatory draft fields locally: title and your best
        date placement. It does not sync imports, media, or reflections yet.
      </p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Full enrichment, media upload, import sync, and reflection sync require
        connectivity. Mandatory draft editing stays available locally.
      </p>

      <div className="mt-5 grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="offline-draft-title">Draft title</Label>
          <Input
            id="offline-draft-title"
            onChange={(event) => setTitle(event.target.value)}
            placeholder="A memory to place later"
            value={title}
          />
        </div>

        <fieldset className="grid gap-2">
          <legend className="text-sm font-medium text-foreground">
            Draft date
          </legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {[
              ["exact", "Exact date"],
              ["period", "Approximate period"],
              ["unknown", "Unknown for now"],
            ].map(([value, label]) => (
              <label
                className="flex min-h-11 items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm"
                key={value}
              >
                <input
                  checked={datePrecision === value}
                  name="offlineDatePrecision"
                  onChange={() =>
                    setDatePrecision(value as OfflineDraft["datePrecision"])
                  }
                  type="radio"
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        {datePrecision === "exact" ? (
          <div className="grid gap-2">
            <Label htmlFor="offline-draft-exact-date">Exact date</Label>
            <Input
              id="offline-draft-exact-date"
              onChange={(event) => setExactDate(event.target.value)}
              type="date"
              value={exactDate}
            />
          </div>
        ) : null}

        {datePrecision === "period" ? (
          <div className="grid gap-2">
            <Label htmlFor="offline-draft-period">Approximate period</Label>
            <Input
              id="offline-draft-period"
              onChange={(event) => setPeriodLabel(event.target.value)}
              placeholder="That winter, early 2024, childhood summer..."
              value={periodLabel}
            />
          </div>
        ) : null}

        {error ? (
          <Alert variant="warning">
            <AlertTitle>Draft not saved yet</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <Button className="w-full sm:w-fit" onClick={saveDraft} type="button">
          <HardDrive aria-hidden="true" className="size-4" />
          Save local draft
        </Button>
      </div>

      <div className="mt-6 grid gap-3">
        <p className="text-sm font-medium text-muted-foreground">
          Local draft area
        </p>
        <div className="rounded-md border border-border bg-background p-3 text-sm leading-6 text-muted-foreground">
          Shared offline labels: Local only, Sync pending, Synced, Conflict, and
          Failed. Story 5.2 keeps drafts local only until sync stories add server
          behavior.
        </div>
        {drafts.length > 0 ? (
          drafts.map((draft) => {
            const edit = draftEdits[draft.id] ?? draft;

            return (
              <article
                className="rounded-md border border-border bg-background p-3"
                key={draft.id}
              >
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">
                    {offlineStatusLabels[draft.syncStatus]}
                  </Badge>
                  <Badge variant="outline">Unsynced</Badge>
                </div>
                <h3 className="mt-3 text-sm font-semibold text-foreground">
                  {draft.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {getDraftDateLabel(draft)}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Saved on this device. This is not a synced timeline event yet.
                </p>

                <details className="mt-3 rounded-md border border-border bg-card p-3">
                  <summary className="min-h-11 cursor-pointer text-sm font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                    Edit mandatory fields
                  </summary>
                  <div className="mt-3 grid gap-3">
                    <div className="grid gap-2">
                      <Label htmlFor={`offline-edit-title-${draft.id}`}>
                        Draft title
                      </Label>
                      <Input
                        id={`offline-edit-title-${draft.id}`}
                        onChange={(event) =>
                          updateDraftEdit(
                            draft.id,
                            draft,
                            "title",
                            event.target.value,
                          )
                        }
                        value={edit.title}
                      />
                    </div>
                    <fieldset className="grid gap-2">
                      <legend className="text-sm font-medium text-foreground">
                        Draft date
                      </legend>
                      <div className="grid gap-2 sm:grid-cols-3">
                        {[
                          ["exact", "Exact date"],
                          ["period", "Approximate period"],
                          ["unknown", "Unknown for now"],
                        ].map(([value, label]) => (
                          <label
                            className="flex min-h-11 items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm"
                            key={value}
                          >
                            <input
                              checked={edit.datePrecision === value}
                              name={`offlineEditDatePrecision-${draft.id}`}
                              onChange={() =>
                                updateDraftEdit(
                                  draft.id,
                                  draft,
                                  "datePrecision",
                                  value,
                                )
                              }
                              type="radio"
                            />
                            {label}
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    {edit.datePrecision === "exact" ? (
                      <div className="grid gap-2">
                        <Label htmlFor={`offline-edit-exact-${draft.id}`}>
                          Exact date
                        </Label>
                        <Input
                          id={`offline-edit-exact-${draft.id}`}
                          onChange={(event) =>
                            updateDraftEdit(
                              draft.id,
                              draft,
                              "exactDate",
                              event.target.value,
                            )
                          }
                          type="date"
                          value={edit.exactDate}
                        />
                      </div>
                    ) : null}

                    {edit.datePrecision === "period" ? (
                      <div className="grid gap-2">
                        <Label htmlFor={`offline-edit-period-${draft.id}`}>
                          Approximate period
                        </Label>
                        <Input
                          id={`offline-edit-period-${draft.id}`}
                          onChange={(event) =>
                            updateDraftEdit(
                              draft.id,
                              draft,
                              "periodLabel",
                              event.target.value,
                            )
                          }
                          value={edit.periodLabel}
                        />
                      </div>
                    ) : null}

                    {draftErrors[draft.id] ? (
                      <p className="text-sm text-destructive" role="alert">
                        {draftErrors[draft.id]}
                      </p>
                    ) : null}

                    <Button
                      className="w-full sm:w-fit"
                      onClick={() => saveDraftEdit(draft)}
                      type="button"
                    >
                      <Save aria-hidden="true" className="size-4" />
                      Save local changes
                    </Button>
                  </div>
                </details>

                <Button
                  className="mt-3"
                  onClick={() => deleteDraft(draft.id)}
                  type="button"
                  variant="outline"
                >
                  <Trash2 aria-hidden="true" className="size-4" />
                  Remove local draft
                </Button>
              </article>
            );
          })
        ) : (
          <p className="rounded-md border border-dashed border-border bg-background p-3 text-sm text-muted-foreground">
            No local drafts on this device yet.
          </p>
        )}
      </div>
    </section>
  );
}

function readOfflineDrafts() {
  try {
    const raw = window.localStorage.getItem(OFFLINE_MEMORY_DRAFTS_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as OfflineDraft[]) : [];
  } catch {
    return [];
  }
}

function saveOfflineDrafts(drafts: OfflineDraft[]) {
  window.localStorage.setItem(OFFLINE_MEMORY_DRAFTS_KEY, JSON.stringify(drafts));
}

function validateDraftFields(values: OfflineDraftFields) {
  if (!values.title.trim()) {
    return "Add a title before saving this local draft.";
  }

  if (values.datePrecision === "exact" && !values.exactDate) {
    return "Choose the exact date or switch to an approximate period.";
  }

  if (values.datePrecision === "period" && !values.periodLabel.trim()) {
    return "Name the approximate period or choose unknown for now.";
  }

  return null;
}

function getDraftDateLabel(draft: OfflineDraft) {
  if (draft.datePrecision === "exact" && draft.exactDate) {
    return draft.exactDate;
  }

  if (draft.datePrecision === "period" && draft.periodLabel) {
    return draft.periodLabel;
  }

  return "Date unknown for now";
}
