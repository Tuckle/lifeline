# Story 1.4: Responsive App Shell Navigation

Status: done

<!-- Validation note: Story context created from epics, architecture, UX spec, previous stories, current code, and current app shell state. -->

## Story

As a Lifeline user,  
I want a simple responsive workspace shell,  
so that I can move between core areas on desktop and mobile without losing orientation.

## Acceptance Criteria

1. Given I am authenticated, when I enter the Lifeline workspace, then I see a private app shell with navigation for Timeline, Add, Imports, Reflect, Search, and Settings, Timeline is treated as the default emotional home surface, and the primary route paths are `/timeline`, `/add`, `/imports`, `/reflect`, `/search`, and `/settings`.
2. Given I use Lifeline on desktop, when the app shell renders, then navigation is visible and supports richer workspace pages such as timeline review, imports, reflection, search, and settings, and the layout has room for future detail panels without requiring those feature pages to be fully implemented in this story.
3. Given I use Lifeline on mobile, when the app shell renders, then navigation remains usable for quick capture, mandatory edits, lightweight review, reflection drafts, search, and privacy/source controls, and touch targets are at least 44px where practical.
4. Given I navigate between workspace routes, when the route changes, then the active navigation state updates clearly, and the app does not expose private data in public routes or unauthenticated states.
5. Given a workspace route is not implemented yet, when I open it from navigation, then I see a calm placeholder page that preserves the app shell, and the placeholder does not pretend unfinished functionality is complete.

## Tasks / Subtasks

- [x] Build the shared private workspace shell. (AC: 1, 2, 3)
  - [x] Add a reusable `WorkspaceShell` layout component under `src/components/layout/`.
  - [x] Render the shell from the authenticated route group layout without changing public URL paths.
  - [x] Include Lifeline product identity, a calm private-workspace label, and authenticated account controls.
  - [x] Keep route protection server-side through Story 1.3 helpers; do not add client-only auth gates.

- [x] Add responsive primary navigation. (AC: 1, 2, 3, 4)
  - [x] Include Timeline, Add, Imports, Reflect, Search, and Settings as the only MVP primary nav destinations.
  - [x] Use icons from `lucide-react` with accessible labels/text.
  - [x] Make desktop/tablet navigation visible in the shell header/sidebar area.
  - [x] Make mobile navigation usable with practical 44px touch targets.
  - [x] Show active route state using text, icons, and shape/weight rather than color alone.

- [x] Preserve calm placeholders inside the shell. (AC: 2, 5)
  - [x] Update current workspace placeholder pages so they render as page content inside the shell instead of full-page standalone surfaces.
  - [x] Keep copy honest about future functionality and avoid fake timeline/import/reflection data.
  - [x] Treat Timeline as the default emotional home surface while still placeholder-only.

- [x] Keep legacy starter protected route from competing with MVP workspace. (AC: 1, 4)
  - [x] Redirect `/protected` to `/timeline` now that `/timeline` is the workspace home.
  - [x] Remove starter-only protected shell noise from the private MVP path while keeping auth smoke compatibility.

- [x] Extend validation coverage. (AC: 1-5)
  - [x] Update `scripts/validate-foundation.mjs` to verify shell component, route-group shell usage, MVP nav destinations, active route logic, mobile touch-target classes, and `/protected` redirect.
  - [x] Run `npm run typecheck`, `npm run lint`, `npm test`, `npm audit --omit=dev`, and local route smoke checks.

## Dev Notes

### Current Code State

- Story 1.3 is done and pushed to `origin/main` at commit `089d235`.
- Protected workspace pages exist under `src/app/(workspace)/` for `/timeline`, `/add`, `/imports`, `/reflect`, `/search`, and `/settings`.
- Each workspace page calls `requireWorkspaceUser("/route")` before rendering generic placeholder content.
- `src/lib/supabase/proxy.ts` protects the MVP route set and preserves safe relative `next` params.
- `src/proxy.ts` is the active Next.js proxy entrypoint; keep it there.
- The old starter `/protected` route still exists and can be redirected to `/timeline` once the MVP shell is in place.

### UX Guardrails

- MVP primary navigation is Timeline, Add, Imports, Reflect, Search, and Settings. [Source: `/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/ux-design-specification.md` - Primary navigation]
- Chosen direction is Memory Atlas as emotional home, Studio as product structure, and Pattern Clarity as a contextual layer. [Source: UX Design Specification - Direction Synthesis]
- Mobile should focus on quick capture, lightweight review, reflection drafts, search, and privacy/source controls; desktop should support richer review/curation/reflection surfaces. [Source: UX Design Specification - Responsive Strategy]
- Touch targets should be at least 44px where practical, and color must not be the only indicator of meaning. [Source: UX Design Specification - Accessibility]
- Do not use shame-based, productivity-score, streak, or clinical language. [Source: UX Design Specification - Emotional Safety]

### Architecture Guardrails

