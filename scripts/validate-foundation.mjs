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
  "supabase/migrations",
];

const missing = requiredPaths.filter((entry) => !existsSync(path.join(root, entry)));

if (missing.length > 0) {
  throw new Error(`Missing foundation paths: ${missing.join(", ")}`);
}

const packageJson = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
const scripts = packageJson.scripts ?? {};
const requiredScripts = ["dev", "lint", "typecheck", "test"];
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
for (const key of ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"]) {
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
for (const snippet of ["actions/setup-node", "npm ci", "npm run typecheck", "npm run lint", "npm test"]) {
  if (!ci.includes(snippet)) {
    throw new Error(`CI workflow is missing expected snippet: ${snippet}`);
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
for (const snippet of ["requireWorkspaceUser(\"/add\")", "MemoryCreationForm", "FutureIntentionForm"]) {
  if (!addPage.includes(snippet)) {
    throw new Error(`Add page is missing memory creation integration: ${snippet}`);
  }
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
  readFileSync(path.join(root, "src/app/(workspace)/settings/page.tsx"), "utf8"),
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
