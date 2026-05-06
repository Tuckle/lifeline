import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();

const requiredPaths = [
  "package.json",
  ".env.example",
  ".gitignore",
  "README.md",
  ".github/workflows/ci.yml",
  "src/proxy.ts",
  "src/app",
  "src/app/(workspace)/timeline/page.tsx",
  "src/features/timeline/components/empty-memory-atlas-timeline.tsx",
  "src/features/timeline/components/importance-control.tsx",
  "src/features/timeline/components/life-line-timeline.tsx",
  "src/features/timeline/components/memory-atlas-card.tsx",
  "src/features/timeline/queries/list-timeline-events.ts",
  "src/features/timeline/queries/search-timeline.ts",
  "src/features/reviews/components/period-review-selector.tsx",
  "src/features/reviews/components/period-review-surface.tsx",
  "src/features/reviews/components/pattern-clarity-panel.tsx",
  "src/features/reviews/components/product-boundary-note.tsx",
  "src/features/reviews/components/reflection-session-form.tsx",
  "src/features/reviews/queries/get-period-review.ts",
  "src/features/reviews/queries/get-reflection-patterns.ts",
  "src/features/reviews/queries/get-reflection-session.ts",
  "src/features/reviews/actions/save-reflection-pattern.ts",
  "src/features/reviews/actions/save-reflection-session.ts",
  "src/features/reviews/schemas/reflection-pattern-form.ts",
  "src/features/reviews/schemas/reflection-session-form.ts",
  "src/features/imports/components/import-review-surface.tsx",
  "src/features/imports/components/import-recovery-panel.tsx",
  "src/features/imports/components/import-staging-card.tsx",
  "src/features/imports/components/import-record-curation-actions.tsx",
  "src/features/imports/components/notes-import-panel.tsx",
  "src/features/imports/components/rescuetime-connect-panel.tsx",
  "src/features/imports/actions/curate-import-record.ts",
  "src/features/imports/actions/notes-import.ts",
  "src/features/imports/actions/rescuetime-import.ts",
  "src/features/imports/actions/source-recovery.ts",
  "src/features/imports/notes/parse-notes-export.ts",
  "src/features/imports/queries/list-import-review.ts",
  "src/features/imports/logger.ts",
  "src/features/imports/rescuetime/client.ts",
  "src/features/imports/types.ts",
  "src/features/offline/logger.ts",
  "src/features/timeline/types.ts",
  "src/app/(workspace)/add/page.tsx",
  "src/features/timeline/actions/create-timeline-event.ts",
  "src/features/timeline/actions/manage-timeline-event.ts",
  "src/features/timeline/actions/manage-future-intention.ts",
  "src/features/timeline/components/future-intention-card.tsx",
  "src/features/timeline/components/future-intention-form.tsx",
  "src/features/timeline/components/memory-creation-form.tsx",
  "src/features/timeline/components/memory-detail-panel.tsx",
  "src/features/timeline/schemas/timeline-event-form.ts",
  "src/features/timeline/schemas/future-intention-form.ts",
  "src/features/offline/actions/sync-offline-draft.ts",
  "src/features/offline/components/offline-memory-draft-panel.tsx",
  "src/app/(workspace)/imports/page.tsx",
  "src/app/(workspace)/reflect/page.tsx",
  "src/app/(workspace)/search/page.tsx",
  "src/app/(workspace)/settings/page.tsx",
  "src/components/layout/workspace-shell.tsx",
  "src/components/layout/workspace-navigation.tsx",
  "src/components/ui",
  "src/components/ui/alert.tsx",
  "src/components/ui/dialog.tsx",
  "src/components/ui/sheet.tsx",
  "src/components/ui/sonner.tsx",
  "src/components/ui/textarea.tsx",
  "src/components/layout",
  "src/features/auth",
  "src/features/timeline",
  "src/features/imports",
  "src/features/reviews",
  "src/features/settings",
  "src/features/settings/actions/delete-imported-data.ts",
  "src/features/settings/actions/export-lifeline-data.ts",
  "src/features/settings/components/privacy-data-section.tsx",
  "src/features/settings/queries/get-privacy-data-summary.ts",
  "src/features/offline",
  "src/app/auth/callback/route.ts",
  "src/features/auth/require-workspace-user.ts",
  "src/lib/action-result.ts",
  "src/lib/supabase",
  "supabase/migrations/20260505182600_create_timeline_events.sql",
  "supabase/migrations/20260505201400_add_photo_references_to_timeline_events.sql",
  "supabase/migrations/20260505210800_create_future_intentions.sql",
  "supabase/migrations/20260506102400_create_review_sessions.sql",
  "supabase/migrations/20260506103600_create_reflection_patterns.sql",
  "supabase/migrations/20260506104900_create_future_intention_links.sql",
  "supabase/migrations/20260506104700_create_import_staging.sql",
  "supabase/migrations/20260506105300_add_rescuetime_import_dedupe.sql",
  "supabase/migrations/20260506154500_add_import_promotion_metadata.sql",
  "supabase/migrations",
];

const missing = requiredPaths.filter((entry) => !existsSync(path.join(root, entry)));

if (missing.length > 0) {
  throw new Error(`Missing foundation paths: ${missing.join(", ")}`);
}

const packageJson = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
const scripts = packageJson.scripts ?? {};
const requiredScripts = ["dev", "lint", "typecheck", "smoke", "test"];
const missingScripts = requiredScripts.filter((script) => !scripts[script]);

if (missingScripts.length > 0) {
  throw new Error(`Missing package scripts: ${missingScripts.join(", ")}`);
}

for (const [dependency, expectedVersion] of Object.entries({
  "@radix-ui/react-dialog": "1.1.15",
  sonner: "2.0.7",
  zod: "4.4.3",
})) {
  if (packageJson.dependencies?.[dependency] !== expectedVersion) {
    throw new Error(`${dependency} must be pinned to ${expectedVersion}`);
  }
}

const envExample = readFileSync(path.join(root, ".env.example"), "utf8");
for (const key of [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "RESCUETIME_API_KEY",
]) {
  if (!envExample.includes(key)) {
    throw new Error(`.env.example is missing ${key}`);
  }
}

const actionResult = readFileSync(path.join(root, "src/lib/action-result.ts"), "utf8");
for (const snippet of ["ok: true", "ok: false", "code: string", "field?: string"]) {
  if (!actionResult.includes(snippet)) {
    throw new Error(`src/lib/action-result.ts is missing expected snippet: ${snippet}`);
  }
}

const ci = readFileSync(path.join(root, ".github/workflows/ci.yml"), "utf8");
for (const snippet of [
  "actions/setup-node",
  "npm ci",
  "npm run typecheck",
  "npm run lint",
  "npm test",
  "npm run build",
  "npm run smoke",
]) {
  if (!ci.includes(snippet)) {
    throw new Error(`CI workflow is missing expected snippet: ${snippet}`);
  }
}

const smokeRoutes = readFileSync(path.join(root, "scripts/smoke-routes.mjs"), "utf8");
for (const snippet of [
  "Production route smoke checks passed",
  "Missing .next build output",
  "/auth/login?next=%2Ftimeline",
  "[\"/timeline\", \"/add\", \"/imports\", \"/reflect\", \"/search\", \"/settings\"]",
  "redirect: \"manual\"",
]) {
  if (!smokeRoutes.includes(snippet)) {
    throw new Error(`Smoke route script is missing expected snippet: ${snippet}`);
  }
}

const readme = readFileSync(path.join(root, "README.md"), "utf8");
for (const snippet of [
  "/timeline",
  "/add",
  "/imports",
  "/reflect",
  "/search",
  "/settings",
  "src/features/reviews/",
  "snake_case",
  "tests near the behavior",
  "Vercel-compatible",
  "local component state",
  "Google OAuth",
  "http://localhost:3000/auth/callback",
  "Supabase backups",
]) {
  if (!readme.includes(snippet)) {
    throw new Error(`README.md is missing foundation convention: ${snippet}`);
  }
}

const loginForm = readFileSync(path.join(root, "src/components/login-form.tsx"), "utf8");
for (const snippet of [
  "Continue with Google",
  "signInWithOAuth",
  'provider: "google"',
  "/auth/callback?next=",
  "getSafeNextPath",
  "Supabase setup required",
  "private space",
]) {
  if (!loginForm.includes(snippet)) {
    throw new Error(`Google login form is missing expected snippet: ${snippet}`);
  }
}

