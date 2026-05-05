# Story 1.1: Initialize Authenticated App Foundation

Status: done

<!-- Validation note: Story context created from PRD, architecture, UX spec, epics, sprint status, and current official framework docs. -->

## Story

As a Lifeline user,  
I want the app to have a stable private-web foundation,  
so that I can later access my life timeline through a secure, modern web experience.

## Acceptance Criteria

1. Given the Lifeline repository is ready for implementation, when the developer initializes the app foundation, then the project uses the Supabase Next.js starter or equivalent Next.js App Router setup with TypeScript, Tailwind CSS, and Supabase client/server utilities, and the codebase has a clear `src/app`, `src/features`, `src/components`, and `src/lib` structure aligned with the architecture.
2. Given the app foundation exists, when environment configuration is added, then `.env.example` documents required Supabase and app environment variables without containing secrets, and local secrets are expected only in ignored local environment files.
3. Given the app foundation exists, when the developer adds baseline shared utilities, then the codebase includes the shared `ActionResult<T>` result shape for app-owned mutations, and server/client Supabase utilities are separated by runtime.
4. Given the app foundation exists, when architectural conventions are established, then database naming, route naming, code naming, domain organization, test organization, deployment assumptions, and local-vs-shared state guidance match the architecture, and the project includes a recoverability path for user-created data through Supabase backups or equivalent data-protection planning.
5. Given the app foundation exists, when continuous integration is configured, then `.github/workflows/ci.yml` runs dependency installation, TypeScript checks, lint checks, and available automated tests on pull requests or pushes, and the workflow is allowed to skip test execution only when no test script exists yet, with the expectation that later stories add tests to the same CI path.
6. Given the app foundation exists, when the developer runs validation, then TypeScript and lint checks pass, and the app can start locally without accessing private user data or requiring unfinished future timeline features.

## Tasks / Subtasks

- [x] Initialize the Next.js + Supabase app foundation without destroying planning artifacts. (AC: 1)
  - [x] Inspect the workspace before scaffolding. This root already contains `.agents`, `_bmad`, `_bmad-output`, and `docs`; preserve them.
  - [x] Use the official Supabase `with-supabase` starter or equivalent App Router setup. If `create-next-app` refuses the non-empty root, scaffold in a temporary directory and copy generated app files into this root while preserving existing BMad/planning folders.
  - [x] Keep the generated app in this project root, not nested under a second `lifeline/` folder.
  - [x] Ensure the project uses TypeScript, Tailwind CSS, App Router, and Supabase client/server utilities.

- [x] Establish the required source structure and placeholder domains. (AC: 1, 4)
  - [x] Ensure `src/app`, `src/components`, `src/lib`, and `src/features` exist.
  - [x] Create domain folders required by architecture: `src/features/timeline`, `src/features/imports`, `src/features/reviews`, `src/features/settings`, `src/features/auth`, and `src/features/offline`.
  - [x] Create shared component folders `src/components/ui` and `src/components/layout`.
  - [x] Do not implement feature behavior for later stories; only create enough structure to prevent file-placement drift.

- [x] Add environment configuration documentation. (AC: 2)
  - [x] Provide `.env.example` with non-secret placeholders for Supabase URL/key values needed by the starter.
  - [x] Use Supabase's current public/publishable key naming where applicable, such as `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
  - [x] Ensure local secret files remain ignored by `.gitignore`.
  - [x] Do not add real credentials, tokens, service role keys, import secrets, or private source tokens.

- [x] Add baseline shared utilities. (AC: 3)
  - [x] Create `src/lib/action-result.ts` with the architecture's shared `ActionResult<T>` union.
  - [x] Confirm Supabase utilities are split by runtime, with browser and server clients separated under `src/lib/supabase/`.
  - [x] Add `src/lib/errors.ts`, `src/lib/logger.ts`, `src/lib/dates.ts`, and `src/lib/utils.ts` as minimal placeholders only if helpful for architecture alignment; do not invent behavior beyond this story.

