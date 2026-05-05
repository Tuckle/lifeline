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
  "src/app/(workspace)/add/page.tsx",
  "src/features/timeline/actions/create-timeline-event.ts",
  "src/features/timeline/components/memory-creation-form.tsx",
  "src/features/timeline/schemas/timeline-event-form.ts",
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
for (const snippet of ["requireWorkspaceUser(\"/timeline\")", "EmptyMemoryAtlasTimeline"]) {
  if (!timelinePage.includes(snippet)) {
    throw new Error(`Timeline page is missing empty Memory Atlas integration: ${snippet}`);
  }
}

const addPage = readFileSync(path.join(root, "src/app/(workspace)/add/page.tsx"), "utf8");
for (const snippet of ["requireWorkspaceUser(\"/add\")", "MemoryCreationForm"]) {
  if (!addPage.includes(snippet)) {
    throw new Error(`Add page is missing memory creation integration: ${snippet}`);
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
  "revalidatePath(\"/timeline\")",
]) {
  if (!createTimelineEventAction.includes(snippet)) {
    throw new Error(`Create timeline event action is missing expected snippet: ${snippet}`);
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
