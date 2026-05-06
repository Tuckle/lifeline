export type ImportSourceType = "rescuetime" | "notes";

export type ImportSourceConnectionStatus =
  | "not_connected"
  | "connected"
  | "needs_reconnect"
  | "disconnected"
  | "failed";

export type ImportRecordLifecycleState =
  | "staged"
  | "attached"
  | "promoted"
  | "hidden"
  | "discarded"
  | "deleted";

export type ImportRecordSyncStatus =
  | "pending"
  | "succeeded"
  | "partial"
  | "failed"
  | "duplicate";

export type ImportSourceSummary = {
  id: string;
  sourceType: ImportSourceType;
  displayName: string;
  connectionStatus: ImportSourceConnectionStatus;
  lastSyncedAt: string | null;
  sourceMetadata: Record<string, unknown>;
  stagedRecordCount: number;
};

export type ImportRecordSummary = {
  id: string;
  sourceId: string | null;
  sourceType: ImportSourceType;
  sourceLabel: string;
  contentSummary: string;
  sourceMetadata: Record<string, unknown>;
  occurredAt: string | null;
  periodStartedAt: string | null;
  periodEndedAt: string | null;
  importedAt: string;
  lifecycleState: ImportRecordLifecycleState;
  syncStatus: ImportRecordSyncStatus;
  suggestedDateLabel: string | null;
  suggestedTimelineEventId: string | null;
};

export type ImportAttachTimelineEventOption = {
  id: string;
  title: string;
  dateLabel: string | null;
};