- [x] Establish architectural conventions in files and docs. (AC: 4)
  - [x] Ensure app route structure can later support `/timeline`, `/add`, `/imports`, `/reflect`, `/search`, and `/settings`.
  - [x] Use `src/features/reviews` as the implementation domain behind the future `/reflect` route.
  - [x] Use kebab-case route segments, PascalCase components/types, camelCase TypeScript names, and snake_case database naming guidance.
  - [x] Add `supabase/migrations/` and `supabase/seed.sql` placeholders only if the starter does not create them; do not define full product schema in this story.
  - [x] Document recoverability expectation in `README.md` or `docs/architecture.md`: user-created data recoverability will rely on Supabase backups or equivalent implementation-stage data protection.

- [x] Add CI workflow. (AC: 5)
  - [x] Create `.github/workflows/ci.yml`.
  - [x] Use GitHub Actions with Node setup and dependency installation.
  - [x] Run TypeScript checks, lint checks, and tests if scripts exist.
  - [x] Permit the test step to skip cleanly only while no test script exists; later stories must wire tests into the same CI path.

- [x] Validate the foundation locally. (AC: 6)
  - [x] Run dependency installation.
  - [x] Run type checking.
  - [x] Run linting.
  - [x] Start the local dev server long enough to verify the app boots.
  - [x] Confirm no private user data, fake timeline data, or unfinished future feature claims appear in the starter surface.

### Review Findings

- [x] [Review][Decision] Production dependency audit still reports a moderate advisory — resolved by pinning reviewed framework/dependency versions, adding an npm PostCSS override, refreshing the lockfile, and confirming `npm audit --omit=dev` reports 0 vulnerabilities.
- [x] [Review][Patch] Replace unpinned `latest` dependency ranges with reviewed versions [/Users/Tuckle/Projects/lifeline/package.json:16]
- [x] [Review][Patch] Document the remaining AC4 architecture conventions [/Users/Tuckle/Projects/lifeline/README.md:54]

## Dev Notes

### Current Workspace State

- At story creation time, `/Users/Tuckle/Projects/lifeline` is not a git repository and contains planning/config folders only: `.agent`, `.agents`, `_bmad`, `_bmad-output`, and `docs`.
- There is no existing app source, `package.json`, or implementation code yet. No UPDATE files are expected at the start of this story.
- Because the root is non-empty, do not blindly run a scaffolding command that creates a nested app or deletes BMad artifacts. The safe pattern is: generate the Supabase starter in a temporary directory if needed, then merge/copy the generated app files into the existing root while preserving planning folders.

### Product and Business Context

- Lifeline is a private full-stack web app for a personal life timeline with sensitive memories, notes, imports, reflections, photos, and future intentions. Privacy and authenticated owner access are foundational, not later polish. [Source: `/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/architecture.md` - Project Context Analysis]
- MVP requires desktop and mobile web support, Google login from day one, no public SEO dependency for private content, staged imports, and scoped offline drafting later. This story should set the foundation without implementing those later feature flows. [Source: `/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/architecture.md` - Technical Constraints & Dependencies]

### Architecture Guardrails

- Preferred starter: official Supabase Next.js starter using `with-supabase`; architecture names `npx create-next-app@latest --example with-supabase lifeline`, but because this workspace already exists, adapt the command safely for the current root. [Source: `/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/architecture.md` - Selected Starter]
- Required stack: TypeScript-first Next.js App Router, React, Tailwind CSS, Supabase Auth/client-server utilities, and Vercel-compatible build path. [Source: `/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/architecture.md` - Architectural Decisions Provided by Starter]
- UI foundation: Tailwind CSS plus shadcn/ui-style primitives and Lifeline design tokens. Do not introduce Material UI, Ant Design, Chakra, Bootstrap, or a competing UI framework. [Source: `/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/architecture.md` - Frontend Architecture]
- MVP accessibility target is WCAG 2.2 AA. This story should not fully implement the visual system, but it must avoid foundation choices that make keyboard navigation, semantic HTML, focus states, reduced motion, or readable responsive UI difficult later. [Source: `/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/ux-design-specification.md` - Accessibility Strategy]
- Keep app routes consistent with the resolved MVP route set: `/timeline`, `/add`, `/imports`, `/reflect`, `/search`, and `/settings`. [Source: `/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/architecture.md` - API Naming Conventions]
- Implementation domains must live under `src/features/`: `timeline`, `imports`, `reviews`, `settings`, `auth`, and `offline`. The user-facing Reflect route maps to `src/features/reviews`. [Source: `/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/architecture.md` - Structure Patterns]
- Sensitive operations and future import tokens/secrets must remain server-side. Never put import secrets, service-role keys, or private source tokens in `NEXT_PUBLIC_*`. [Source: `/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/architecture.md` - Security and Enforcement Guidelines]