const callbackRoute = readFileSync(
  path.join(root, "src/app/auth/callback/route.ts"),
  "utf8",
);
for (const snippet of [
  "exchangeCodeForSession",
  "error_description",
  "getSafeNextPath",
  "!next.startsWith(\"//\")",
  "/auth/error",
]) {
  if (!callbackRoute.includes(snippet)) {
    throw new Error(`OAuth callback route is missing expected snippet: ${snippet}`);
  }
}

const rootPage = readFileSync(path.join(root, "src/app/page.tsx"), "utf8");
for (const snippet of ["redirect(\"/auth/login\")", "redirect(\"/timeline\")"]) {
  if (!rootPage.includes(snippet)) {
    throw new Error(`Root route is missing auth redirect: ${snippet}`);
  }
}

const workspaceShell = readFileSync(
  path.join(root, "src/components/layout/workspace-shell.tsx"),
  "utf8",
);
for (const snippet of [
  "WorkspaceShell",
  "DesktopWorkspaceNavigation",
  "MobileWorkspaceNavigation",
  "AuthButton",
  "Private workspace",
  "lg:grid-cols",
]) {
  if (!workspaceShell.includes(snippet)) {
    throw new Error(`Workspace shell is missing expected snippet: ${snippet}`);
  }
}

const workspaceNavigation = readFileSync(
  path.join(root, "src/components/layout/workspace-navigation.tsx"),
  "utf8",
);
for (const snippet of [
  "workspaceNavItems",
  'href: "/timeline"',
  'href: "/add"',
  'href: "/imports"',
  'href: "/reflect"',
  'href: "/search"',
  'href: "/settings"',
  "usePathname",
  "aria-current",
  "min-h-11",
  "MobileWorkspaceNavigation",
]) {
  if (!workspaceNavigation.includes(snippet)) {
    throw new Error(`Workspace navigation is missing expected snippet: ${snippet}`);
  }
}

const workspaceLayout = readFileSync(
  path.join(root, "src/app/(workspace)/layout.tsx"),
  "utf8",
);
if (!workspaceLayout.includes("<WorkspaceShell>{children}</WorkspaceShell>")) {
  throw new Error("Workspace route group layout must render the shared workspace shell");
}

const protectedPage = readFileSync(path.join(root, "src/app/protected/page.tsx"), "utf8");
if (!protectedPage.includes('redirect("/timeline")')) {
  throw new Error("/protected should redirect to the Timeline workspace home");
}

const settingsPage = readFileSync(
  path.join(root, "src/app/(workspace)/settings/page.tsx"),
  "utf8",
);
for (const snippet of [
  "requireWorkspaceUser(\"/settings\")",
  "getPrivacyDataSummary",
  "PrivacyDataSection",
  "ProductBoundaryNote",
]) {
  if (!settingsPage.includes(snippet)) {
    throw new Error(`Settings page is missing expected privacy integration: ${snippet}`);
  }
}

const privacyDataSummaryQuery = readFileSync(
  path.join(root, "src/features/settings/queries/get-privacy-data-summary.ts"),
  "utf8",
);
for (const snippet of [
  "getPrivacyDataSummary",
  "ActionResult<PrivacyDataSummary>",
  "supabase.auth.getClaims",
  ".from(\"import_sources\")",
  ".from(\"import_records\")",
  ".from(\"timeline_events\")",
  ".eq(\"user_id\", userId)",
  "settingsLoadFailed",
  "hasConnectedSources",
  "source_metadata",
  "lifecycleCounts",
  "syncCounts",
  "metadataDetails",
  "permissionSummary",
  "futureAccessSummary",
  "getSafeMetadataDetails",
  "getIssueSummary",
  "getManagementActions",
]) {
  if (!privacyDataSummaryQuery.includes(snippet)) {
    throw new Error(`Privacy data summary query is missing expected snippet: ${snippet}`);
  }
}

const privacyDataSection = readFileSync(
  path.join(root, "src/features/settings/components/privacy-data-section.tsx"),
  "utf8",
);
for (const snippet of [
  "PrivacyDataSection",
  "Privacy and Data",
  "Private workspace",
  "Connected sources",
  "Source permissions",
  "Disconnect source",
  "Delete imported data",
  "Export data",
  "No connected sources",
  "Review sources",
  "Review deletion",
  "Manual memories remain separate",
  "Future source access",
  "Already imported records",
  "Aggregate record states",
  "Source metadata for export/delete decisions",
  "Open import recovery",
  "Review disconnect",
  "DisconnectSourceControl",
  "disconnectImportSourceAction",
  "initialSourceRecoveryState",
  "DialogTrigger",
  "DialogDescription",
  "Future sync and source access will stop",
  "imported records stay in Lifeline",
  "Manual memories, reflections, and future intentions are separate",
  "Disconnecting...",
  "Source disconnected",
  "DeleteImportedDataControl",
  "deleteImportedDataForSourceAction",
  "initialDeleteImportedDataState",
  "Affected scope:",
  "Future sync behavior is unchanged",
  "Promoted imported timeline events created from these records will be",
  "Attached manual memories keep their memory content",
  "Deleting imported data...",
  "No data is shown as deleted until the",
  "Deleted {state.result.data.deletedRecordCount}",
  "ExportDataControl",
  "exportLifelineDataAction",
  "initialExportLifelineDataState",
  "Generate structured export",
  "Export includes manual memories",
  "content and imported context stay clearly labeled",
  "Preparing export...",
  "Export Lifeline JSON",
  "Export failed",
  "Export completed:",
  "new Blob([result.data.jsonText]",
  "Failed {source.syncCounts.failed}",
  "Partial {source.syncCounts.partial}",
  "source.managementActions.map",
]) {
  if (!privacyDataSection.includes(snippet)) {
    throw new Error(`Privacy data section is missing expected snippet: ${snippet}`);
  }
}

const deleteImportedDataAction = readFileSync(
  path.join(root, "src/features/settings/actions/delete-imported-data.ts"),
  "utf8",
);
for (const snippet of [
  "\"use server\"",
  "deleteImportedDataForSourceAction",
  "initialDeleteImportedDataState",
  "ActionResult",
  "supabase.auth.getClaims",
  ".from(\"import_sources\")",
  ".from(\"import_records\")",
  ".from(\"timeline_events\")",
  ".eq(\"user_id\", userId)",
  "lifecycle_state: \"deleted\"",
  ".eq(\"source_type\", \"imported\")",
  ".in(\"source_import_record_id\", recordIds)",
  "importDeleteFailed",
  "logImportError",
  "revalidatePath(\"/imports\")",
  "revalidatePath(\"/settings\")",
  "revalidatePath(\"/timeline\")",
]) {
  if (!deleteImportedDataAction.includes(snippet)) {
    throw new Error(`Delete imported data action is missing expected snippet: ${snippet}`);
  }
}

if (/content_summary|source_metadata|story_text|note.*body|activity.*detail/i.test(deleteImportedDataAction)) {
  throw new Error("Delete imported data action must not log or select sensitive imported content");
}

const exportLifelineDataAction = readFileSync(
  path.join(root, "src/features/settings/actions/export-lifeline-data.ts"),
  "utf8",
);
for (const snippet of [
  "\"use server\"",
  "exportLifelineDataAction",
  "initialExportLifelineDataState",
  "ActionResult",
  "supabase.auth.getClaims",
  ".from(\"timeline_events\")",
  ".from(\"review_sessions\")",
  ".from(\"reflection_patterns\")",
  ".from(\"future_intentions\")",
  ".from(\"import_sources\")",
  ".from(\"import_records\")",
  ".from(\"reflection_pattern_timeline_events\")",
  ".from(\"future_intention_links\")",
  ".eq(\"user_id\", userId)",
  ".neq(\"status\", \"deleted\")",
  ".neq(\"lifecycle_state\", \"deleted\")",
  "source_metadata",
  "lifecycle_state",
  "source_import_record_id",
  "importance",
  "exportVersion",
  "manualContent",
  "importedContext",
  "jsonText",
  "exportFailed",
  "lifeline_export_error",
]) {
  if (!exportLifelineDataAction.includes(snippet)) {
    throw new Error(`Export Lifeline data action is missing expected snippet: ${snippet}`);
  }
}

