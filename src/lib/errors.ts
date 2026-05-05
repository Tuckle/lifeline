export const ErrorCodes = {
  permissionDenied: "permission_denied",
  validationFailed: "validation_failed",
  timelineEventCreateFailed: "timeline_event_create_failed",
  timelineEventNotFound: "timeline_event_not_found",
  importAuthFailed: "import_auth_failed",
  offlineConflict: "offline_conflict",
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];
