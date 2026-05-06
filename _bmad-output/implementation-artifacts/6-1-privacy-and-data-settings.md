# Story 6.1: Privacy and Data Settings

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an authenticated Lifeline user,  
I want a clear Privacy and Data settings area,  
so that I can understand and control sensitive timeline and import data.

## Acceptance Criteria

1. Given I am authenticated, when I open Settings, then I can access a Privacy and Data section and it uses calm, plain-language copy about private user-owned data.
2. Given the Privacy and Data section renders, when data controls are shown, then I can see entry points for connected sources, source permissions, disconnect, delete imported data, and export, and destructive or privacy-critical actions are visually and textually distinct from ordinary navigation.
3. Given no import sources are connected, when I open Privacy and Data, then the section explains that no sources are connected and it still provides export/data ownership context where relevant.
4. Given settings are viewed on mobile or desktop, when controls render, then touch targets, labels, consequence copy, and focus states remain usable and content does not overlap or hide critical privacy information.
5. Given settings code accesses user data, when connected sources or data summaries are queried, then only the authenticated user's records are returned and permission failures do not reveal whether another user's private records exist.

## Tasks / Subtasks

- [x] Add user-scoped privacy summary query. (AC: 3, 5)
  - [x] Query import source summaries for the authenticated user.
  - [x] Query basic owned data counts without exposing private content.
  - [x] Return shared `ActionResult<T>` and generic permission/load failures.

- [x] Build Privacy and Data settings UI. (AC: 1, 2, 3, 4)
  - [x] Replace the Settings placeholder with a real Privacy and Data section.
  - [x] Show connected-source state, source permissions entry, disconnect entry, delete imported data entry, and export entry.
  - [x] Use calm copy and visually/textually distinct treatment for privacy-critical/destructive controls.
  - [x] Keep the layout usable on mobile and desktop with accessible labels and focus states.

- [x] Extend validation and verify. (AC: 1-5)
  - [x] Update `scripts/validate-foundation.mjs` for settings query and Privacy and Data UI.
  - [x] Run `npm test`, `npm run typecheck`, `npm run lint`, `npm audit --omit=dev`, `npm run build`, route smoke checks, and `git diff --check`.

## Dev Notes

- Requirements covered: FR4, FR7, FR9, NFR7, NFR8, UX-DR16, UX-DR28, AR36. [Source: `/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/epics.md` - Story 6.1]
- Settings must contain privacy, connected sources, export, and delete controls. [Source: `/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/ux-design-specification.md` - Navigation Model]
- PrivacyDataControl anatomy includes title, plain-language consequence, affected data scope, confirmation state, primary/cancel actions, and recovery note where applicable. For this story, implement entry/control surfaces; actual destructive mutations arrive in later stories. [Source: `/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/ux-design-specification.md` - PrivacyDataControl]
- All user-owned tables have `user_id` and RLS policies. Query code should still explicitly scope by authenticated `userId` where practical. [Source: `/Users/Tuckle/Projects/lifeline/supabase/migrations/20260506104700_create_import_staging.sql`; `/Users/Tuckle/Projects/lifeline/supabase/migrations/20260505182600_create_timeline_events.sql`]
- Keep sensitive source tokens/secrets server-side and do not expose private record content in settings summaries. [Source: `/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/architecture.md` - Data Boundaries]

### Current Code To Preserve

- `src/app/(workspace)/settings/page.tsx` currently requires workspace auth and renders a placeholder plus `ProductBoundaryNote`. Preserve `requireWorkspaceUser("/settings")` and keep boundary language available.
- `src/features/imports/queries/list-import-review.ts` already maps import source status and uses Supabase auth. Story 6.1 should add a settings-specific summary query instead of overloading import review with privacy UI needs.
- Existing validation scans settings copy for prohibited product claims; keep copy away from clinical or shame language.

### Expected File Changes

- Update `/Users/Tuckle/Projects/lifeline/src/app/(workspace)/settings/page.tsx`.
- Add `/Users/Tuckle/Projects/lifeline/src/features/settings/queries/get-privacy-data-summary.ts`.
- Add `/Users/Tuckle/Projects/lifeline/src/features/settings/components/privacy-data-section.tsx`.
- Update `/Users/Tuckle/Projects/lifeline/scripts/validate-foundation.mjs`.

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
- Added a server-side Privacy and Data summary query scoped to the authenticated user.
- Replaced the settings placeholder with a real Privacy and Data surface, connected source status, source permissions, disconnect, delete imported data, and export entry points.
- Added plain-language consequence copy and visually distinct treatment for privacy-critical/destructive entries.
- Extended foundation validation for the settings query and Privacy and Data UI.

### File List

- `/Users/Tuckle/Projects/lifeline/_bmad-output/implementation-artifacts/6-1-privacy-and-data-settings.md`
- `/Users/Tuckle/Projects/lifeline/_bmad-output/implementation-artifacts/sprint-status.yaml`
- `/Users/Tuckle/Projects/lifeline/scripts/validate-foundation.mjs`
- `/Users/Tuckle/Projects/lifeline/src/app/(workspace)/settings/page.tsx`
- `/Users/Tuckle/Projects/lifeline/src/features/settings/components/privacy-data-section.tsx`
- `/Users/Tuckle/Projects/lifeline/src/features/settings/queries/get-privacy-data-summary.ts`
- `/Users/Tuckle/Projects/lifeline/src/lib/errors.ts`

## Change Log

| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-05-06 | 0.1 | Created implementation story context for Privacy and Data settings. | Codex |
| 2026-05-06 | 1.0 | Implemented user-scoped Privacy and Data settings summary and control entry points. | Amelia (Dev Agent) |
