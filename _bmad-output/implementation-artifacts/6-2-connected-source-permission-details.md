# Story 6.2: Connected Source Permission Details

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an authenticated Lifeline user,  
I want to understand what each connected source can access,  
so that I can make informed privacy decisions.

## Acceptance Criteria

1. Given I have one or more connected import sources, when I open connected source settings, then I see each source listed with source name, connection status, last sync/import status, and available management actions.
2. Given I inspect a connected source, when permission details are displayed, then I can understand what data Lifeline can access or has imported from that source and the explanation distinguishes future sync access from already imported records.
3. Given a source has an error, expired authorization, or partial failure, when I view its details, then I see the relevant status and recovery actions and the copy explains whether authorization, network, source availability, source data, or unknown failure caused the issue when known.
4. Given a source has imported records, when I inspect source details, then I can understand whether records are staged, promoted, attached, hidden, discarded, or failed in aggregate and source metadata remains visible enough to support export/delete decisions.
5. Given source permission details render, when I use keyboard or screen-reader navigation, then source status, permissions, and actions are reachable and clearly labeled.

## Tasks / Subtasks

- [x] Extend settings source summary data. (AC: 1, 3, 4)
  - [x] Add per-source aggregate lifecycle and sync counts without returning private content.
  - [x] Include safe, whitelisted source metadata details for permission/export/delete context.
  - [x] Preserve authenticated user scoping and shared `ActionResult<T>`.

- [x] Add connected source permission details UI. (AC: 1, 2, 3, 4, 5)
  - [x] List each source with name, source type, connection status, last sync/import status, and actions.
  - [x] Explain future access versus already imported records for RescueTime and notes sources.
  - [x] Show aggregate staged/promoted/attached/hidden/discarded/failed state counts.
  - [x] Show calm recovery guidance for failed, reconnect, partial, or unknown issue states.
  - [x] Keep controls keyboard/screen-reader reachable with clear labels.

- [x] Extend validation and verify. (AC: 1-5)
  - [x] Update `scripts/validate-foundation.mjs` for permission details, safe metadata, and aggregate state coverage.
  - [x] Run `npm test`, `npm run typecheck`, `npm run lint`, `npm audit --omit=dev`, `npm run build`, route smoke checks, and `git diff --check`.

## Dev Notes

- Requirements covered: FR4, FR9, FR62, FR65, NFR9, NFR20, UX-DR16, UX-DR27, UX-DR28, AR36. [Source: `/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/epics.md` - Story 6.2]
- Permission language should make users feel informed and in control; connecting RescueTime or notes must not feel like handing over their life. [Source: `/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/ux-design-specification.md` - Source connection]
- Import failure details should explain whether authorization, network, source availability, source data, unknown failure, timeline content, import staging, sync, export, or account access is affected when known. [Source: `/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/epics.md` - Stories 4.7 and 6.2]
- Do not render private imported content in Settings. Use aggregate counts, source status, and whitelisted source metadata such as import method, connection method, endpoint label, copied-into-Lifeline flag, and failed count.

### Current Code To Preserve

- `src/features/settings/queries/get-privacy-data-summary.ts` is the server-side settings summary query. Extend it rather than adding a duplicate settings query.
- `src/features/settings/components/privacy-data-section.tsx` renders Privacy and Data. Add a per-source detail area inside this section.
- `src/features/imports/types.ts` contains canonical import source, lifecycle, and sync status unions.
- Story 6.1 validation already guards the Settings page and Privacy and Data surface; extend those checks.

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
- Extended the Privacy and Data summary query with per-source lifecycle/sync aggregates and safe metadata details.
- Added connected source permission detail UI that distinguishes future access from already imported records.
- Added per-source issue and recovery copy for reconnect, failed, partial, and unknown source states.
- Added reachable source management actions for import review/recovery, disconnect review, and delete review.
- Extended foundation validation for permission details, safe metadata, and aggregate state coverage.

### File List

- `/Users/Tuckle/Projects/lifeline/_bmad-output/implementation-artifacts/6-2-connected-source-permission-details.md`
- `/Users/Tuckle/Projects/lifeline/_bmad-output/implementation-artifacts/sprint-status.yaml`
- `/Users/Tuckle/Projects/lifeline/scripts/validate-foundation.mjs`
- `/Users/Tuckle/Projects/lifeline/src/features/settings/components/privacy-data-section.tsx`
- `/Users/Tuckle/Projects/lifeline/src/features/settings/queries/get-privacy-data-summary.ts`

## Change Log

| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-05-06 | 0.1 | Created implementation story context for connected source permission details. | Codex |
| 2026-05-06 | 1.0 | Implemented connected source permission details and aggregate source state summaries. | Amelia (Dev Agent) |
