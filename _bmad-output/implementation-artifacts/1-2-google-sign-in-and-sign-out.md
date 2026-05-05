# Story 1.2: Google Sign-In and Sign-Out

Status: done

<!-- Validation note: Story context created from epics, PRD, architecture, UX spec, previous story record, current code, git history, and current Supabase Auth docs. -->

## Story

As a Lifeline user,  
I want to sign in and out with Google,  
so that my life timeline is private and tied to my own account.

## Acceptance Criteria

1. Given I am not authenticated, when I open Lifeline, then I see a sign-in screen with a Google sign-in action, and the screen uses calm product framing that describes Lifeline as private reflection and life visualization.
2. Given I choose Google sign-in, when Supabase Auth completes the OAuth callback successfully, then I am authenticated into my Lifeline workspace, and the app stores no private timeline data in public routes, metadata, previews, or unauthenticated states.
3. Given Google sign-in fails or is canceled, when I return to Lifeline, then I see a calm, specific error or canceled state, and I can retry sign-in without losing app stability.
4. Given I am authenticated, when I choose sign out, then my session ends, and I return to the unauthenticated sign-in experience.
5. Given auth code is implemented, when access rules are reviewed, then Supabase Auth identity is the root ownership key for future user-owned records, and no temporary bypass or hardcoded user identity is used.

## Tasks / Subtasks

- [x] Replace starter email/password-first login with Google OAuth sign-in. (AC: 1, 2, 3)
  - [x] Update `src/components/login-form.tsx` to present Lifeline-specific private reflection/life-visualization framing and a primary Google sign-in action.
  - [x] Use the existing browser Supabase client from `src/lib/supabase/client.ts`; do not introduce a second Supabase client factory.
  - [x] Call `supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo } })` with a callback URL under this app.
  - [x] Keep the retry path stable when Supabase returns an error; show a calm inline error or canceled state rather than throwing.
  - [x] Remove or de-emphasize starter sign-up/password copy from the primary sign-in experience. Do not implement additional email/password auth flows in this story.

- [x] Add the Google OAuth callback route. (AC: 2, 3)
  - [x] Add `src/app/auth/callback/route.ts`.
  - [x] Read `code`, `error`, `error_description`, and optional `next` search params from the callback request.
  - [x] For successful callbacks, create the server Supabase client from `src/lib/supabase/server.ts` and call `supabase.auth.exchangeCodeForSession(code)`.
  - [x] Redirect successful sign-in to the temporary authenticated workspace route `/protected` until Story 1.3 introduces the final private route set.
  - [x] Reject unsafe external `next` values; only allow relative paths beginning with `/`.
  - [x] Redirect failed, canceled, or missing-code callbacks to `/auth/error` with a specific safe error message.

- [x] Make sign-out return users to the unauthenticated Lifeline sign-in experience. (AC: 4)
  - [x] Update `src/components/logout-button.tsx` to await `supabase.auth.signOut()`.
  - [x] Redirect to `/auth/login` after sign-out and refresh router state so server-rendered auth UI reflects the ended session.
  - [x] Avoid leaving authenticated-only user details visible after sign-out.

- [x] Remove public/private-data leakage from auth-adjacent starter surfaces. (AC: 2, 5)
  - [x] Update `src/app/layout.tsx` metadata from generic Supabase starter copy to Lifeline private-workspace copy without mentioning private user content.
  - [x] Update `src/components/auth-button.tsx` if needed so unauthenticated users see a single sign-in path and authenticated users can sign out.
  - [x] Do not add mock timeline data, fake memories, imported data, photos, reflections, or future intentions.
  - [x] Do not create a hardcoded user id, bypass auth checks, or persist any user-owned product records.

- [x] Update configuration docs for Google OAuth. (AC: 1, 2, 3)
  - [x] Update `.env.example` and/or `README.md` with Google OAuth setup notes: Supabase Site URL, redirect allow list, and local callback URL expectations.
  - [x] Keep Google client ID/secret out of `NEXT_PUBLIC_*`; those belong in Supabase provider configuration or non-public local environment if ever needed by future server code.

- [x] Add validation coverage for the auth foundation. (AC: 1-5)
  - [x] Extend `scripts/validate-foundation.mjs` or add a focused validation script that checks for the Google OAuth call, callback route, `exchangeCodeForSession`, relative `next` guarding, Lifeline auth copy, and no hardcoded user identity.
  - [x] Ensure `npm test` runs the validation.
  - [x] Run `npm run typecheck`, `npm run lint`, `npm test`, `npm audit --omit=dev`, and a local dev-server smoke check.