- Use Tailwind CSS and the existing shadcn/ui-style primitives already in `src/components/ui/`.
- Use `lucide-react` icons already installed in the project for navigation.
- Shared layout components belong under `src/components/layout/`; domain-specific components stay under `src/features/*/components/`.
- Keep routes kebab-case and fixed to `/timeline`, `/add`, `/imports`, `/reflect`, `/search`, and `/settings`.
- Do not introduce data schemas, mock private records, client-only auth checks, or import/reflection/timeline mutations in this story.

### Previous Story Intelligence

- Use `PATH="/opt/homebrew/bin:$PATH" npm ...` for local npm commands in this environment.
- Next.js Cache Components can require Suspense around request-time server data; account controls that read auth claims should remain under Suspense.
- Login and protected route smoke checks should keep working after `/protected` redirects to `/timeline`.
- `scripts/validate-foundation.mjs` is the lightweight validation path wired to `npm test`.

### References

- [Epics Story 1.4](/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/epics.md)
- [UX Design Specification](/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/ux-design-specification.md)
- [Architecture Decision Document](/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/architecture.md)
- [Previous Story 1.3](/Users/Tuckle/Projects/lifeline/_bmad-output/implementation-artifacts/1-3-protected-private-workspace-routing.md)

## Dev Agent Record

### Agent Model Used

GPT-5

### Debug Log References

- `PATH="/opt/homebrew/bin:$PATH" npm run typecheck`
- `PATH="/opt/homebrew/bin:$PATH" npm run lint`
- `PATH="/opt/homebrew/bin:$PATH" npm test`
- `PATH="/opt/homebrew/bin:$PATH" npm audit --omit=dev`
- `PATH="/opt/homebrew/bin:$PATH" npm run build`
- Local smoke checks:
  - `/` -> `307 /auth/login`
  - `/protected` -> `307 /auth/login?next=%2Fprotected` when unauthenticated
  - `/timeline` -> `307 /auth/login?next=%2Ftimeline` when unauthenticated
  - `/add` -> `307 /auth/login?next=%2Fadd` when unauthenticated
  - `/imports` -> `307 /auth/login?next=%2Fimports` when unauthenticated
  - `/reflect` -> `307 /auth/login?next=%2Freflect` when unauthenticated
  - `/search` -> `307 /auth/login?next=%2Fsearch` when unauthenticated
  - `/settings` -> `307 /auth/login?next=%2Fsettings` when unauthenticated
  - `/auth/login?next=%2Ftimeline` -> `200`

### Completion Notes List

- Story context generated by BMad Create Story workflow on 2026-05-05.
- Added a shared private workspace shell with Lifeline identity, account controls, desktop navigation, mobile bottom navigation, and room for a future context/detail rail.
- Added route-aware active navigation states using `usePathname`, icons, text labels, `aria-current`, and non-color-only styling.
- Updated workspace placeholders to render inside the shell and kept them generic and honest about unfinished features.
- Redirected root authenticated users, OAuth default returns, sign-up return, update-password return, and `/protected` toward `/timeline` as the MVP workspace home.
- Extended foundation validation to cover the shell/navigation contract and stale `/protected` destinations.
- Code review pass completed locally; fixed stale starter redirects and small mobile label sizing before final validation.

### File List

- `/Users/Tuckle/Projects/lifeline/_bmad-output/implementation-artifacts/1-4-responsive-app-shell-navigation.md`
- `/Users/Tuckle/Projects/lifeline/_bmad-output/implementation-artifacts/sprint-status.yaml`
- `/Users/Tuckle/Projects/lifeline/scripts/validate-foundation.mjs`
- `/Users/Tuckle/Projects/lifeline/src/app/(workspace)/layout.tsx`
- `/Users/Tuckle/Projects/lifeline/src/app/auth/callback/route.ts`
- `/Users/Tuckle/Projects/lifeline/src/app/page.tsx`
- `/Users/Tuckle/Projects/lifeline/src/app/protected/layout.tsx`
- `/Users/Tuckle/Projects/lifeline/src/app/protected/page.tsx`
- `/Users/Tuckle/Projects/lifeline/src/components/auth-button.tsx`
- `/Users/Tuckle/Projects/lifeline/src/components/layout/workspace-navigation.tsx`
- `/Users/Tuckle/Projects/lifeline/src/components/layout/workspace-placeholder.tsx`
- `/Users/Tuckle/Projects/lifeline/src/components/layout/workspace-shell.tsx`
- `/Users/Tuckle/Projects/lifeline/src/components/login-form.tsx`
- `/Users/Tuckle/Projects/lifeline/src/components/logout-button.tsx`
- `/Users/Tuckle/Projects/lifeline/src/components/sign-up-form.tsx`
- `/Users/Tuckle/Projects/lifeline/src/components/update-password-form.tsx`

## Change Log

| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-05-05 | 1.0 | Implemented responsive private workspace shell and navigation. | Amelia (Dev Agent) |
