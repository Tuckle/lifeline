import { ErrorCodes } from "@/lib/errors";

type ImportLogContext = {
  sourceType?: string;
  sourceId?: string;
  recordId?: string;
  syncStatus?: string;
  technicalContext?: Record<string, string | number | boolean | null | undefined>;
};

export function logImportError(
  errorCode: keyof typeof ErrorCodes,
  context: ImportLogContext,
) {
  const stableCode = ErrorCodes[errorCode];

  console.error("import_error", {
    code: stableCode,
    sourceType: context.sourceType,
    sourceId: context.sourceId,
    recordId: context.recordId,
    syncStatus: context.syncStatus,
    technicalContext: context.technicalContext,
  });
}
