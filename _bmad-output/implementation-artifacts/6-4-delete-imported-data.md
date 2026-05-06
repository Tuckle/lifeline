# Story 6.4: Delete Imported Data

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an authenticated Lifeline user,  
I want to delete imported data from a source,  
so that I can remove sensitive imported context while preserving manually created timeline content.

## Acceptance Criteria

1. Given I have imported data from a source, when I choose Delete imported data, then I see a confirmation explaining the affected source and data scope and the copy distinguishes deleting imported records from deleting manual memories, reflections, or future intentions.
2. Given I confirm deletion, when the action succeeds, then imported records for the selected scope are deleted or marked deleted according to the lifecycle model and future sync behavior is unchanged unless the source was also disconnected separately.
3. Given imported records were promoted or attached, when deletion rules apply, then the app clearly explains what happens to promoted/attached timeline references before confirmation and source metadata/deletion implications remain consistent with export and timeline behavior.
4. Given deletion succeeds, when I return to source settings or Import Review, then the deleted imported data no longer appears in normal import review and a clear completion state confirms the action.
5. Given deletion fails, when feedback appears, then the app explains what failed and what remains unchanged and no data is falsely shown as deleted.
6. Given delete imported data is implemented, when server-side code runs, then it verifies authenticated user ownership and logs avoid storing sensitive imported content.

## Tasks / Subtasks

- [x] Add delete imported data server action. (AC: 2, 4, 5, 6)
  - [x] Verify authenticated user ownership for the selected import source.
  - [x] Mark selected source import records as `deleted` using the lifecycle model.
  - [x] Delete or hide promoted timeline events created from those import records without touching manual timeline content.
  - [x] Revalidate Settings, Imports, and Timeline.
  - [x] Log only source id, stable error codes, counts, and technical context.

- [x] Add Settings delete imported data confirmation UI. (AC: 1, 3, 4, 5)
  - [x] Explain affected source and imported record scope.
  - [x] Distinguish imported records from manual memories, reflections, and future intentions.
  - [x] Explain promoted and attached reference handling before confirmation.
  - [x] Provide clear cancel and destructive confirm actions with calm success/failure states.

- [x] Extend validation and verify. (AC: 1-6)
  - [x] Update `scripts/validate-foundation.mjs` for owner-scoped deletion, lifecycle deletion, promoted event handling, and confirmation copy.
  - [x] Run `npm test`, `npm run typecheck`, `npm run lint`, `npm audit --omit=dev`, `npm run build`, route smoke checks, and `git diff --check`.

## Dev Notes

- Requirements covered: FR6, NFR11, NFR36, NFR37, UX-DR16, UX-DR28, UX-DR30, AR8, AR36. [Source: `/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/epics.md` - Story 6.4]
- Use lifecycle state `deleted` for import records rather than ad hoc booleans. [Source: `/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/architecture.md` - Anti-Patterns]
- Deleting imported data must not delete manual memories, reflections, or future intentions. Promoted timeline events are imported timeline events and should be handled separately from manual content.
- Destructive/privacy-critical actions need confirmation copy that explains the consequence and affected data. [Source: `/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/ux-design-specification.md` - Destructive/Irreversible Actions]
- Logs must avoid sensitive imported content. Log source id, counts, status, stable error codes, and technical context only.

### Current Code To Preserve

- `src/features/settings/components/privacy-data-section.tsx` already renders Settings privacy controls and per-source disconnect confirmation.
- `src/features/settings/queries/get-privacy-data-summary.ts` excludes deleted import records from normal source counts.
- `src/features/imports/queries/list-import-review.ts` already excludes deleted, hidden, and discarded import records from normal Import Review.

## Dev Agent Record

### Agent Model Used

GPT-5

### Debug Log References

- `npm test`
- `npm run typecheck`
- `npm run lint`
- `npm audit --omit=dev`
- `npm run build`
- `curl -I -s http://localhost:3001/settings`
- `curl -I -s 'http://localhost:3001/auth/login?next=%2Fsettings'`
- `git diff --check`

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created.
- Added owner-scoped server action for deleting imported data from a selected source.
- Marked source import records as `deleted` via lifecycle state and hid promoted imported timeline events without touching manual memories.
- Added Settings confirmation copy for affected scope, future sync behavior, promoted imported timeline events, and attached manual memories.
- Added calm success/failure feedback and scrubbed import delete diagnostics.
- Extended foundation validation for deletion action and confirmation UI.

### File List

- `/Users/Tuckle/Projects/lifeline/_bmad-output/implementation-artifacts/6-4-delete-imported-data.md`
- `/Users/Tuckle/Projects/lifeline/_bmad-output/implementation-artifacts/sprint-status.yaml`
- `/Users/Tuckle/Projects/lifeline/scripts/validate-foundation.mjs`
- `/Users/Tuckle/Projects/lifeline/src/features/settings/actions/delete-imported-data.ts`
- `/Users/Tuckle/Projects/lifeline/src/features/settings/components/privacy-data-section.tsx`
- `/Users/Tuckle/Projects/lifeline/src/lib/errors.ts`

## Change Log

| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-05-06 | 0.1 | Created implementation story context for imported data deletion. | Codex |
| 2026-05-06 | 1.0 | Implemented owner-scoped imported data deletion from Settings. | Amelia (Dev Agent) |
