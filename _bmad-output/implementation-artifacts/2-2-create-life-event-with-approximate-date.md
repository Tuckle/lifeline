# Story 2.2: Create Life Event with Approximate Date

Status: done

<!-- Validation note: Story context created from epics, PRD, architecture, UX spec, previous stories, and current timeline schema/UI foundation. -->

## Story

As an authenticated Lifeline user,  
I want to add a meaningful life event with an exact or approximate date,  
so that I can begin placing memories on the line even when I do not know the exact day.

## Acceptance Criteria

1. Given I am on the Timeline or Add route, when I choose Add memory, then I see a memory creation form with required fields for title and date/approximate date, and optional enrichment fields do not block saving.
2. Given I am creating a memory, when I choose a date precision, then I can enter an exact date, month/year, year only, approximate period, or unknown-but-drafted date state, and the form previews how the date will appear on the timeline.
3. Given I submit a valid memory, when the save succeeds, then the event is persisted as a user-owned timeline event, and the new memory appears on the life-line with title, date label, and default source/status labeling.
4. Given I submit invalid or incomplete required fields, when validation runs, then I see clear inline validation messages, and entered draft content is preserved.
5. Given event creation is implemented, when server-side mutation code runs, then it validates input through the agreed form/action boundary pattern and returns the shared `ActionResult<T>` shape with stable error codes.
6. Given I create a memory on mobile or desktop, when the form and resulting card render, then controls remain reachable, labels remain readable, and no text overlaps its container.

## Tasks / Subtasks

- [x] Build the Add memory form. (AC: 1, 2, 4, 6)
  - [x] Replace the Add placeholder with a memory creation form.
  - [x] Include required title and date precision fields.
  - [x] Include exact date, month/year, year-only, approximate period, and unknown date states.
  - [x] Include optional story text and importance selection without blocking save.
  - [x] Preserve entered values after validation errors.

- [x] Add approximate-date preview and saved memory preview. (AC: 2, 3, 6)
  - [x] Show a human-readable date preview while editing.
  - [x] After successful save, show a small life-line preview with title, date label, source/status, and importance text.
  - [x] Keep status/source/importance meaning visible through text and shape, not color alone.

- [x] Implement server-side creation. (AC: 3, 4, 5)
  - [x] Add a Zod schema for timeline event form validation.
  - [x] Add a server action that validates form input, reads the authenticated Supabase user claims, inserts into `timeline_events`, and returns `ActionResult<T>`.
  - [x] Use stable error codes for validation, permission, and persistence failures.
  - [x] Do not create imported records or future-intention records in this story.

- [x] Extend validation coverage. (AC: 1-6)
  - [x] Update `scripts/validate-foundation.mjs` to verify Zod, Add page form usage, server action, ActionResult shape, date precision states, saved preview, and no hardcoded user ids.
  - [x] Run `npm run typecheck`, `npm run lint`, `npm test`, `npm audit --omit=dev`, `npm run build`, and route smoke checks.

## Dev Notes

### Current Code State

- Story 2.1 is done and pushed to `origin/main` at commit `4a0dbd0`.
- `timeline_events` table migration exists with `user_id`, date precision fields, importance, status/source metadata, and RLS policies.
- `/add` currently renders a generic placeholder after `requireWorkspaceUser("/add")`.
- Existing UI primitives include Button, Input, Label, Alert, Badge, Card, Dialog, Sheet, and Sonner.

### UX Guardrails

- Users should not be blocked because they cannot remember an exact date.
- Date precision must be keyboard accessible.
- Forms should feel forgiving, with clear labels, helper text, inline validation, draft preservation, and required-vs-optional separation.
- Adding a memory should feel valid even when incomplete; optional enrichment can come later.
- Do not use pressure, shame, clinical interpretation, or fake private memory data.

### Architecture Guardrails

- Use Zod or equivalent schema validation at form/action boundaries.
- Use Next.js server actions/routes for app-owned mutations.
- Return the shared `ActionResult<T>` shape with stable machine-readable error codes.
- Use Supabase Auth identity as the owner key; never hardcode user ids.
- Use server-first data access for sensitive mutations.

### Previous Story Intelligence

- Use `PATH="/opt/homebrew/bin:$PATH" npm ...` for local npm commands.
- Use existing `src/lib/supabase/server.ts`; do not add a second server client pattern.
- Use Lifeline tokens and primitives from Story 1.5.
- `scripts/validate-foundation.mjs` is the lightweight validation path wired to `npm test`.

### References

- [Epics Story 2.2](/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/epics.md)
- [PRD](/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/prd.md)
- [Architecture Decision Document](/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/architecture.md)
- [UX Design Specification](/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/ux-design-specification.md)
- [Previous Story 2.1](/Users/Tuckle/Projects/lifeline/_bmad-output/implementation-artifacts/2-1-empty-memory-atlas-timeline.md)

## Dev Agent Record

### Agent Model Used

GPT-5

### Debug Log References

- `PATH="/opt/homebrew/bin:$PATH" npm view zod version`
- `PATH="/opt/homebrew/bin:$PATH" npm install zod@4.4.3 --save-exact`
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
  - `/auth/login?next=%2Fadd` -> `200`

### Completion Notes List

- Story context generated by BMad Create Story workflow on 2026-05-05.
- Replaced the Add placeholder with a memory creation form that supports exact date, month/year, year-only, named period, and unknown date states.
- Added inline date preview, optional story text, importance selection, validation error display, and a saved life-line preview card.
- Added Zod validation and a server action that inserts owner-scoped manual memories into `timeline_events` using the existing Supabase server client.
- Added stable error codes for validation and timeline event creation failure.
- Added `Textarea` primitive and exact-pinned `zod` dependency.
- Extended foundation validation to cover Add page integration, schema/date precision states, server action `ActionResult<T>` usage, and form preview requirements.
- Code review pass completed locally with no remaining findings after typecheck, validation, audit, build, and smoke.

### File List

- `/Users/Tuckle/Projects/lifeline/_bmad-output/implementation-artifacts/2-2-create-life-event-with-approximate-date.md`
- `/Users/Tuckle/Projects/lifeline/_bmad-output/implementation-artifacts/sprint-status.yaml`
- `/Users/Tuckle/Projects/lifeline/package-lock.json`
- `/Users/Tuckle/Projects/lifeline/package.json`
- `/Users/Tuckle/Projects/lifeline/scripts/validate-foundation.mjs`
- `/Users/Tuckle/Projects/lifeline/src/app/(workspace)/add/page.tsx`
- `/Users/Tuckle/Projects/lifeline/src/components/ui/textarea.tsx`
- `/Users/Tuckle/Projects/lifeline/src/features/timeline/actions/create-timeline-event.ts`
- `/Users/Tuckle/Projects/lifeline/src/features/timeline/components/memory-creation-form.tsx`
- `/Users/Tuckle/Projects/lifeline/src/features/timeline/schemas/timeline-event-form.ts`
- `/Users/Tuckle/Projects/lifeline/src/lib/errors.ts`

## Change Log

| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-05-05 | 1.0 | Implemented approximate-date memory creation form and server action. | Amelia (Dev Agent) |