### Required Shared Utility Contract

Create `src/lib/action-result.ts` with this exact shape unless the starter already provides an equivalent:

```ts
export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: string; message: string; field?: string } };
```

Stable error codes should be machine-readable strings such as `permission_denied`, `timeline_event_not_found`, `import_auth_failed`, or `offline_conflict` when future stories add behavior. [Source: `/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/architecture.md` - API Response Formats]

### File Structure Requirements

The target structure after this story should include at least:

```text
.github/workflows/ci.yml
.env.example
README.md
package.json
src/app/
src/components/ui/
src/components/layout/
src/features/auth/
src/features/timeline/
src/features/imports/
src/features/reviews/
src/features/settings/
src/features/offline/
src/lib/action-result.ts
src/lib/supabase/
supabase/migrations/
```

Do not add product database tables ahead of their first feature story. It is acceptable to create empty migration folders or starter Supabase config placeholders, but schema/RLS for timeline, imports, reviews, offline drafts, export, and deletion belongs to later stories unless required by the starter.

### CI Requirements

- Use GitHub Actions under `.github/workflows/ci.yml`.
- Use `actions/setup-node` for consistent Node setup. Official GitHub docs recommend setup-node for consistent behavior across runners and versions.
- Prefer `npm ci` when a lockfile exists. If the starter generates a different package manager, use that package manager consistently and document it in the CI file or README.
- CI must run available `typecheck`, `lint`, and test scripts. If there is no test script yet, make the skip explicit and non-failing until a later story adds tests.
- Suggested initial CI commands, adjusted to actual scripts after scaffolding:

```yaml
- uses: actions/checkout@v6
- uses: actions/setup-node@v4
  with:
    node-version: "20.x"
    cache: "npm"
- run: npm ci
- run: npm run typecheck --if-present
- run: npm run lint --if-present
- run: npm test --if-present
```

### Latest Technical Notes

