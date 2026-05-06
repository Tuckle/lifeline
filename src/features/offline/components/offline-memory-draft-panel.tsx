"use client";

import { useEffect, useMemo, useState } from "react";
import { HardDrive, Trash2 } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const OFFLINE_MEMORY_DRAFTS_KEY = "lifeline:offline-memory-drafts";

type OfflineDraft = {
  id: string;
  title: string;
  datePrecision: "exact" | "period" | "unknown";
  exactDate: string;
  periodLabel: string;
  createdAt: string;
  syncStatus: "local_only";
};

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

    if (!title.trim()) {
      setError("Add a title before saving a local draft.");
      return;
    }

    if (datePrecision === "exact" && !exactDate) {
      setError("Choose the exact date or switch to an approximate period.");
      return;
    }

    if (datePrecision === "period" && !periodLabel.trim()) {
      setError("Name the approximate period or choose unknown for now.");
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
      window.localStorage.setItem(
        OFFLINE_MEMORY_DRAFTS_KEY,
        JSON.stringify(nextDrafts),
      );
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
      window.localStorage.setItem(
        OFFLINE_MEMORY_DRAFTS_KEY,
        JSON.stringify(nextDrafts),
      );
      setDrafts(nextDrafts);
    } catch {
      setError("This draft could not be removed locally yet. Try again.");
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
        {drafts.length > 0 ? (
          drafts.map((draft) => (
            <article
              className="rounded-md border border-border bg-background p-3"
              key={draft.id}
            >
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Local only</Badge>
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
          ))
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

function getDraftDateLabel(draft: OfflineDraft) {
  if (draft.datePrecision === "exact" && draft.exactDate) {
    return draft.exactDate;
  }

  if (draft.datePrecision === "period" && draft.periodLabel) {
    return draft.periodLabel;
  }

  return "Date unknown for now";
}