if (/app\/api\/export|route\.ts|public\/exports|opengraph|twitter-image|preview/i.test(exportLifelineDataAction)) {
  throw new Error("Export must not create public routes, public files, metadata, or previews");
}

const timelinePage = readFileSync(
  path.join(root, "src/app/(workspace)/timeline/page.tsx"),
  "utf8",
);
for (const snippet of [
  "requireWorkspaceUser(\"/timeline\")",
  "listTimelineEvents",
  "LifeLineTimeline",
  "TimelineSearchPanel",
  "PeriodReviewSelector",
]) {
  if (!timelinePage.includes(snippet)) {
    throw new Error(`Timeline page is missing timeline integration: ${snippet}`);
  }
}

const reflectPage = readFileSync(
  path.join(root, "src/app/(workspace)/reflect/page.tsx"),
  "utf8",
);
for (const snippet of [
  "requireWorkspaceUser(\"/reflect\")",
  "PeriodReviewSelector",
  "PeriodReviewSurface",
  "parsePeriodReviewParams",
  "hasSelectedPeriod",
  "getPeriodReview",
  "Period could not load",
]) {
  if (!reflectPage.includes(snippet)) {
    throw new Error(`Reflect page is missing expected period review behavior: ${snippet}`);
  }
}

const searchPage = readFileSync(
  path.join(root, "src/app/(workspace)/search/page.tsx"),
  "utf8",
);
for (const snippet of [
  "requireWorkspaceUser(\"/search\")",
  "TimelineSearchPanel",
  "parseTimelineSearchParams",
  "searchTimeline",
  "LifeLineTimeline",
  "Try a broader term",
  "Clear filters",
  "Searching private timeline",
  "ReflectionSearchResults",
  "PatternSearchResults",
  "Saved reflections",
  "User-authored insights",
]) {
  if (!searchPage.includes(snippet)) {
    throw new Error(`Search page is missing expected search behavior: ${snippet}`);
  }
}

const addPage = readFileSync(path.join(root, "src/app/(workspace)/add/page.tsx"), "utf8");
for (const snippet of [
  "requireWorkspaceUser(\"/add\")",
  "MemoryCreationForm",
  "OfflineMemoryDraftPanel",
  "FutureIntentionForm",
]) {
  if (!addPage.includes(snippet)) {
    throw new Error(`Add page is missing memory creation integration: ${snippet}`);
  }
}

const offlineMemoryDraftPanel = readFileSync(
  path.join(root, "src/features/offline/components/offline-memory-draft-panel.tsx"),
  "utf8",
);
for (const snippet of [
  "OfflineMemoryDraftPanel",
  "OFFLINE_MEMORY_DRAFTS_KEY",
  "lifeline:offline-memory-drafts",
  "window.localStorage.setItem",
  "readOfflineDrafts",
  "navigator.onLine",
  "Local only",
  "Sync pending",
  "Synced",
  "Conflict",
  "Failed",
  "Unsynced",
  "Saved on this device",
  "not a synced timeline event yet",
  "does not sync imports, media, or reflections yet",
  "Full enrichment, media upload, import sync, and reflection sync require",
  "Edit mandatory fields",
  "Save local changes",
  "syncOfflineDraftAction",
  "initialOfflineDraftSyncState",
  "OfflineDraftSyncControl",
  "Sync local draft",
  "Sync pending...",
  "Timeline event created",
  "source metadata to avoid duplicate events",
  "one failed draft does not block the others",
  "Connect to the internet before syncing",
  "Retry sync",
  "Review conflict before choosing",
  "Keep local version",
  "Use server version",
  "Cancel",
  "Delete/discard local draft",
  "Conflict review paused",
  "Conflict resolved",
  "validateDraftFields",
  "draftErrors",
  "setDraftEdits",
  "Draft not saved yet",
  "Save local draft",
]) {
  if (!offlineMemoryDraftPanel.includes(snippet)) {
    throw new Error(`Offline memory draft panel is missing expected snippet: ${snippet}`);
  }
}