- Next.js `create-next-app` docs were last updated March 31, 2026 and list TypeScript, Tailwind, App Router, `src` directory support, import alias support, and Turbopack defaults among current CLI options. Use the current CLI behavior rather than older Next.js setup assumptions. [Source: Next.js create-next-app CLI docs, https://nextjs.org/docs/pages/api-reference/cli/create-next-app]
- Supabase's current Next.js quickstart documents the `with-supabase` template as preconfigured with cookie-based Auth, TypeScript, and Tailwind CSS. [Source: Supabase Next.js quickstart, https://supabase.com/docs/guides/getting-started/quickstarts/nextjs]
- Supabase SSR docs say Next.js apps need separate browser and server clients and can place those utilities in `lib/supabase` or `src/lib/supabase`. Follow the architecture's `src/lib/supabase` convention. [Source: Supabase SSR client docs, https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=nextjs]
- shadcn/ui installation docs support Next.js and current CLI setup. Use it as a component-source pattern, not as a runtime framework replacement. [Source: shadcn/ui installation docs, https://ui.shadcn.com/docs/installation]
- GitHub's Node.js Actions docs recommend `actions/setup-node` and show installing dependencies and running build/test commands in CI. [Source: GitHub Actions Node.js docs, https://docs.github.com/en/actions/tutorials/build-and-test-code/nodejs]

### Scope Boundaries

This story must not implement:

- Google OAuth sign-in/out UX beyond what the starter provides; Story 1.2 owns Google sign-in and sign-out.
- Protected private app routing beyond starter-safe placeholders; Story 1.3 owns authenticated route protection.
- Full app shell navigation; Story 1.4 owns responsive shell navigation.
- Lifeline design token implementation beyond minimal Tailwind/shadcn compatibility; Story 1.5 owns baseline accessible UI foundation.
- Timeline schema, timeline events, imports, offline drafts, export/delete behavior, or user data tables.
- Real user data, mock sensitive memories, fake imports, or product copy that claims unfinished features are available.

### Testing Standards

- Required validation for this story: install, typecheck, lint, and local dev boot.
- If a generated `test` script exists, run it and include results in Dev Agent Record.
- If no tests exist yet, document that in Completion Notes and ensure CI uses `--if-present` or equivalent.
- Manual smoke test: open the dev server and confirm the starter/default page renders without exposing private content or claiming unfinished Lifeline features.
- Because this story establishes the root toolchain, failing typecheck/lint/dev boot is a blocker.

### Project Structure Notes

- Expected route names are already resolved in architecture and epics. Do not use `/reviews` as the public route; use `/reflect` when route placeholders are introduced. Keep `src/features/reviews` for the implementation domain.
- `docs/`, `.agents/`, `_bmad/`, and `_bmad-output/` are planning/agent assets and must be preserved.
- There is no git history available at story creation time, so no previous commit intelligence is available.
- There is no previous story in Epic 1, so no previous story intelligence applies.

### References

- [Epics Story 1.1](/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/epics.md)
- [Architecture Decision Document](/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/architecture.md)
- [UX Design Specification](/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/ux-design-specification.md)
- [Sprint Status](/Users/Tuckle/Projects/lifeline/_bmad-output/implementation-artifacts/sprint-status.yaml)
- [Next.js create-next-app CLI](https://nextjs.org/docs/pages/api-reference/cli/create-next-app)
- [Supabase Next.js quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Supabase SSR clients for Next.js](https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=nextjs)
- [shadcn/ui installation](https://ui.shadcn.com/docs/installation)
- [GitHub Actions Node.js CI](https://docs.github.com/en/actions/tutorials/build-and-test-code/nodejs)

## Dev Agent Record

### Agent Model Used

Codex (GPT-5)

### Debug Log References

- `node scripts/validate-foundation.mjs` failed before implementation, as expected, because the app foundation files did not exist yet.
- `npx create-next-app@latest --example with-supabase lifeline-scaffold --use-npm --yes` generated the Supabase starter in a temporary directory.
- `rsync` copied the generated starter into the existing root while preserving `.agents`, `_bmad`, `_bmad-output`, and `docs`.
- `npm install` completed successfully using the local Homebrew npm path; npm reported 2 moderate audit findings with a breaking-force fix path.
- `npm run typecheck` passed.
- `npm run lint` initially caught a CommonJS Tailwind plugin import and later caught `.next/` generated output after the dev server booted; both were fixed.
- `npm test` passed through `scripts/validate-foundation.mjs`.
- `npm run dev` booted successfully with Homebrew Node/npm at the front of `PATH`, and `curl -I http://localhost:3000` returned HTTP 200.
- Code review follow-up fixed dependency pinning, PostCSS audit remediation, README convention coverage, and Next 16 ESLint config compatibility.
- `npm run typecheck`, `npm run lint`, `npm test`, `npm audit --omit=dev`, and `curl -I http://localhost:3000` passed on 2026-05-05.

### Completion Notes List

- Story context generated by BMad Create Story workflow on 2026-05-04.
- No previous story context exists.
- No git repository detected at story creation time.
- Initialized the Supabase Next.js App Router foundation in the existing project root without removing BMad or planning artifacts.
- Moved generated app code into the required `src/app`, `src/components`, and `src/lib` structure, and added placeholder feature domains for auth, timeline, imports, reviews, settings, and offline.
- Added `.env.example`, README architecture conventions, Supabase runtime split, shared `ActionResult<T>`, baseline utility placeholders, Supabase migration/seed placeholders, and GitHub Actions CI.
- Added `scripts/validate-foundation.mjs` as the first foundation test and wired it to `npm test`.
- Validation passed: install, typecheck, lint, foundation test, and local HTTP 200 smoke test. The starter surface contains no private user data or fake Lifeline timeline data.
- Local dev boot requires Node/npm from the same toolchain as installed native modules in this Codex environment; `PATH="/opt/homebrew/bin:$PATH" npm run dev` worked.
- Code review findings were resolved and the story is complete.

### File List

- `/Users/Tuckle/Projects/lifeline/_bmad-output/implementation-artifacts/1-1-initialize-authenticated-app-foundation.md`
- `.env.example`
- `.github/workflows/ci.yml`
- `.gitignore`
- `README.md`
- `components.json`
- `eslint.config.mjs`
- `next-env.d.ts`
- `next.config.ts`
- `package-lock.json`
- `package.json`
- `postcss.config.mjs`
- `proxy.ts`
- `scripts/validate-foundation.mjs`
- `src/app/auth/confirm/route.ts`
- `src/app/auth/error/page.tsx`
- `src/app/auth/forgot-password/page.tsx`
- `src/app/auth/login/page.tsx`
- `src/app/auth/sign-up-success/page.tsx`
- `src/app/auth/sign-up/page.tsx`
- `src/app/auth/update-password/page.tsx`
- `src/app/favicon.ico`
- `src/app/globals.css`
- `src/app/layout.tsx`
- `src/app/opengraph-image.png`
- `src/app/page.tsx`
- `src/app/protected/layout.tsx`
- `src/app/protected/page.tsx`
- `src/app/twitter-image.png`
- `src/components/auth-button.tsx`
- `src/components/deploy-button.tsx`
- `src/components/env-var-warning.tsx`
- `src/components/forgot-password-form.tsx`
- `src/components/hero.tsx`
- `src/components/layout/.gitkeep`
- `src/components/login-form.tsx`
- `src/components/logout-button.tsx`
- `src/components/next-logo.tsx`
- `src/components/sign-up-form.tsx`
- `src/components/supabase-logo.tsx`
- `src/components/theme-switcher.tsx`
- `src/components/tutorial/code-block.tsx`
- `src/components/tutorial/connect-supabase-steps.tsx`
- `src/components/tutorial/fetch-data-steps.tsx`
- `src/components/tutorial/sign-up-user-steps.tsx`
- `src/components/tutorial/tutorial-step.tsx`
- `src/components/ui/badge.tsx`
- `src/components/ui/button.tsx`
- `src/components/ui/card.tsx`
- `src/components/ui/checkbox.tsx`
- `src/components/ui/dropdown-menu.tsx`
- `src/components/ui/input.tsx`
- `src/components/ui/label.tsx`
- `src/components/update-password-form.tsx`
- `src/features/auth/.gitkeep`
- `src/features/imports/.gitkeep`
- `src/features/offline/.gitkeep`
- `src/features/reviews/.gitkeep`
- `src/features/settings/.gitkeep`
- `src/features/timeline/.gitkeep`
- `src/lib/action-result.ts`
- `src/lib/dates.ts`
- `src/lib/errors.ts`
- `src/lib/logger.ts`
- `src/lib/supabase/client.ts`
- `src/lib/supabase/proxy.ts`
- `src/lib/supabase/server.ts`
- `src/lib/utils.ts`
- `supabase/migrations/.gitkeep`
- `supabase/seed.sql`
- `tailwind.config.ts`
- `tsconfig.json`

### Change Log

- 2026-05-04: Initialized the authenticated Supabase Next.js foundation, added required source/domain structure, environment docs, baseline utilities, CI, and local validation script; moved story to review.
- 2026-05-05: Resolved code-review findings, refreshed dependency lockfile with 0 production audit vulnerabilities, updated README convention coverage, and moved story to done.
