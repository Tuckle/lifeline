export const ErrorCodes = {
  permissionDenied: "permission_denied",
  validationFailed: "validation_failed",
  timelineEventCreateFailed: "timeline_event_create_failed",
  timelineEventUpdateFailed: "timeline_event_update_failed",
  timelineEventHideFailed: "timeline_event_hide_failed",
  timelineEventDeleteFailed: "timeline_event_delete_failed",
  timelineEventNotFound: "timeline_event_not_found",
  timelineSearchFailed: "timeline_search_failed",
  futureIntentionSaveFailed: "future_intention_save_failed",
  reflectionSessionSaveFailed: "reflection_session_save_failed",
  reflectionPatternSaveFailed: "reflection_pattern_save_failed",
  importAuthFailed: "import_auth_failed",
  offlineConflict: "offline_conflict",
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];