if (/from\(\"timeline_events\"\)|createTimelineEventAction|importNotesAction|importRescueTimeAction|saveReflectionSessionAction/i.test(offlineMemoryDraftPanel)) {
  throw new Error("Offline memory drafts must stay local-only in Story 5.1");
}

const syncOfflineDraftAction = readFileSync(
  path.join(root, "src/features/offline/actions/sync-offline-draft.ts"),
  "utf8",
);
for (const snippet of [
  "\"use server\"",
  "syncOfflineDraftAction",
  "resolveOfflineDraftConflictAction",
  "ActionResult",
  "OfflineDraftConflict",
  "timelineEventFormSchema.safeParse",
  "supabase.auth.getClaims",
  ".from(\"timeline_events\")",
  ".eq(\"user_id\", userId)",
  ".contains(\"source_metadata\", { offlineDraftId: draftId })",
  "ErrorCodes.offlineConflict",
  "hasOfflineDraftConflict",
  "source_label: \"Offline draft\"",
  "source_metadata",
  "offlineDraftId",
  "conflictResolvedAt",
  "syncedFrom: \"localStorage\"",
  "logOfflineSyncError",
  "revalidatePath(\"/timeline\")",
  "revalidatePath(\"/add\")",
]) {
  if (!syncOfflineDraftAction.includes(snippet)) {
    throw new Error(`Offline draft sync action is missing expected snippet: ${snippet}`);
  }
}

const offlineLogger = readFileSync(
  path.join(root, "src/features/offline/logger.ts"),
  "utf8",
);
for (const snippet of [
  "logOfflineSyncError",
  "offline_sync_error",
  "ErrorCodes[context.errorCode]",
  "draftId",
  "syncStatus",
  "technicalContext",
]) {
  if (!offlineLogger.includes(snippet)) {
    throw new Error(`Offline logger is missing expected snippet: ${snippet}`);
  }
}

if (/title|storyText|periodLabel|note|reflection/i.test(offlineLogger)) {
  throw new Error("Offline sync diagnostics must not log sensitive memory content");
}

const listTimelineEventsQuery = readFileSync(
  path.join(root, "src/features/timeline/queries/list-timeline-events.ts"),
  "utf8",
);
for (const snippet of [
  "INITIAL_TIMELINE_EVENT_LIMIT = 50",
  "supabase.auth.getClaims",
  ".from(\"timeline_events\")",
  ".eq(\"status\", \"active\")",
  ".order(\"occurred_on\"",
  ".limit(INITIAL_TIMELINE_EVENT_LIMIT)",
  "reachedInitialLimit",
  "TimelineEventSummary",
  "photo_reference_url",
  "photo_alt_text",
  "future_intentions",
  "futureIntentions",
  "listFutureIntentionLinkOptions",
  "future_intention_links",
  "linkedContext",
]) {
  if (!listTimelineEventsQuery.includes(snippet)) {
    throw new Error(`Timeline event list query is missing expected snippet: ${snippet}`);
  }
}

const searchTimelineQuery = readFileSync(
  path.join(root, "src/features/timeline/queries/search-timeline.ts"),
  "utf8",
);
for (const snippet of [
  "SEARCH_RESULT_LIMIT = 1000",
  "parseTimelineSearchParams",
  "hasActiveTimelineSearchFilters",
  "searchTimeline",
  "supabase.auth.getClaims",
  ".from(\"timeline_events\")",
  ".from(\"future_intentions\")",
  ".from(\"review_sessions\")",
  ".from(\"reflection_patterns\")",
  "ErrorCodes.permissionDenied",
  "ErrorCodes.timelineSearchFailed",
  "eventMatchesFilters",
  "intentionMatchesFilters",
  "reviewSessionMatchesFilters",
  "patternMatchesFilters",
  "matchesDateRange",
]) {
  if (!searchTimelineQuery.includes(snippet)) {
    throw new Error(`Timeline search query is missing expected snippet: ${snippet}`);
  }
}

const periodReviewQuery = readFileSync(
  path.join(root, "src/features/reviews/queries/get-period-review.ts"),
  "utf8",
);
for (const snippet of [
  "parsePeriodReviewParams",
  "hasSelectedPeriod",
  "getPeriodReview",
  "searchTimeline",
  "priorityEvents",
  "supportingEvents",
  "getPeriodLabel",
]) {
  if (!periodReviewQuery.includes(snippet)) {
    throw new Error(`Period review query is missing expected snippet: ${snippet}`);
  }
}

const reflectionPatternsQuery = readFileSync(
  path.join(root, "src/features/reviews/queries/get-reflection-patterns.ts"),
  "utf8",
);
for (const snippet of [
  "listReflectionPatternsForPeriod",
  ".from(\"reflection_patterns\")",
  ".from(\"reflection_pattern_timeline_events\")",
  "timeline_events(id,title)",
  "linkedEvents",
  "author_state",
  "ErrorCodes.reflectionPatternSaveFailed",
]) {
  if (!reflectionPatternsQuery.includes(snippet)) {
    throw new Error(`Reflection patterns query is missing expected snippet: ${snippet}`);
  }
}

const lifeLineTimeline = readFileSync(
  path.join(root, "src/features/timeline/components/life-line-timeline.tsx"),
  "utf8",
);
for (const snippet of [
  "LifeLineTimeline",
  "EmptyMemoryAtlasTimeline",
  "MemoryAtlasCard",
  "getImportanceProminence",
  "Present",
  "Future space",
  "FutureIntentionCard",
  "emptyState",
  "reachedInitialLimit",
  "Incremental loading",
]) {
  if (!lifeLineTimeline.includes(snippet)) {
    throw new Error(`Life-line timeline is missing expected snippet: ${snippet}`);
  }
}

const memoryAtlasCard = readFileSync(
  path.join(root, "src/features/timeline/components/memory-atlas-card.tsx"),
  "utf8",
);
for (const snippet of [
  "MemoryAtlasCard",
  "getImportanceProminence",
  "formatImportanceLabel",
  "Status:",
  "Importance:",
  "Date type:",
  "event.sourceLabel",
  "event.title",
  "event.storyText",
  "id={`memory-",
  "MemoryDetailPanel",
  "Open detail and actions",
  "Photo reference",
  "alt={event.photoAltText",
  "Open reference",
]) {
  if (!memoryAtlasCard.includes(snippet)) {
    throw new Error(`Memory Atlas card is missing expected snippet: ${snippet}`);
  }
}

const memoryDetailPanel = readFileSync(
  path.join(root, "src/features/timeline/components/memory-detail-panel.tsx"),
  "utf8",
);
for (const snippet of [
  "MemoryDetailPanel",
  "Memory detail",
  "Save changes",
  "Hide memory",
  "Delete memory",
  "Visibility controls",
  "Hide keeps the record",
  "Delete removes this selected timeline event",
  "Clear the URL to remove the photo reference",
  "Photo reference URL",
  "Photo description",
  "ImportanceControl",
  "window.confirm",
  "submitEvent.preventDefault()",
  "Could not finish that change",
]) {
  if (!memoryDetailPanel.includes(snippet)) {
    throw new Error(`Memory detail panel is missing expected snippet: ${snippet}`);
  }
}

const importanceControl = readFileSync(
  path.join(root, "src/features/timeline/components/importance-control.tsx"),
  "utf8",
);
for (const snippet of [
  "ImportanceControl",
  "importanceDescriptions",
  "I am not sure yet",
  "Changed the line",
  "type=\"radio\"",
  "aria-label={`Importance:",
  "getImportanceProminence",
  "Defining memory",
]) {
  if (!importanceControl.includes(snippet)) {
    throw new Error(`Importance control is missing expected snippet: ${snippet}`);
  }
}

const futureIntentionForm = readFileSync(
  path.join(root, "src/features/timeline/components/future-intention-form.tsx"),
  "utf8",
);
for (const snippet of [
  "FutureIntentionForm",
  "future-intention",
  "Intention title",
  "Optional date",
  "Optional period",
  "Linked past context",
  "No link yet",
  "Save intention",
  "ProductBoundaryNote",
]) {
  if (!futureIntentionForm.includes(snippet)) {
    throw new Error(`Future intention form is missing expected snippet: ${snippet}`);
  }
}

const futureIntentionCard = readFileSync(
  path.join(root, "src/features/timeline/components/future-intention-card.tsx"),
  "utf8",
);
for (const snippet of [
  "FutureIntentionCard",
  "Future intention",
  "Grows from",
  "Linked past context",
  "Choose No link yet to unlink",
  "Edit or delete intention",
  "Delete intention",
  "window.confirm",
  "submitEvent.preventDefault()",
]) {
  if (!futureIntentionCard.includes(snippet)) {
    throw new Error(`Future intention card is missing expected snippet: ${snippet}`);
  }
}

const importsPage = readFileSync(
  path.join(root, "src/app/(workspace)/imports/page.tsx"),
  "utf8",
);
for (const snippet of [
  "requireWorkspaceUser(\"/imports\")",
  "listImportReview",
  "ImportReviewSurface",
]) {
  if (!importsPage.includes(snippet)) {
    throw new Error(`Imports page is missing expected snippet: ${snippet}`);
  }
}

const importReviewQuery = readFileSync(
  path.join(root, "src/features/imports/queries/list-import-review.ts"),
  "utf8",
);
for (const snippet of [
  "listImportReview",
  "IMPORT_REVIEW_RECORD_LIMIT = 100",
  "supabase.auth.getClaims",
  ".from(\"import_sources\")",
  ".from(\"import_records\")",
  "lifecycle_state",
  "sync_status",
  "source_metadata",
  "content_summary",
  "timelineOptions",
  ".from(\"timeline_events\")",
  ".not(\"lifecycle_state\", \"in\", \"(deleted,hidden,discarded)\")",
  "ErrorCodes.importAuthFailed",
  "logImportError",
]) {
  if (!importReviewQuery.includes(snippet)) {
    throw new Error(`Import review query is missing expected snippet: ${snippet}`);
  }
}

const importReviewSurface = readFileSync(
  path.join(root, "src/features/imports/components/import-review-surface.tsx"),
  "utf8",
);
for (const snippet of [
  "ImportReviewSurface",
  "Review imports before they touch your life-line",
  "Staged suggested context",
  "Nothing becomes a primary timeline memory automatically",
  "groupImportRecords",
  "Needs date review",
  "missing or ambiguous date metadata",
  "Connect RescueTime",
  "Import notes",
  "ImportStagingCard",
  "ImportRecoveryPanel",
  "NotesImportPanel",
  "RescueTimeConnectPanel",
  "No staged imports yet",
]) {
  if (!importReviewSurface.includes(snippet)) {
    throw new Error(`Import review surface is missing expected snippet: ${snippet}`);
  }
}

const importStagingCard = readFileSync(
  path.join(root, "src/features/imports/components/import-staging-card.tsx"),
  "utf8",
);
for (const snippet of [
  "ImportStagingCard",
  "Lifecycle:",
  "Sync:",
  "Source details",
  "Date placement",
  "Source timestamp",
  "Privacy consequence",
  "ImportRecordCurationActions",
  "getLifecycleExplanation",
  "getSyncGuidance",
  "successful records remain usable",
  "retry the range, reconnect the source, or ignore this record",
  "Attach",
  "Promote",
  "Reflect",
  "Discarding will remove it from normal review",
  "hiding will keep it out of resurfaced suggestions",
]) {
  if (!importStagingCard.includes(snippet)) {
    throw new Error(`Import staging card is missing expected snippet: ${snippet}`);
  }
}

const importRecoveryPanel = readFileSync(
  path.join(root, "src/features/imports/components/import-recovery-panel.tsx"),
  "utf8",
);
for (const snippet of [
  "ImportRecoveryPanel",
  "Import recovery",
  "Fix import issues without touching your timeline",
  "Authorization or expired access",
  "Network, source availability, or partial sync",
  "Source data or unknown issue",
  "Retry or reconnect",
  "Ignore issue",
  "Disconnect source",
  "Contact support without private content",
  "Please%20do%20not%20include%20note%20content",
  "Timeline content and account access are",
]) {
  if (!importRecoveryPanel.includes(snippet)) {
    throw new Error(`Import recovery panel is missing expected snippet: ${snippet}`);
  }
}

const sourceRecoveryAction = readFileSync(
  path.join(root, "src/features/imports/actions/source-recovery.ts"),
  "utf8",
);
for (const snippet of [
  "\"use server\"",
  "ignoreImportSourceIssueAction",
  "disconnectImportSourceAction",
  ".from(\"import_sources\")",
  "connection_status",
  "\"connected\"",
  "\"disconnected\"",
  ".eq(\"user_id\", userId)",
  ".select(\"id\")",
  "revalidatePath(\"/imports\")",
  "revalidatePath(\"/settings\")",
  "Your staged records are unchanged",
]) {
  if (!sourceRecoveryAction.includes(snippet)) {
    throw new Error(`Source recovery action is missing expected snippet: ${snippet}`);
  }
}

if (/note.*body|reflection.*text|activity.*detail|timeline.*content.*update/i.test(sourceRecoveryAction)) {
  throw new Error("Source recovery actions must not handle sensitive content");
}

const importRecordCurationActions = readFileSync(
  path.join(root, "src/features/imports/components/import-record-curation-actions.tsx"),
  "utf8",
);
for (const snippet of [
  "ImportRecordCurationActions",
  "promoteImportRecordAction",
  "attachImportRecordAction",
  "hideImportRecordAction",
  "discardImportRecordAction",
  "Promote to timeline",
  "Attach to existing memory",
  "Control resurfacing",
  "Hide keeps the record out of normal suggestions",
  "Discard marks it as",
  "window.confirm",
  "Discard this imported record from normal review",
  "Exact date",
  "Approximate period",
  "Import stayed staged",
  "timelineOptions",
]) {
  if (!importRecordCurationActions.includes(snippet)) {
    throw new Error(`Import record curation actions are missing expected snippet: ${snippet}`);
  }
}

const curateImportRecordAction = readFileSync(
  path.join(root, "src/features/imports/actions/curate-import-record.ts"),
  "utf8",
);
for (const snippet of [
  "\"use server\"",
  "promoteImportRecordAction",
  "attachImportRecordAction",
  "hideImportRecordAction",
  "discardImportRecordAction",
  ".from(\"timeline_events\")",
  ".from(\"import_records\")",
  "source_type: \"imported\"",
  "source_import_record_id",
  "source_metadata: record.data.source_metadata",
  "lifecycle_state",
  "\"promoted\"",
  "\"attached\"",
  "\"hidden\"",
  "\"discarded\"",
  "suggested_timeline_event_id",
  "Choose an exact date or name an approximate period before promoting",
  "It is still staged, so you can retry",
  "revalidatePath(\"/imports\")",
  "revalidatePath(\"/timeline\")",
]) {
  if (!curateImportRecordAction.includes(snippet)) {
    throw new Error(`Curate import action is missing expected snippet: ${snippet}`);
  }
}

const notesImportPanel = readFileSync(
  path.join(root, "src/features/imports/components/notes-import-panel.tsx"),
  "utf8",
);
for (const snippet of [
  "NotesImportPanel",
  "Import written context",
  "copied text or an exported plain-text/Markdown",
  "copies the content into your private staged records",
  "does not connect to Notion or Google Keep yet",
  "Date: YYYY-MM-DD",
  "Separate multiple notes",
  "date review needed",
  "importNotesAction",
  "Import notes to staging",
  "retry this paste",
]) {
  if (!notesImportPanel.includes(snippet)) {
    throw new Error(`Notes import panel is missing expected snippet: ${snippet}`);
  }
}

const notesImportAction = readFileSync(
  path.join(root, "src/features/imports/actions/notes-import.ts"),
  "utf8",
);
for (const snippet of [
  "\"use server\"",
  "importNotesAction",
  "parseNotesExport",
  ".from(\"import_sources\")",
  ".from(\"import_records\")",
  "source_type: \"notes\"",
  "source_metadata: note.sourceMetadata",
  "lifecycle_state: \"staged\"",
  "sync_status: parsed.failedCount > 0 ? \"partial\" : \"succeeded\"",
  "onConflict: \"user_id,source_type,source_record_id\"",
  "copiedIntoLifeline",
  "logImportError",
  "revalidatePath(\"/imports\")",
]) {
  if (!notesImportAction.includes(snippet)) {
    throw new Error(`Notes import action is missing expected snippet: ${snippet}`);
  }
}

if (/\.from\(\"timeline_events\"\)|console\.(log|error)\([^)]*(notesText|body|contentSummary|title)/i.test(notesImportAction)) {
  throw new Error("Notes import action must avoid timeline auto-promotion and note content logging");
}

const notesExportParser = readFileSync(
  path.join(root, "src/features/imports/notes/parse-notes-export.ts"),
  "utf8",
);
for (const snippet of [
  "parseNotesExport",
  "ParsedNoteImport",
  "split(/\\n-{3,}\\n/g)",
  "/^date:\\s*/i",
  "needsDateReview",
  "sourceRecordId: `notes:",
  "sourceMetadata",
  "body",
  "dateReview",
  "Needs date review",
]) {
  if (!notesExportParser.includes(snippet)) {
    throw new Error(`Notes export parser is missing expected snippet: ${snippet}`);
  }
}

const rescueTimeConnectPanel = readFileSync(
  path.join(root, "src/features/imports/components/rescuetime-connect-panel.tsx"),
  "utf8",
);
for (const snippet of [
  "RescueTimeConnectPanel",
  "Connect activity context",
  "server-side API key",
  "stay staged",
  "connectRescueTimeFormAction",
  "importRescueTimeAction",
  "Import RescueTime range",
  "retry, reconnect",
]) {
  if (!rescueTimeConnectPanel.includes(snippet)) {
    throw new Error(`RescueTime connect panel is missing expected snippet: ${snippet}`);
  }
}

const rescueTimeImportAction = readFileSync(
  path.join(root, "src/features/imports/actions/rescuetime-import.ts"),
  "utf8",
);
for (const snippet of [
  "\"use server\"",
  "RESCUETIME_API_KEY",
  "connectRescueTimeAction",
  "importRescueTimeAction",
  ".from(\"import_sources\")",
  ".from(\"import_records\")",
  "fetchRescueTimeHourlyProductivity",
  "source_type: \"rescuetime\"",
  "lifecycle_state: \"staged\"",
  "sync_status: \"succeeded\"",
  "onConflict: \"user_id,source_type,source_record_id\"",
  "revalidatePath(\"/imports\")",
]) {
  if (!rescueTimeImportAction.includes(snippet)) {
    throw new Error(`RescueTime import action is missing expected snippet: ${snippet}`);
  }
}

if (/\.from\(\"timeline_events\"\)|NEXT_PUBLIC_RESCUETIME|source_metadata:\s*{[^}]*apiKey/i.test(rescueTimeImportAction)) {
  throw new Error("RescueTime import action must keep secrets server-side and avoid timeline auto-promotion");
}

const rescueTimeClient = readFileSync(
  path.join(root, "src/features/imports/rescuetime/client.ts"),
  "utf8",
);
for (const snippet of [
  "server-only",
  "https://www.rescuetime.com/anapi/data",
  "format",
  "perspective",
  "restrict_kind",
  "interval",
  "restrict_begin",
  "restrict_end",
  "row_headers",
  "rows",
  "normalizeRescueTimeRows",
]) {
  if (!rescueTimeClient.includes(snippet)) {
    throw new Error(`RescueTime client is missing expected snippet: ${snippet}`);
  }
}

const importTypes = readFileSync(
  path.join(root, "src/features/imports/types.ts"),
  "utf8",
);
for (const snippet of [
  "ImportSourceSummary",
  "ImportRecordSummary",
  "\"staged\"",
  "\"attached\"",
  "\"promoted\"",
  "\"hidden\"",
  "\"discarded\"",
  "\"deleted\"",
  "\"pending\"",
  "\"succeeded\"",
  "\"partial\"",
  "\"failed\"",
  "\"duplicate\"",
]) {
  if (!importTypes.includes(snippet)) {
    throw new Error(`Import types are missing expected snippet: ${snippet}`);
  }
}

const importLogger = readFileSync(
  path.join(root, "src/features/imports/logger.ts"),
  "utf8",
);
for (const snippet of [
  "logImportError",
  "ErrorCodes",
  "technicalContext",
  "console.error(\"import_error\"",
]) {
  if (!importLogger.includes(snippet)) {
    throw new Error(`Import logger is missing expected snippet: ${snippet}`);
  }
}

if (/(content|summary|note|activity)/i.test(importLogger.replace("technicalContext", ""))) {
  throw new Error("Import logger must not accept sensitive imported content fields");
}

const timelineSearchPanel = readFileSync(
  path.join(root, "src/features/timeline/components/timeline-search-panel.tsx"),
  "utf8",
);
for (const snippet of [
  "TimelineSearchPanel",
  "Private search",
  "Search your life-line",
  "type=\"search\"",
  "type=\"date\"",
  "name=\"importance\"",
  "name=\"source\"",
  "name=\"itemType\"",
  "future-intention",
  "Clear filters",
  "min-h-11",
]) {
  if (!timelineSearchPanel.includes(snippet)) {
    throw new Error(`Timeline search panel is missing expected snippet: ${snippet}`);
  }
}

const periodReviewSelector = readFileSync(
  path.join(root, "src/features/reviews/components/period-review-selector.tsx"),
  "utf8",
);
for (const snippet of [
  "PeriodReviewSelector",
  "Period review",
  "Choose a life period",
  "Review period",
  "Clear period",
  "Return to timeline",
  "type=\"date\"",
]) {
  if (!periodReviewSelector.includes(snippet)) {
    throw new Error(`Period review selector is missing expected snippet: ${snippet}`);
  }
}

const periodReviewSurface = readFileSync(
  path.join(root, "src/features/reviews/components/period-review-surface.tsx"),
  "utf8",
);
for (const snippet of [
  "PeriodReviewSurface",
  "ProductBoundaryNote",
  "What is in this period",
  "does not make conclusions",
  "Priority memories",
  "Strong signals first",
  "LifeLineTimeline",
  "Nothing is on this part of the line yet",
  "Adjust period",
  "Start reflection",
  "Saved reflections",
  "PatternClarityPanel",
]) {
  if (!periodReviewSurface.includes(snippet)) {
    throw new Error(`Period review surface is missing expected snippet: ${snippet}`);
  }
}

const patternClarityPanel = readFileSync(
  path.join(root, "src/features/reviews/components/pattern-clarity-panel.tsx"),
  "utf8",
);
for (const snippet of [
  "PatternClarityPanel",
  "Pattern clarity",
  "User-authored",
  "User chooses meaning",
  "Possible pattern prompt",
  "You can ignore this prompt",
  "Supporting memories",
  "Edit or dismiss pattern",
  "Dismiss pattern",
  "Pattern synced",
]) {
  if (!patternClarityPanel.includes(snippet)) {
    throw new Error(`Pattern clarity panel is missing expected snippet: ${snippet}`);
  }
}

const reflectionSessionRoute = readFileSync(
  path.join(root, "src/app/(workspace)/reflect/session/page.tsx"),
  "utf8",
);
for (const snippet of [
  "requireWorkspaceUser(\"/reflect/session\")",
  "ReflectionSessionForm",
  "PatternClarityPanel",
  "FutureIntentionForm",
  "completedReflectionLink",
  "parsePeriodReviewParams",
  "listReflectionPatternsForPeriod",
  "listFutureIntentionLinkOptions",
  "getReflectionSessionForPeriod",
  "Reflection could not load",
]) {
  if (!reflectionSessionRoute.includes(snippet)) {
    throw new Error(`Reflection session route is missing expected snippet: ${snippet}`);
  }
}

const reflectionPatternAction = readFileSync(
  path.join(root, "src/features/reviews/actions/save-reflection-pattern.ts"),
  "utf8",
);
for (const snippet of [
  "\"use server\"",
  "saveReflectionPatternAction",
  "dismissReflectionPatternAction",
  "reflectionPatternFormSchema.safeParse",
  ".from(\"reflection_patterns\")",
  ".from(\"reflection_pattern_timeline_events\")",
  "status: \"dismissed\"",
  "ErrorCodes.reflectionPatternSaveFailed",
  "revalidatePath(\"/reflect\")",
  "revalidatePath(\"/search\")",
]) {
  if (!reflectionPatternAction.includes(snippet)) {
    throw new Error(`Reflection pattern action is missing expected snippet: ${snippet}`);
  }
}

const reflectionPatternSchema = readFileSync(
  path.join(root, "src/features/reviews/schemas/reflection-pattern-form.ts"),
  "utf8",
);
for (const snippet of [
  "reflectionPatternFormSchema",
  "Name the insight in your own words",
  "description",
  "linkedTimelineEventIds",
]) {
  if (!reflectionPatternSchema.includes(snippet)) {
    throw new Error(`Reflection pattern schema is missing expected snippet: ${snippet}`);
  }
}

const reflectionSessionForm = readFileSync(
  path.join(root, "src/features/reviews/components/reflection-session-form.tsx"),
  "utf8",
);
for (const snippet of [
  "ReflectionSessionForm",
  "ProductBoundaryNote",
  "Optional prompts",
  "What happened during this period?",
  "What repeated, changed, or surprised you?",
  "Local draft is in this editor",
  "Save draft",
  "Pause",
  "Complete",
  "Back to period",
]) {
  if (!reflectionSessionForm.includes(snippet)) {
    throw new Error(`Reflection session form is missing expected snippet: ${snippet}`);
  }
}

const productBoundaryNote = readFileSync(
  path.join(root, "src/features/reviews/components/product-boundary-note.tsx"),
  "utf8",
);
for (const snippet of [
  "ProductBoundaryNote",
  "Private reflection, user-owned meaning.",
  "You choose what they mean",
  "pause, edit",
  "save a draft",
]) {
  if (!productBoundaryNote.includes(snippet)) {
    throw new Error(`Product boundary note is missing expected snippet: ${snippet}`);
  }
}

const reflectionSessionAction = readFileSync(
  path.join(root, "src/features/reviews/actions/save-reflection-session.ts"),
  "utf8",
);
for (const snippet of [
  "\"use server\"",
  "saveReflectionSessionAction",
  "reflectionSessionFormSchema.safeParse",
  ".from(\"review_sessions\")",
  ".insert",
  ".update",
  "ErrorCodes.reflectionSessionSaveFailed",
  "revalidatePath(\"/reflect\")",
  "revalidatePath(\"/search\")",
]) {
  if (!reflectionSessionAction.includes(snippet)) {
    throw new Error(`Reflection session action is missing expected snippet: ${snippet}`);
  }
}

const reflectionSessionSchema = readFileSync(
  path.join(root, "src/features/reviews/schemas/reflection-session-form.ts"),
  "utf8",
);
for (const snippet of [
  "reflectionSessionFormSchema",
  "draft",
  "paused",
  "completed",
  "summaryText",
  "Write a short summary before completing",
]) {
  if (!reflectionSessionSchema.includes(snippet)) {
    throw new Error(`Reflection session schema is missing expected snippet: ${snippet}`);
  }
}

const timelineEventSchema = readFileSync(
  path.join(root, "src/features/timeline/schemas/timeline-event-form.ts"),
  "utf8",
);
for (const snippet of [
  "zod",
  "timelineEventFormSchema",
  "datePrecisionValues",
  "exact",
  "month",
  "year",
  "period",
  "unknown",
  "getDateLabel",
  "getOccurredOn",
  "photoReferenceUrl",
  "photoAltText",
  "URL.canParse",
]) {
  if (!timelineEventSchema.includes(snippet)) {
    throw new Error(`Timeline event schema is missing expected snippet: ${snippet}`);
  }
}

const createTimelineEventAction = readFileSync(
  path.join(root, "src/features/timeline/actions/create-timeline-event.ts"),
  "utf8",
);
for (const snippet of [
  "\"use server\"",
  "ActionResult<CreatedTimelineEvent>",
  "timelineEventFormSchema.safeParse",
  "supabase.auth.getClaims",
  ".from(\"timeline_events\")",
  ".insert",
  "ErrorCodes.validationFailed",
  "ErrorCodes.permissionDenied",
  "ErrorCodes.timelineEventCreateFailed",
  "photo_reference_url",
  "photo_alt_text",
  "revalidatePath(\"/timeline\")",
]) {
  if (!createTimelineEventAction.includes(snippet)) {
    throw new Error(`Create timeline event action is missing expected snippet: ${snippet}`);
  }
}

const manageTimelineEventAction = readFileSync(
  path.join(root, "src/features/timeline/actions/manage-timeline-event.ts"),
  "utf8",
);
for (const snippet of [
  "\"use server\"",
  "updateTimelineEventAction",
  "hideTimelineEventAction",
  "deleteTimelineEventAction",
  "timelineEventUpdateSchema.safeParse",
  ".from(\"timeline_events\")",
  ".update",
  ".delete()",
  ".eq(\"id\"",
  "status: \"hidden\"",
  "ErrorCodes.timelineEventUpdateFailed",
  "ErrorCodes.timelineEventHideFailed",
  "ErrorCodes.timelineEventDeleteFailed",
  "photo_reference_url",
  "photo_alt_text",
  "revalidatePath(\"/timeline\")",
]) {
  if (!manageTimelineEventAction.includes(snippet)) {
    throw new Error(`Manage timeline event action is missing expected snippet: ${snippet}`);
  }
}

const manageFutureIntentionAction = readFileSync(
  path.join(root, "src/features/timeline/actions/manage-future-intention.ts"),
  "utf8",
);
for (const snippet of [
  "\"use server\"",
  "createFutureIntentionAction",
  "updateFutureIntentionAction",
  "deleteFutureIntentionAction",
  ".from(\"future_intentions\")",
  ".insert",
  ".update",
  ".delete()",
  "ErrorCodes.futureIntentionSaveFailed",
  "replaceFutureIntentionLink",
  ".from(\"future_intention_links\")",
  "revalidatePath(\"/timeline\")",
]) {
  if (!manageFutureIntentionAction.includes(snippet)) {
    throw new Error(`Manage future intention action is missing expected snippet: ${snippet}`);
  }
}

const memoryCreationForm = readFileSync(
  path.join(root, "src/features/timeline/components/memory-creation-form.tsx"),
  "utf8",
);
for (const snippet of [
  "useActionState",
  "MemoryCreationForm",
  "Memory title",
  "Date precision",
  "Exact date",
  "Month and year",
  "Year",
  "Period label",
  "Timeline preview",
  "Save memory",
  "Saved on the line",
  "Importance:",
  "Photo reference URL",
  "Photo description",
  "uploads come",
  "ImportanceControl",
  "min-h-11",
]) {
  if (!memoryCreationForm.includes(snippet)) {
    throw new Error(`Memory creation form is missing expected snippet: ${snippet}`);
  }
}

const emptyTimeline = readFileSync(
  path.join(root, "src/features/timeline/components/empty-memory-atlas-timeline.tsx"),
  "utf8",
);
for (const snippet of [
  "EmptyMemoryAtlasTimeline",
  "Your life-line is ready.",
  "Present",
  "Past",
  "Future",
  "Add memory",
  "Add future intention",
  "Import context",
  "bg-timeline",
  "bg-reflection",
  "min-h-14",
]) {
  if (!emptyTimeline.includes(snippet)) {
    throw new Error(`Empty timeline surface is missing expected snippet: ${snippet}`);
  }
}

for (const staleProtectedTarget of [
  "src/components/sign-up-form.tsx",
  "src/components/update-password-form.tsx",
]) {
  const file = readFileSync(path.join(root, staleProtectedTarget), "utf8");
  if (file.includes("/protected")) {
    throw new Error(`${staleProtectedTarget} should send users to /timeline, not /protected`);
  }
}

const proxy = readFileSync(path.join(root, "src/lib/supabase/proxy.ts"), "utf8");
for (const snippet of [
  "protectedRoutePrefixes",
  '"/timeline"',
  '"/add"',
  '"/imports"',
  '"/reflect"',
  '"/search"',
  '"/settings"',
  "redirectToLogin",
  'url.searchParams.set("next"',
]) {
  if (!proxy.includes(snippet)) {
    throw new Error(`Proxy route protection is missing expected snippet: ${snippet}`);
  }
}

const workspaceUser = readFileSync(
  path.join(root, "src/features/auth/require-workspace-user.ts"),
  "utf8",
);
for (const snippet of ["requireWorkspaceUser", "getClaims", "getLoginPath", "encodeURIComponent(nextPath)"]) {
  if (!workspaceUser.includes(snippet)) {
    throw new Error(`Workspace auth helper is missing expected snippet: ${snippet}`);
  }
}

const layout = readFileSync(path.join(root, "src/app/layout.tsx"), "utf8");
if (!layout.includes('title: "Lifeline"')) {
  throw new Error("Root metadata must use Lifeline product naming");
}
for (const snippet of ["Toaster", "richColors", "closeButton"]) {
  if (!layout.includes(snippet)) {
    throw new Error(`Root layout is missing toast provider setup: ${snippet}`);
  }
}

const globalsCss = readFileSync(path.join(root, "src/app/globals.css"), "utf8");
for (const snippet of [
  "--background: 38 44% 96%",
  "--foreground: 150 9% 13%",
  "--timeline: 34 18% 66%",
  "--memory: 18 43% 51%",
  "--reflection: 258 22% 47%",
  "--future: 204 42% 40%",
  "--imported: 221 13% 46%",
  "--warning: 36 71% 42%",
  "--focus: 173 41% 31%",
  "--space-unit: 0.5rem",
  "--radius-soft",
  "--shadow-soft",
  "prefers-reduced-motion",
  "letter-spacing: 0",
]) {
  if (!globalsCss.includes(snippet)) {
    throw new Error(`Lifeline global design tokens are missing expected snippet: ${snippet}`);
  }
}

const tailwindConfig = readFileSync(path.join(root, "tailwind.config.ts"), "utf8");
for (const snippet of [
  "focus: \"hsl(var(--focus))\"",
  "timeline: \"hsl(var(--timeline))\"",
  "memory:",
  "reflection:",
  "future:",
  "imported:",
  "warning:",
  "success:",
  "shadow-soft",
  "text-page-title",
  "lifeline-8",
]) {
  if (!tailwindConfig.includes(snippet)) {
    throw new Error(`Tailwind config is missing Lifeline token mapping: ${snippet}`);
  }
}

for (const [filePath, snippets] of Object.entries({
  "src/components/ui/alert.tsx": ["Alert", "warning", "destructive", "role=\"status\""],
  "src/components/ui/dialog.tsx": ["DialogPrimitive", "DialogContent", "shadow-panel", "sr-only"],
  "src/components/ui/sheet.tsx": ["sheetVariants", "side:", "SheetContent", "min-h-11"],
  "src/components/ui/sonner.tsx": ["Sonner", "toastOptions", "shadow-soft"],
  "src/components/ui/button.tsx": ["min-h-11", "focus-visible:ring-2", "ring-focus"],
  "src/components/ui/input.tsx": ["min-h-11", "focus-visible:ring-2", "ring-focus"],
  "src/components/ui/textarea.tsx": ["min-h-32", "focus-visible:ring-2", "ring-focus"],
  "src/components/ui/checkbox.tsx": ["h-5 w-5", "focus-visible:ring-2", "ring-focus"],
})) {
  const file = readFileSync(path.join(root, filePath), "utf8");
  for (const snippet of snippets) {
    if (!file.includes(snippet)) {
      throw new Error(`${filePath} is missing accessible primitive snippet: ${snippet}`);
    }
  }
}

const timelineEventsMigration = readFileSync(
  path.join(root, "supabase/migrations/20260505182600_create_timeline_events.sql"),
  "utf8",
);
for (const snippet of [
  "create table if not exists public.timeline_events",
  "user_id uuid not null references auth.users(id) on delete cascade",
  "date_precision",
  "approximate_date_label",
  "importance",
  "status",
  "source_type",
  "alter table public.timeline_events enable row level security",
  "auth.uid() = user_id",
  "timeline_events_select_own",
  "timeline_events_insert_own",
  "timeline_events_update_own",
  "timeline_events_delete_own",
]) {
  if (!timelineEventsMigration.includes(snippet)) {
    throw new Error(`Timeline events migration is missing expected snippet: ${snippet}`);
  }
}

const timelinePhotoReferencesMigration = readFileSync(
  path.join(root, "supabase/migrations/20260505201400_add_photo_references_to_timeline_events.sql"),
  "utf8",
);
for (const snippet of [
  "photo_reference_url",
  "photo_alt_text",
  "timeline_events_photo_reference_url_length",
  "timeline_events_photo_alt_text_length",
]) {
  if (!timelinePhotoReferencesMigration.includes(snippet)) {
    throw new Error(`Photo reference migration is missing expected snippet: ${snippet}`);
  }
}

const futureIntentionsMigration = readFileSync(
  path.join(root, "supabase/migrations/20260505210800_create_future_intentions.sql"),
  "utf8",
);
for (const snippet of [
  "create table if not exists public.future_intentions",
  "user_id uuid not null references auth.users(id) on delete cascade",
  "alter table public.future_intentions enable row level security",
  "auth.uid() = user_id",
  "future_intentions_select_own",
  "future_intentions_insert_own",
  "future_intentions_update_own",
  "future_intentions_delete_own",
]) {
  if (!futureIntentionsMigration.includes(snippet)) {
    throw new Error(`Future intentions migration is missing expected snippet: ${snippet}`);
  }
}

const reviewSessionsMigration = readFileSync(
  path.join(root, "supabase/migrations/20260506102400_create_review_sessions.sql"),
  "utf8",
);
for (const snippet of [
  "create table if not exists public.review_sessions",
  "user_id uuid not null references auth.users(id) on delete cascade",
  "period_started_on",
  "period_ended_on",
  "summary_text",
  "status in ('draft', 'paused', 'completed')",
  "alter table public.review_sessions enable row level security",
  "auth.uid() = user_id",
  "review_sessions_select_own",
  "review_sessions_insert_own",
  "review_sessions_update_own",
  "review_sessions_delete_own",
]) {
  if (!reviewSessionsMigration.includes(snippet)) {
    throw new Error(`Review sessions migration is missing expected snippet: ${snippet}`);
  }
}

const reflectionPatternsMigration = readFileSync(
  path.join(root, "supabase/migrations/20260506103600_create_reflection_patterns.sql"),
  "utf8",
);
for (const snippet of [
  "create table if not exists public.reflection_patterns",
  "create table if not exists public.reflection_pattern_timeline_events",
  "user_id uuid not null references auth.users(id) on delete cascade",
  "author_state in ('user_authored', 'user_confirmed')",
  "status in ('active', 'dismissed')",
  "alter table public.reflection_patterns enable row level security",
  "alter table public.reflection_pattern_timeline_events enable row level security",
  "reflection_patterns_select_own",
  "reflection_patterns_insert_own",
  "reflection_patterns_update_own",
  "reflection_pattern_events_insert_own",
]) {
  if (!reflectionPatternsMigration.includes(snippet)) {
    throw new Error(`Reflection patterns migration is missing expected snippet: ${snippet}`);
  }
}

const futureIntentionLinksMigration = readFileSync(
  path.join(root, "supabase/migrations/20260506104900_create_future_intention_links.sql"),
  "utf8",
);
for (const snippet of [
  "create table if not exists public.future_intention_links",
  "future_intention_id uuid not null references public.future_intentions(id) on delete cascade",
  "review_session_id uuid references public.review_sessions(id) on delete cascade",
  "reflection_pattern_id uuid references public.reflection_patterns(id) on delete cascade",
  "timeline_event_id uuid references public.timeline_events(id) on delete cascade",
  "num_nonnulls(review_session_id, reflection_pattern_id, timeline_event_id) = 1",
  "unique (future_intention_id)",
  "alter table public.future_intention_links enable row level security",
  "future_intention_links_select_own",
  "future_intention_links_insert_own",
  "future_intention_links_delete_own",
]) {
  if (!futureIntentionLinksMigration.includes(snippet)) {
    throw new Error(`Future intention links migration is missing expected snippet: ${snippet}`);
  }
}

const importStagingMigration = readFileSync(
  path.join(root, "supabase/migrations/20260506104700_create_import_staging.sql"),
  "utf8",
);
for (const snippet of [
  "create table if not exists public.import_sources",
  "create table if not exists public.import_records",
  "user_id uuid not null references auth.users(id) on delete cascade",
  "source_type text not null check (source_type in ('rescuetime', 'notes'))",
  "connection_status text not null default 'not_connected'",
  "source_metadata jsonb not null default '{}'::jsonb",
  "content_summary text not null",
  "lifecycle_state text not null default 'staged'",
  "lifecycle_state in ('staged', 'attached', 'promoted', 'hidden', 'discarded', 'deleted')",
  "sync_status text not null default 'succeeded'",
  "sync_status in ('pending', 'succeeded', 'partial', 'failed', 'duplicate')",
  "alter table public.import_sources enable row level security",
  "alter table public.import_records enable row level security",
  "import_sources_select_own",
  "import_sources_insert_own",
  "import_sources_update_own",
  "import_sources_delete_own",
  "import_records_select_own",
  "import_records_insert_own",
  "import_records_update_own",
  "import_records_delete_own",
]) {
  if (!importStagingMigration.includes(snippet)) {
    throw new Error(`Import staging migration is missing expected snippet: ${snippet}`);
  }
}

if (/insert\s+into\s+public\.timeline_events/i.test(importStagingMigration)) {
  throw new Error("Import staging migration must not create primary timeline events");
}

const rescueTimeDedupeMigration = readFileSync(
  path.join(root, "supabase/migrations/20260506105300_add_rescuetime_import_dedupe.sql"),
  "utf8",
);
for (const snippet of [
  "import_records_user_source_record_unique_idx",
  "public.import_records",
  "user_id, source_type, source_record_id",
]) {
  if (!rescueTimeDedupeMigration.includes(snippet)) {
    throw new Error(`RescueTime dedupe migration is missing expected snippet: ${snippet}`);
  }
}

const importPromotionMigration = readFileSync(
  path.join(root, "supabase/migrations/20260506154500_add_import_promotion_metadata.sql"),
  "utf8",
);
for (const snippet of [
  "timeline_events_source_type_check",
  "source_type in ('manual', 'imported')",
  "source_import_record_id uuid references public.import_records(id) on delete set null",
  "source_metadata jsonb not null default '{}'::jsonb",
  "timeline_events_source_import_record_idx",
]) {
  if (!importPromotionMigration.includes(snippet)) {
    throw new Error(`Import promotion migration is missing expected snippet: ${snippet}`);
  }
}

const publicSourceSnapshot = [
  memoryCreationForm,
  memoryDetailPanel,
  memoryAtlasCard,
  createTimelineEventAction,
  manageTimelineEventAction,
].join("\n");

if (/public\/.*(photo|memory|timeline)|NEXT_PUBLIC_.*(photo|media|storage)/i.test(publicSourceSnapshot)) {
  throw new Error("Photo references must not introduce public private-media storage");
}

const productCopySnapshot = [
  settingsPage,
  privacyDataSection,
  periodReviewSurface,
  patternClarityPanel,
  reflectionSessionForm,
  futureIntentionForm,
  memoryCreationForm,
].join("\n");

if (
  /(therapy|therapist|diagnosis|diagnose|diagnostic|clinical|treatment|medical advice|streak|shame|guilt)/i.test(
    productCopySnapshot,
  )
) {
  throw new Error(
    "Product copy should stay in private reflection and user-owned meaning language",
  );
}

const seedSql = readFileSync(path.join(root, "supabase/seed.sql"), "utf8");
if (/insert\s+into\s+public\.timeline_events/i.test(seedSql)) {
  throw new Error("Seed data must not include private timeline events");
}

const sourceFilesToScan = [
  "src/app",
  "src/components",
  "src/features",
  "src/lib",
];
const hardcodedIdentityPattern =
  /(hardcoded user|temporary user|userId:\s*["']|user_id:\s*["']|auth\.uid\(\)\s*=\s*["'])/i;

for (const entry of sourceFilesToScan) {
  const fullPath = path.join(root, entry);
  if (!existsSync(fullPath)) continue;
}

const sourceSnapshot = [
  loginForm,
  callbackRoute,
  rootPage,
  readFileSync(path.join(root, "src/components/logout-button.tsx"), "utf8"),
  readFileSync(path.join(root, "src/components/auth-button.tsx"), "utf8"),
  proxy,
  workspaceUser,
].join("\n");

if (hardcodedIdentityPattern.test(sourceSnapshot)) {
  throw new Error("Auth implementation appears to contain a hardcoded user identity");
}

const visualSourceSnapshot = [
  globalsCss,
  tailwindConfig,
  workspaceShell,
  workspaceNavigation,
  readFileSync(path.join(root, "src/components/ui/dropdown-menu.tsx"), "utf8"),
].join("\n");

if (/(text-\[[^\]]*(vw|vmin|vmax)|tracking-|letter-spacing:\s*-[0-9.])/i.test(visualSourceSnapshot)) {
  throw new Error("Visual foundation should not use viewport-scaled font sizes or custom letter spacing");
}

console.log("Foundation validation passed");