### Review Findings

- [x] [Review][Patch] Google sign-in button could attempt Supabase client creation when env vars are missing — fixed by disabling the button and showing setup guidance until Supabase public env vars are configured.

## Dev Notes

### Current Code State

- Story 1.1 is complete and pushed to `origin/main` at commit `d44091e` (`Initialize Lifeline foundation`).
- The current app is the Supabase `with-supabase` starter moved under `src/`, with Supabase clients split under `src/lib/supabase/`.
- `src/components/login-form.tsx` currently implements email/password login and starter copy. This story should make Google sign-in the primary Lifeline login path.
- `src/components/logout-button.tsx` already calls `supabase.auth.signOut()` and routes to `/auth/login`, but it should refresh server auth state after sign-out.
- `src/components/auth-button.tsx` currently displays starter sign-in/sign-up choices for unauthenticated users and user email plus logout for authenticated users. Keep it simple and Google-login aligned.
- `src/app/auth/confirm/route.ts` exists for email OTP verification. Do not confuse it with the OAuth callback; add `src/app/auth/callback/route.ts` for Google OAuth PKCE code exchange.
- `src/app/protected/page.tsx` is the only current authenticated workspace-like route. Use it as the temporary post-login destination until Story 1.3 adds `/timeline`, `/add`, `/imports`, `/reflect`, `/search`, and `/settings` protection.

### Previous Story Intelligence

- Use Homebrew Node/npm in this Codex environment when running npm scripts: `PATH="/opt/homebrew/bin:$PATH" npm ...`.
- The project uses exact framework pins and an npm PostCSS override; do not revert dependency pinning to `latest`.
- `eslint.config.mjs` imports `eslint-config-next/core-web-vitals` directly. Do not reintroduce `FlatCompat` for Next 16.
- `ThemeSwitcher` uses `useSyncExternalStore` to avoid React 19 `set-state-in-effect` lint errors. Keep React 19 lint expectations in mind.
- `.gitignore` intentionally ignores `.env*` but unignores `.env.example`; do not commit local credentials.
- Foundation validation lives in `scripts/validate-foundation.mjs` and runs through `npm test`.

### Architecture Guardrails

- Supabase Auth identity is the root ownership key for all future user-owned records. Do not add hardcoded owner ids or temporary auth bypasses. [Source: `/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/architecture.md` - Data Architecture]
- Google login is required from day one through Supabase Auth. [Source: `/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/architecture.md` - Technical Constraints & Dependencies]
- Use cookie-based SSR auth patterns from the existing Supabase starter. Server code must use `src/lib/supabase/server.ts`; browser interactions must use `src/lib/supabase/client.ts`. [Source: `/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/architecture.md` - Structure Patterns]
- Sensitive source tokens and secrets must never be exposed through `NEXT_PUBLIC_*`. [Source: `/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/architecture.md` - Security and Enforcement Guidelines]
- Private user data must never appear in public routes, metadata, previews, or unauthenticated states. [Source: `/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/ux-design-specification.md` - Accessibility and Privacy Notes]
- Use Lifeline language around private reflection and life visualization; avoid clinical, therapy-claim, or unfinished-feature claims. [Source: `/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/prd.md` - Product Overview]

### Latest Technical Notes

