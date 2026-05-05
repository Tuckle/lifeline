import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();

const requiredPaths = [
  "package.json",
  ".env.example",
  ".gitignore",
  "README.md",
  ".github/workflows/ci.yml",
  "src/app",
  "src/components/ui",
  "src/components/layout",
  "src/features/auth",
  "src/features/timeline",
  "src/features/imports",
  "src/features/reviews",
  "src/features/settings",
  "src/features/offline",
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
  "Supabase backups",
]) {
  if (!readme.includes(snippet)) {
    throw new Error(`README.md is missing foundation convention: ${snippet}`);
  }
}

console.log("Foundation validation passed");
