import { ErrorCodes } from "@/lib/errors";

type OfflineSyncLogContext = {
  draftId?: string;
  errorCode: keyof typeof ErrorCodes;
  syncStatus?: string;
  technicalContext?: Record<string, string | number | boolean | null | undefined>;
};

export function logOfflineSyncError(context: OfflineSyncLogContext) {
  console.error("offline_sync_error", {
    code: ErrorCodes[context.errorCode],
    draftId: context.draftId,
    syncStatus: context.syncStatus,
    technicalContext: context.technicalContext,
  });
}
