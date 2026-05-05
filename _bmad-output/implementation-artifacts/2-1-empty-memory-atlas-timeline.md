# Story 2.1: Empty Memory Atlas Timeline

Status: done

<!-- Validation note: Story context created from epics, PRD, architecture, UX spec, previous stories, and current workspace shell/UI foundation. -->

## Story

As an authenticated Lifeline user,  
I want to see an empty vertical life-line before I add memories,  
so that I understand where my past, present, and future will live.

## Acceptance Criteria

1. Given I am authenticated and have no timeline items, when I open the Timeline route, then I see a blank or sparse Memory Atlas timeline with a visible vertical life-line, and the present point is clearly marked.
2. Given the timeline is empty, when I view the empty state, then it invites me to begin with Add memory, Add future intention, or Import context, and the copy does not imply I am behind, incomplete, or failing.
3. Given the timeline route is implemented, when timeline storage is created, then the app includes the minimal timeline data model needed for user-owned life events, and user ownership is enforced through Supabase Auth identity and RLS.
4. Given I view the empty timeline on mobile and desktop, when the layout adapts, then the life-line remains legible, and the primary actions remain usable without overlapping text or controls.
5. Given the timeline has no items, when the app renders, then it does not require imports, reflection sessions, photos, or future stories to function, and it is ready for the next story to add event creation.

## Tasks / Subtasks

- [x] Build the empty Memory Atlas timeline surface. (AC: 1, 2, 4, 5)
  - [x] Replace the Timeline placeholder with a sparse vertical life-line component.
  - [x] Mark the present point clearly.
  - [x] Show past above and future below without requiring any timeline items.
  - [x] Include calm first-action links for Add memory, Add future intention, and Import context.
  - [x] Avoid fake memories, fake imports, pressure language, streaks, productivity scoring, or clinical claims.

- [x] Keep the surface responsive and accessible. (AC: 1, 2, 4)
  - [x] Use semantic HTML and a clear heading hierarchy.
  - [x] Keep controls at practical 44px touch targets.
  - [x] Ensure color is not the only indicator for the present point or primary actions.
  - [x] Keep text inside containers at mobile widths without viewport font scaling.

- [x] Add the minimal timeline event storage foundation. (AC: 3, 5)
  - [x] Add a Supabase migration under `supabase/migrations/` for `timeline_events`.
  - [x] Use plural `snake_case` table and column names.
  - [x] Include `user_id` ownership, event title, optional story text, date/approximate date fields, importance, status/source metadata, and timestamps.
  - [x] Enable RLS and add owner-scoped select/insert/update/delete policies using `auth.uid()`.
  - [x] Keep imported context separate; do not add import records as timeline events.

- [x] Add validation coverage. (AC: 1-5)
  - [x] Update `scripts/validate-foundation.mjs` to verify the empty timeline component, Timeline page usage, first-action links, present marker, timeline token usage, migration, RLS policies, and absence of seed/private mock data.
  - [x] Run `npm run typecheck`, `npm run lint`, `npm test`, `npm audit --omit=dev`, `npm run build`, and route smoke checks.

## Dev Notes

### Current Code State

- Story 1.5 is done and pushed to `origin/main` at commit `ed05533`.
- `/timeline` currently renders a generic workspace placeholder after `requireWorkspaceUser("/timeline")`.
- The responsive workspace shell and warm token foundation are available.
- `supabase/migrations/` only contains `.gitkeep`; `supabase/seed.sql` intentionally contains no private seed content.

### UX Guardrails

- Empty timeline should communicate that the line is ready, the user can begin anywhere, approximate memories are welcome, and imports are optional context. [Source: UX Design Specification - Blank timeline]
- The Timeline / Atlas is the emotional home and default return point. [Source: UX Design Specification - Primary navigation]
- The vertical life-line, present marker, past/future treatment, and empty/sparse state are signature timeline requirements. [Source: UX-DR19]
- Empty state copy must reduce pressure and must not imply the user is behind, incomplete, or failing. [Source: UX Design Specification - Empty States]

### Architecture Guardrails

- Tables use plural `snake_case`; columns use `snake_case`.
- Supabase Auth identity is the root ownership key for user-owned records.
- RLS policies live alongside schema migrations and enforce owner access.
- Calendar-only life dates use date strings plus approximate-date metadata when needed.
- Imported records remain separate from primary timeline events until explicit user action.

### Previous Story Intelligence

- Use `PATH="/opt/homebrew/bin:$PATH" npm ...` for local npm commands.
- Keep private routes protected by proxy and `requireWorkspaceUser`.
- Use Lifeline semantic tokens from Story 1.5 rather than hardcoded new colors.
- `scripts/validate-foundation.mjs` is the lightweight validation path wired to `npm test`.

### References

- [Epics Story 2.1](/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/epics.md)
- [PRD](/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/prd.md)
- [Architecture Decision Document](/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/architecture.md)
- [UX Design Specification](/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/ux-design-specification.md)
- [Previous Story 1.5](/Users/Tuckle/Projects/lifeline/_bmad-output/implementation-artifacts/1-5-baseline-accessible-ui-foundation.md)

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
  - `/timeline` -> `307 /auth/login?next=%2Ftimeline` when unauthenticated
  - `/add` -> `307 /auth/login?next=%2Fadd` when unauthenticated
  - `/imports` -> `307 /auth/login?next=%2Fimports` when unauthenticated
  - `/reflect` -> `307 /auth/login?next=%2Freflect` when unauthenticated
  - `/search` -> `307 /auth/login?next=%2Fsearch` when unauthenticated
  - `/settings` -> `307 /auth/login?next=%2Fsettings` when unauthenticated
  - `/auth/login?next=%2Ftimeline` -> `200`

### Completion Notes List

- Story context generated by BMad Create Story workflow on 2026-05-05.
- Replaced the Timeline placeholder with an empty Memory Atlas timeline surface that shows a vertical life-line, past/present/future orientation, and a clearly marked present anchor.
- Added first-action links for Add memory, Add future intention, and Import context without fake timeline/import data.
- Added the minimal `timeline_events` Supabase migration with user ownership, approximate date fields, importance/status/source metadata, timestamps, indexes, update trigger, and owner-scoped RLS policies.
- Extended foundation validation to cover the empty timeline UI and the `timeline_events` schema/RLS contract.
- Code review pass completed locally with no remaining findings after validation and build.

### File List

- `/Users/Tuckle/Projects/lifeline/_bmad-output/implementation-artifacts/2-1-empty-memory-atlas-timeline.md`
- `/Users/Tuckle/Projects/lifeline/_bmad-output/implementation-artifacts/sprint-status.yaml`
- `/Users/Tuckle/Projects/lifeline/scripts/validate-foundation.mjs`
- `/Users/Tuckle/Projects/lifeline/src/app/(workspace)/timeline/page.tsx`
- `/Users/Tuckle/Projects/lifeline/src/features/timeline/components/empty-memory-atlas-timeline.tsx`
- `/Users/Tuckle/Projects/lifeline/supabase/migrations/20260505182600_create_timeline_events.sql`

## Change Log

| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-05-05 | 1.0 | Implemented empty Memory Atlas timeline and initial timeline event RLS migration. | Amelia (Dev Agent) |
