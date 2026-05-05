# Story 1.3: Protected Private Workspace Routing

Status: done

<!-- Validation note: Story context created from epics, architecture, UX spec, previous stories, current code, and current Next.js/Supabase auth docs. -->

## Story

As an authenticated Lifeline user,  
I want private app pages to require my account session,  
so that my life data cannot be reached by unauthenticated visitors or other users.

## Acceptance Criteria

1. Given I am not authenticated, when I try to open an authenticated app route such as `/timeline`, `/add`, `/imports`, `/reflect`, `/search`, or `/settings`, then I am redirected to the sign-in experience, and no private app shell content or private user data is rendered before authentication is confirmed.
2. Given I am authenticated, when I open an authenticated app route, then the route loads inside the private workspace, and the authenticated user identity is available to server-side route/action code.
3. Given protected routing is implemented, when unauthenticated crawlers, previews, or metadata requests access private app routes, then private user content is not exposed in route metadata, page previews, or unauthenticated HTML.
4. Given a future user-owned table is added, when server-side access patterns are used, then the route/action structure supports user-scoped access through Supabase Auth and RLS, and no private route relies on client-only checks for protection.
5. Given I am signed in on mobile or desktop, when I refresh a protected route, then the app preserves the authenticated routing state, and does not briefly flash unauthenticated-only or private-only content in the wrong state.

## Tasks / Subtasks

- [x] Add the authenticated route set as protected placeholder routes. (AC: 1, 2, 3)
  - [x] Add App Router pages for `/timeline`, `/add`, `/imports`, `/reflect`, `/search`, and `/settings`.
  - [x] Place the routes under a route group or shared layout that makes their private-workspace status clear without changing the public URL paths.
  - [x] Use generic placeholder content only; do not add timeline data, memories, imports, reflections, photos, or future intentions.
  - [x] Add generic metadata only; do not expose private user content in titles/descriptions/previews.

- [x] Enforce server-side route protection. (AC: 1, 4, 5)
  - [x] Update `src/lib/supabase/proxy.ts` so the protected route set redirects unauthenticated requests to `/auth/login`.
  - [x] Preserve the intended protected path in a safe relative `next` query param when redirecting to login.
  - [x] Do not rely on client-only checks, local storage, or a hardcoded user identity for protection.
  - [x] Keep `/auth/*`, static assets, and public root auth routing working.

- [x] Preserve post-login routing state. (AC: 2, 5)
  - [x] Update the Google sign-in flow to pass a safe relative `next` value from `/auth/login?next=...` through the Supabase OAuth callback.
  - [x] Keep unsafe external `next` values rejected in both login initiation and callback handling.
  - [x] Default to `/protected` only when no safe next path is present.

- [x] Add a server-side auth helper for future route/action code. (AC: 2, 4)
  - [x] Add a small helper under `src/features/auth/` that returns the current Supabase Auth claims or redirects to login.
  - [x] Use existing `src/lib/supabase/server.ts`; do not create a second server client pattern.
  - [x] Keep the helper free of product table assumptions until schema/RLS stories add user-owned tables.

- [x] Extend validation coverage. (AC: 1-5)
  - [x] Update `scripts/validate-foundation.mjs` to verify protected route files, proxy route matching, next-param preservation, server-side auth helper, and absence of hardcoded user ids.
  - [x] Run `npm run typecheck`, `npm run lint`, `npm test`, `npm audit --omit=dev`, and local route smoke checks.

## Dev Notes

### Current Code State

- Story 1.2 is done and pushed to `origin/main` at commit `1a8f94b`.
- `/` currently redirects unauthenticated users to `/auth/login`; `/auth/login` starts Google OAuth and `/auth/callback` exchanges the code for a Supabase session.
- `src/lib/supabase/proxy.ts` already refreshes sessions using Supabase SSR and redirects unauthenticated non-auth paths, but it should be made explicit for the Lifeline protected route set and preserve `next`.
- `src/app/protected/` remains the temporary starter authenticated page. Keep it working, but the MVP route set should be `/timeline`, `/add`, `/imports`, `/reflect`, `/search`, and `/settings`.

### Architecture Guardrails

