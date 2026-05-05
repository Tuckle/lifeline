# Story 2.4: Memory Detail, Edit, Hide, and Delete

Status: done

<!-- Validation note: Story context created from epics, UX spec, architecture, previous stories, and current timeline card/action foundation. -->

## Story

As an authenticated Lifeline user,  
I want to open and manage a memory after creating it,  
so that I can refine, hide, or remove sensitive life material while staying in control.

## Acceptance Criteria

1. Given I have a timeline event, when I select it from the timeline, then I can open a memory detail view or panel, and the detail view shows the event title, date/approximate date, story preview or text if present, source/status label, and available actions.
2. Given I am viewing a memory detail, when I choose edit, then I can update the title and date/approximate date fields introduced in earlier stories, and saving changes updates the timeline card and preserves user ownership.
3. Given I want to reduce visibility without deleting, when I choose hide, then the event is marked hidden rather than permanently removed, and the timeline visually de-emphasizes or excludes it according to the active view without losing the record.
4. Given I choose delete, when the destructive confirmation appears, then the copy clearly explains that the selected timeline event will be deleted, and I can cancel safely or confirm deletion.
5. Given deletion succeeds, when I return to the timeline, then the event no longer appears in normal timeline browsing, and the app returns me to the prior timeline context where practical.
6. Given edit, hide, or delete fails, when the app shows feedback, then the error is calm, specific, recoverable, and does not expose raw Supabase errors.

## Tasks / Subtasks

- [x] Add a memory detail panel. (AC: 1)
  - [x] Make timeline cards selectable/openable.
  - [x] Show full detail content, source/status, date label, importance, and actions.
  - [x] Keep the detail panel anchored to the timeline card for return-to-context.

- [x] Add edit support. (AC: 2, 6)
  - [x] Add a server action that validates editable memory fields and updates the owner-scoped `timeline_events` row.
  - [x] Provide an inline edit form for title and date/approximate date fields.
  - [x] Preserve entered values on validation errors and show calm recoverable feedback.

- [x] Add hide and delete support. (AC: 3, 4, 5, 6)
  - [x] Add a server action that marks the event `hidden`.
  - [x] Add a server action that deletes the selected owner-scoped event.
  - [x] Add clear destructive confirmation copy before delete.
  - [x] Revalidate the timeline after edit, hide, or delete.

- [x] Extend validation coverage. (AC: 1-6)
  - [x] Update `scripts/validate-foundation.mjs` to verify detail panel, edit/hide/delete actions, owner-scoped mutations, destructive confirmation copy, revalidation, and non-raw error messages.
  - [x] Run `npm run typecheck`, `npm run lint`, `npm test`, `npm audit --omit=dev`, `npm run build`, and route smoke checks.

## Dev Notes

### Current Code State

- Story 2.3 is done and pushed to `origin/main` at commit `d00d4b5`.
- Timeline cards render via `MemoryAtlasCard`.
- `timeline_events` has owner-scoped RLS for select/insert/update/delete.
- Create action already validates input with Zod and returns `ActionResult<T>`.

### UX Guardrails

- Detail actions should keep users in control of sensitive life material.
- Hide should reduce visibility without permanently removing the record.
- Delete needs explicit consequence copy and a safe cancel path.
- Errors should be calm, specific, recoverable, and never expose raw Supabase errors.
- Avoid clinical interpretation or forced resurfacing language.

### Architecture Guardrails

- Use server actions for app-owned mutations.
- Validate form/action boundaries.
- Use Supabase Auth identity and RLS; do not hardcode user ids.
- Keep imports separate; do not mutate import records in this story.

### Previous Story Intelligence

- Use `PATH="/opt/homebrew/bin:$PATH" npm ...` for local npm commands.
- Reuse approximate-date schema helpers from Story 2.2 where practical.
- Use Lifeline tokens and shared primitives.
- `scripts/validate-foundation.mjs` is the lightweight validation path wired to `npm test`.

### References

- [Epics Story 2.4](/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/epics.md)
- [UX Design Specification](/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/ux-design-specification.md)
- [Architecture Decision Document](/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/architecture.md)
- [Previous Story 2.3](/Users/Tuckle/Projects/lifeline/_bmad-output/implementation-artifacts/2-3-browse-timeline-with-present-anchor.md)

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
- Added an inline memory detail panel opened from each Memory Atlas card.
- Added edit support for title, story notes, date precision/date fields, and importance using the existing Zod validation path.
- Added hide and delete server actions for owner-scoped `timeline_events` mutations, with timeline revalidation.
- Added explicit delete confirmation copy with a safe cancel path.
- Extended timeline event types and list mapping so edit forms can prefill exact, month, year, and period date fields.
- Extended foundation validation for detail panel, update/hide/delete actions, destructive confirmation, and recoverable feedback.
- Code review pass completed locally; fixed delete cancel behavior before final validation.

### File List

- `/Users/Tuckle/Projects/lifeline/_bmad-output/implementation-artifacts/2-4-memory-detail-edit-hide-and-delete.md`
- `/Users/Tuckle/Projects/lifeline/_bmad-output/implementation-artifacts/sprint-status.yaml`
- `/Users/Tuckle/Projects/lifeline/scripts/validate-foundation.mjs`
- `/Users/Tuckle/Projects/lifeline/src/features/timeline/actions/manage-timeline-event.ts`
- `/Users/Tuckle/Projects/lifeline/src/features/timeline/components/memory-atlas-card.tsx`
- `/Users/Tuckle/Projects/lifeline/src/features/timeline/components/memory-detail-panel.tsx`
- `/Users/Tuckle/Projects/lifeline/src/features/timeline/queries/list-timeline-events.ts`
- `/Users/Tuckle/Projects/lifeline/src/features/timeline/schemas/timeline-event-form.ts`
- `/Users/Tuckle/Projects/lifeline/src/features/timeline/types.ts`
- `/Users/Tuckle/Projects/lifeline/src/lib/errors.ts`

## Change Log

| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-05-05 | 1.0 | Implemented memory detail panel with edit, hide, and delete controls. | Amelia (Dev Agent) |
