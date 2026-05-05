export const ErrorCodes = {
  permissionDenied: "permission_denied",
  timelineEventNotFound: "timeline_event_not_found",
  importAuthFailed: "import_auth_failed",
  offlineConflict: "offline_conflict",
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];
