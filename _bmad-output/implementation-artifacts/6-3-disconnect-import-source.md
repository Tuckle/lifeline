# Story 6.3: Disconnect Import Source

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an authenticated Lifeline user,  
I want to disconnect an import source,  
so that Lifeline stops future access or sync without confusing that action with deleting existing data.

## Acceptance Criteria

1. Given I have a connected import source, when I choose Disconnect, then I see a confirmation explaining that future sync/access will stop and the copy clearly states whether already imported records will be kept unless I choose deletion separately.
2. Given I confirm disconnect, when the action succeeds, then the import source status changes to disconnected and future sync attempts for that source stop.
3. Given I disconnect a source with existing imported records, when I return to source settings or import review, then existing imported records remain visible according to their lifecycle state and their source label indicates that the source is disconnected where relevant.
4. Given disconnect fails, when the app shows feedback, then the source remains in its previous connection state and I receive a calm recoverable error with retry guidance.
5. Given disconnect is a privacy-critical action, when the confirmation dialog opens, then focus is managed safely and primary, cancel, and destructive actions are clearly labeled.
6. Given disconnect code runs server-side, when it updates source records, then it verifies authenticated user ownership and it does not affect manually created timeline events.

## Tasks / Subtasks

- [x] Add disconnect server action behavior. (AC: 2, 4, 6)
  - [x] Verify authenticated user ownership before changing source status.
  - [x] Mark source `connection_status` as `disconnected` without changing manual timeline events.
  - [x] Revalidate Settings and Imports after the update.

- [x] Add Settings disconnect confirmation UI. (AC: 1, 3, 4, 5)
  - [x] Show a confirmation explaining future sync/access stops.
  - [x] State that already imported records are kept unless deleted separately.
  - [x] Provide clear cancel and destructive confirm actions with focus-managed dialog behavior.
  - [x] Show calm success and recoverable failure messages.

- [x] Extend validation and verify. (AC: 1-6)
  - [x] Update `scripts/validate-foundation.mjs` for owner-scoped disconnect and confirmation copy.
  - [x] Run `npm test`, `npm run typecheck`, `npm run lint`, `npm audit --omit=dev`, `npm run build`, route smoke checks, and `git diff --check`.

## Dev Notes

- Requirements covered: FR5, NFR10, NFR25, UX-DR16, UX-DR28, UX-DR30, AR36. [Source: `/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/epics.md` - Story 6.3]
- Disconnect must stop future source access/sync without deleting already imported records or manual timeline content. [Source: `/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/prd.md` - Journey 5]
- Destructive/privacy-critical actions need confirmation copy that explains the consequence and affected data. [Source: `/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/ux-design-specification.md` - Destructive/Irreversible Actions]
- Import source updates must remain server-side, return shared `ActionResult<T>`, and verify authenticated user ownership. [Source: `/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/architecture.md` - Service Boundaries]

### Current Code To Preserve

- `src/features/imports/actions/source-recovery.ts` already owns source issue and disconnect actions. Story 6.3 hardens it with explicit `user_id` scoping and Settings revalidation.
- `src/features/settings/components/privacy-data-section.tsx` owns the Privacy and Data settings surface and now renders the disconnect confirmation.
- `src/features/settings/queries/get-privacy-data-summary.ts` provides disconnected source state after refresh.

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
- Hardened the shared import source recovery action to scope updates by authenticated `user_id`.
- Added Settings disconnect confirmation with clear future-access and imported-record retention copy.
- Added success and failure feedback that leaves source records unchanged on failure and does not affect manual timeline content.
- Revalidated Settings and Imports after source disconnect.
- Extended foundation validation for owner-scoped disconnect and confirmation UI.

### File List

- `/Users/Tuckle/Projects/lifeline/_bmad-output/implementation-artifacts/6-3-disconnect-import-source.md`
- `/Users/Tuckle/Projects/lifeline/_bmad-output/implementation-artifacts/sprint-status.yaml`
- `/Users/Tuckle/Projects/lifeline/scripts/validate-foundation.mjs`
- `/Users/Tuckle/Projects/lifeline/src/features/imports/actions/source-recovery.ts`
- `/Users/Tuckle/Projects/lifeline/src/features/settings/components/privacy-data-section.tsx`

## Change Log

| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-05-06 | 0.1 | Created implementation story context for disconnect import source. | Codex |
| 2026-05-06 | 1.0 | Implemented owner-scoped source disconnect confirmation from Settings. | Amelia (Dev Agent) |