- Authenticated MVP app routes use fixed kebab-case path segments: `/timeline`, `/add`, `/imports`, `/reflect`, `/search`, and `/settings`. [Source: `/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/architecture.md` - API Naming Conventions]
- Route groups should separate authenticated app areas from auth/callback routes. [Source: `/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/architecture.md` - API Naming Conventions]
- Private user data must never appear in public routes, metadata, previews, or unauthenticated states. [Source: `/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/ux-design-specification.md` - Accessibility and Privacy Notes]
- Supabase Auth identity is the root ownership key for future user-owned records; RLS will enforce ownership once schema stories add tables. [Source: `/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/architecture.md` - Data Architecture]
- Next.js 16 Cache Components expects runtime request data such as cookies/search params to be accessed under Suspense or through server request boundaries. Prefer proxy-level auth checks and small request-time helpers over broad page-level cookie reads for static placeholder routes. [Source: Next.js Cache Components docs, https://nextjs.org/docs/app/getting-started/cache-components]

### Previous Story Intelligence

- Keep dependency pins and PostCSS override intact.
- Use `PATH="/opt/homebrew/bin:$PATH" npm ...` for local npm commands in this environment.
- Login button must stay disabled when Supabase env vars are missing.
- `scripts/validate-foundation.mjs` is the current lightweight validation path wired to `npm test`.

### Scope Boundaries

This story must not implement:

- Real app shell navigation; Story 1.4 owns responsive navigation.
- Lifeline design tokens; Story 1.5 owns baseline UI foundation.
- Timeline/event/import/reflection schemas, RLS policies, data loading, or mutations.
- Mock private user data or fake product records.

### References

- [Epics Story 1.3](/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/epics.md)
- [Architecture Decision Document](/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/architecture.md)
- [UX Design Specification](/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/ux-design-specification.md)
- [Previous Story 1.2](/Users/Tuckle/Projects/lifeline/_bmad-output/implementation-artifacts/1-2-google-sign-in-and-sign-out.md)
- [Next.js Cache Components](https://nextjs.org/docs/app/getting-started/cache-components)
- [Supabase Auth with Next.js](https://supabase.com/docs/guides/auth/quickstarts/nextjs)

## Dev Agent Record

### Agent Model Used

GPT-5

### Debug Log References

- `PATH="/opt/homebrew/bin:$PATH" npm run typecheck`
- `PATH="/opt/homebrew/bin:$PATH" npm run lint`
- `PATH="/opt/homebrew/bin:$PATH" npm test`
- `PATH="/opt/homebrew/bin:$PATH" npm audit --omit=dev`
- Local smoke checks:
  - `/` -> `307 /auth/login`
  - `/timeline` -> `307 /auth/login?next=%2Ftimeline`
  - `/add` -> `307 /auth/login?next=%2Fadd`
  - `/imports` -> `307 /auth/login?next=%2Fimports`
  - `/reflect` -> `307 /auth/login?next=%2Freflect`
  - `/search` -> `307 /auth/login?next=%2Fsearch`
  - `/settings` -> `307 /auth/login?next=%2Fsettings`
  - `/auth/login?next=%2Ftimeline` -> `200`

### Completion Notes List

- Story context generated by BMad Create Story workflow on 2026-05-05.
- Previous stories completed foundation setup and Google OAuth sign-in/out.
- Added private workspace placeholder routes under an authenticated route group.
- Protected workspace routes at the proxy layer and with a server-side auth helper for route/action code.
- Preserved safe relative `next` routing through login and OAuth callback initiation.
- Kept protected placeholders generic so unauthenticated metadata and HTML do not expose private content.
- Code review pass completed locally with no remaining findings after fixing the stale proxy location by moving the proxy entrypoint to `src/proxy.ts`.

### File List

- `/Users/Tuckle/Projects/lifeline/_bmad-output/implementation-artifacts/1-3-protected-private-workspace-routing.md`
- `/Users/Tuckle/Projects/lifeline/_bmad-output/implementation-artifacts/sprint-status.yaml`
- `/Users/Tuckle/Projects/lifeline/proxy.ts` (deleted)
- `/Users/Tuckle/Projects/lifeline/scripts/validate-foundation.mjs`
- `/Users/Tuckle/Projects/lifeline/src/app/(workspace)/add/page.tsx`
- `/Users/Tuckle/Projects/lifeline/src/app/(workspace)/imports/page.tsx`
- `/Users/Tuckle/Projects/lifeline/src/app/(workspace)/layout.tsx`
- `/Users/Tuckle/Projects/lifeline/src/app/(workspace)/reflect/page.tsx`
- `/Users/Tuckle/Projects/lifeline/src/app/(workspace)/search/page.tsx`
- `/Users/Tuckle/Projects/lifeline/src/app/(workspace)/settings/page.tsx`
- `/Users/Tuckle/Projects/lifeline/src/app/(workspace)/timeline/page.tsx`
- `/Users/Tuckle/Projects/lifeline/src/components/layout/workspace-placeholder.tsx`
- `/Users/Tuckle/Projects/lifeline/src/components/login-form.tsx`
- `/Users/Tuckle/Projects/lifeline/src/features/auth/require-workspace-user.ts`
- `/Users/Tuckle/Projects/lifeline/src/lib/supabase/proxy.ts`
- `/Users/Tuckle/Projects/lifeline/src/proxy.ts`

## Change Log

| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-05-05 | 1.0 | Implemented protected workspace routing and validation. | Amelia (Dev Agent) |