- Supabase's current Google social login docs require configuring Google as a Supabase Auth provider and using `signInWithOAuth({ provider: "google" })` from app code. For SSR/PKCE flows, pass `options.redirectTo` pointing to an app callback route. [Source: Supabase Google login docs, https://supabase.com/docs/guides/auth/social-login/auth-google]
- Supabase's Google login docs show Next.js callback routes calling `exchangeCodeForSession(code)` to persist the session in the server-side auth flow. [Source: Supabase Google login docs, https://supabase.com/docs/guides/auth/social-login/auth-google]
- Supabase redirect URL docs say OAuth flows depend on configured Site URL / redirect allow-list values; local development callback URLs must be allowed. [Source: Supabase redirect URL docs, https://supabase.com/docs/guides/auth/redirect-urls]
- Supabase's Next.js auth quickstart confirms the `with-supabase` template is preconfigured for cookie-based Auth, TypeScript, and Tailwind CSS. [Source: Supabase Next.js Auth quickstart, https://supabase.com/docs/guides/auth/quickstarts/nextjs]

### File Structure Requirements

Expected touched files:

```text
.env.example
README.md
scripts/validate-foundation.mjs
src/app/auth/callback/route.ts
src/app/layout.tsx
src/components/auth-button.tsx
src/components/login-form.tsx
src/components/logout-button.tsx
```

Do not add database migrations or user-owned tables in this story. Auth identity is enough; Story 1.3 and later data stories own protected routes, schema, and RLS.

### Testing Standards

- Required commands: `npm run typecheck`, `npm run lint`, `npm test`, `npm audit --omit=dev`.
- Local smoke: app returns HTTP 200; `/auth/login` renders the Lifeline Google sign-in surface without Supabase credentials; after env configuration, the Google button should initiate the Supabase OAuth redirect.
- Automated validation should inspect source for the OAuth callback and no unsafe `next` redirect behavior.
- Real Google OAuth end-to-end completion requires Supabase project/provider configuration and cannot be fully completed with placeholder `.env.example` values alone.

### Scope Boundaries

This story must not implement:

- Final protected route set or route groups for `/timeline`, `/add`, `/imports`, `/reflect`, `/search`, `/settings`; Story 1.3 owns that.
- App shell navigation; Story 1.4 owns that.
- Lifeline design token implementation beyond auth copy and existing UI primitives; Story 1.5 owns that.
- Timeline schema, RLS policies, event data, imports, reflections, photos, or offline drafts.
- Google One Tap, account linking, multiple providers, OAuth token storage for Google APIs, or import-source authorization. Future import stories own provider tokens and source permissions.

### References

- [Epics Story 1.2](/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/epics.md)
- [PRD Functional Requirements](/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/prd.md)
- [Architecture Decision Document](/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/architecture.md)
- [UX Design Specification](/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/ux-design-specification.md)
- [Previous Story 1.1](/Users/Tuckle/Projects/lifeline/_bmad-output/implementation-artifacts/1-1-initialize-authenticated-app-foundation.md)
- [Supabase Google login](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Supabase redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls)
- [Supabase Auth with Next.js](https://supabase.com/docs/guides/auth/quickstarts/nextjs)

## Dev Agent Record

### Agent Model Used

Codex (GPT-5)

### Debug Log References

- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm test` passed through updated `scripts/validate-foundation.mjs`.
- `npm audit --omit=dev` reported 0 vulnerabilities.
- `curl -I http://localhost:3000` returned 307 to `/auth/login`.
- `curl -I http://localhost:3000/auth/login` returned 200.
- `curl -I 'http://localhost:3000/auth/callback?error=access_denied&error_description=Cancelled'` returned 307 to `/auth/error?error=Cancelled`.
- Code review follow-up fixed the missing-env login edge case and extended validation to cover it.
- Final review pass confirmed no unresolved findings; Story 1.2 moved to done.

### Completion Notes List

- Story context generated by BMad Create Story workflow on 2026-05-05.
- Previous Story 1.1 completed foundation setup, dependency audit remediation, and initial GitHub sync to `git@github.com:Tuckle/lifeline.git`.
- Replaced the starter email/password primary login surface with a Lifeline Google OAuth sign-in experience.
- Added `/auth/callback` for Supabase Google OAuth PKCE code exchange with guarded relative `next` redirects and calm error redirects.
- Routed `/` to `/auth/login` when unauthenticated or env is missing, and to `/protected` when a Supabase session is available.
- Updated sign-out, metadata, auth button, env warning, README, `.env.example`, and validation coverage.
- Real Google OAuth completion still requires Supabase project/provider configuration and redirect allow-list setup.
- Code review finding was resolved and the story is done.

### File List

- `/Users/Tuckle/Projects/lifeline/_bmad-output/implementation-artifacts/1-2-google-sign-in-and-sign-out.md`
- `.env.example`
- `README.md`
- `scripts/validate-foundation.mjs`
- `src/app/auth/callback/route.ts`
- `src/app/auth/error/page.tsx`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/components/auth-button.tsx`
- `src/components/env-var-warning.tsx`
- `src/components/login-form.tsx`
- `src/components/logout-button.tsx`

### Change Log

- 2026-05-05: Implemented Google-first sign-in/out flow, OAuth callback route, calm auth error handling, docs, validation, and moved story to review.
- 2026-05-05: Resolved code-review missing-env edge case for Google sign-in.
- 2026-05-05: Completed final review pass and moved story to done.
