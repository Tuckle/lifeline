"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { HardDrive, Save, Send, Trash2 } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  initialOfflineDraftConflictResolutionState,
  initialOfflineDraftSyncState,
  resolveOfflineDraftConflictAction,
  syncOfflineDraftAction,
} from "@/features/offline/actions/sync-offline-draft";

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

  function updateDraftSyncStatus(id: string, syncStatus: OfflineSyncStatus) {
    const nextDrafts = drafts.map((draft) =>
      draft.id === id ? { ...draft, syncStatus } : draft,
    );

    try {
      saveOfflineDrafts(nextDrafts);
      setDrafts(nextDrafts);
    } catch {
      setError("This draft synced, but the local status could not be updated.");
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
          Failed. When connectivity returns, sync each draft independently so
          one failed draft does not block the others.
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
                <OfflineDraftSyncControl
                  draft={draft}
                  isOnline={isOnline}
                  onDelete={deleteDraft}
                  onStatusChange={updateDraftSyncStatus}
                />
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

function OfflineDraftSyncControl({
  draft,
  isOnline,
  onDelete,
  onStatusChange,
}: {
  draft: OfflineDraft;
  isOnline: boolean;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: OfflineSyncStatus) => void;
}) {
  const [state, action, isPending] = useActionState(
    syncOfflineDraftAction,
    initialOfflineDraftSyncState,
  );
  const [resolutionState, resolutionAction, isResolving] = useActionState(
    resolveOfflineDraftConflictAction,
    initialOfflineDraftConflictResolutionState,
  );
  const handledResult = useRef<typeof state.result>(undefined);
  const handledResolutionResult = useRef<typeof resolutionState.result>(undefined);
  const [hiddenConflictId, setHiddenConflictId] = useState<string | null>(null);
  const result = state.result;
  const conflict = state.conflict;
  const resolutionResult = resolutionState.result;

  useEffect(() => {
    if (!result || handledResult.current === result) return;

    handledResult.current = result;
    onStatusChange(
      draft.id,
      result.ok
        ? "synced"
        : result.error.code === "offline_conflict"
          ? "conflict"
          : "failed",
    );
  }, [draft.id, onStatusChange, result]);

  useEffect(() => {
    if (!resolutionResult || handledResolutionResult.current === resolutionResult) {
      return;
    }

    handledResolutionResult.current = resolutionResult;
    onStatusChange(draft.id, resolutionResult.ok ? "synced" : "failed");
  }, [draft.id, onStatusChange, resolutionResult]);

  const currentStatus = isPending || isResolving ? "sync_pending" : draft.syncStatus;
  const isConflictReviewHidden =
    conflict?.server.timelineEventId === hiddenConflictId;
  const syncButtonLabel =
    draft.syncStatus === "failed" || draft.syncStatus === "conflict"
      ? "Retry sync"
      : "Sync local draft";

  return (
    <div className="mt-3 rounded-md border border-border bg-card p-3">
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline">{offlineStatusLabels[currentStatus]}</Badge>
        {result?.ok ? <Badge variant="outline">Timeline event created</Badge> : null}
      </div>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Sync creates a normal private timeline event for this signed-in account.
        The draft identity is saved as source metadata to avoid duplicate events
        when possible.
      </p>
      <form action={action} className="mt-3">
        <input name="draftId" type="hidden" value={draft.id} />
        <input name="title" type="hidden" value={draft.title} />
        <input name="datePrecision" type="hidden" value={draft.datePrecision} />
        <input name="exactDate" type="hidden" value={draft.exactDate} />
        <input name="periodLabel" type="hidden" value={draft.periodLabel} />
        <Button
          disabled={!isOnline || isPending || draft.syncStatus === "synced"}
          type="submit"
          variant="outline"
        >
          <Send aria-hidden="true" className="size-4" />
          {isPending ? "Sync pending..." : syncButtonLabel}
        </Button>
      </form>
      {!isOnline ? (
        <p className="mt-2 text-sm text-muted-foreground">
          Connect to the internet before syncing this local draft.
        </p>
      ) : null}
      {result && !result.ok ? (
        <p className="mt-2 text-sm text-destructive" role="alert">
          {result.error.message}
        </p>
      ) : null}
      {conflict && !isConflictReviewHidden ? (
        <div className="mt-3 rounded-md border border-border bg-background p-3">
          <p className="text-sm font-medium text-foreground">
            Review conflict before choosing.
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border border-border p-3">
              <p className="text-sm font-medium text-foreground">Local draft</p>
              <p className="mt-2 text-sm text-muted-foreground">{draft.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {getDraftDateLabel(draft)}
              </p>
            </div>
            <div className="rounded-md border border-border p-3">
              <p className="text-sm font-medium text-foreground">
                Timeline version
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {conflict.server.title}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {getServerDateLabel(conflict.server)}
              </p>
            </div>
          </div>
          <form action={resolutionAction} className="mt-3 flex flex-wrap gap-2">
            <input name="draftId" type="hidden" value={draft.id} />
            <input
              name="timelineEventId"
              type="hidden"
              value={conflict.server.timelineEventId}
            />
            <input name="title" type="hidden" value={draft.title} />
            <input
              name="datePrecision"
              type="hidden"
              value={draft.datePrecision}
            />
            <input name="exactDate" type="hidden" value={draft.exactDate} />
            <input name="periodLabel" type="hidden" value={draft.periodLabel} />
            <Button
              disabled={!isOnline || isResolving}
              name="resolution"
              type="submit"
              value="keep_local"
              variant="outline"
            >
              Keep local version
            </Button>
            <Button
              disabled={!isOnline || isResolving}
              name="resolution"
              type="submit"
              value="use_server"
              variant="outline"
            >
              Use server version
            </Button>
            <Button
              onClick={() =>
                setHiddenConflictId(conflict.server.timelineEventId)
              }
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              onClick={() => onDelete(draft.id)}
              type="button"
              variant="outline"
            >
              <Trash2 aria-hidden="true" className="size-4" />
              Delete/discard local draft
            </Button>
          </form>
          {resolutionResult && !resolutionResult.ok ? (
            <p className="mt-2 text-sm text-destructive" role="alert">
              {resolutionResult.error.message}
            </p>
          ) : null}
        </div>
      ) : null}
      {conflict && isConflictReviewHidden ? (
        <div className="mt-3 rounded-md border border-border bg-background p-3">
          <p className="text-sm text-muted-foreground">
            Conflict review paused. The local draft is still saved.
          </p>
          <Button
            className="mt-2"
            onClick={() => setHiddenConflictId(null)}
            type="button"
            variant="outline"
          >
            Review conflict
          </Button>
        </div>
      ) : null}
      {result?.ok ? (
        <p className="mt-2 text-sm text-muted-foreground">
          Synced. It will appear on the timeline in the correct date position.
        </p>
      ) : null}
      {resolutionResult?.ok ? (
        <p className="mt-2 text-sm text-muted-foreground">
          Conflict resolved. The selected version is now the timeline version.
        </p>
      ) : null}
    </div>
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

function getServerDateLabel(server: {
  approximateDateLabel: string | null;
  occurredOn: string | null;
}) {
  return server.approximateDateLabel ?? server.occurredOn ?? "Date unknown for now";
}
