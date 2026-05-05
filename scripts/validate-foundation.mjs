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
  "src/app/(workspace)/add/page.tsx",
  "src/app/(workspace)/imports/page.tsx",
  "src/app/(workspace)/reflect/page.tsx",
  "src/app/(workspace)/search/page.tsx",
  "src/app/(workspace)/settings/page.tsx",
  "src/components/layout/workspace-shell.tsx",
  "src/components/layout/workspace-navigation.tsx",
  "src/components/ui",
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

console.log("Foundation validation passed");
