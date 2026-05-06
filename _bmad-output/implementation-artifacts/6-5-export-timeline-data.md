# Story 6.5: Export Timeline Data

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an authenticated Lifeline user,  
I want to export my Lifeline data,  
so that I can keep ownership of my memories, reflections, future intentions, and imported context.

## Acceptance Criteria

1. Given I open Privacy and Data settings, when I choose Export data, then I see an explanation of what the export includes and the copy distinguishes manual content from imported context.
2. Given I request an export, when export generation succeeds, then I receive a usable structured export containing manual events, reflections, future intentions, importance values, source references, and imported context metadata and the export is scoped only to my authenticated account.
3. Given the export includes imported context, when I inspect exported data, then imported records are distinguishable from manually created content and source metadata and lifecycle state are included where relevant.
4. Given export generation is in progress, when the app shows status, then I can understand whether the export is preparing, completed, or failed and the app does not expose private export contents in public routes, metadata, logs, or previews.
5. Given export generation fails, when feedback appears, then the app explains the failure calmly and I can retry or use a support path if needed.
6. Given export code runs server-side, when it gathers user data, then it verifies authenticated user ownership across timeline, reflections, future intentions, imports, and source records and it avoids including data from other users.

## Tasks / Subtasks

- [x] Add server-side export generation. (AC: 2, 3, 4, 5, 6)
  - [x] Verify authenticated user ownership before reading export data.
  - [x] Query timeline events, reflections, patterns, future intentions, import sources, and imported records with user scoping.
  - [x] Include manual/imported distinction, importance values, source references, source metadata, and lifecycle states.
  - [x] Return a structured JSON payload through a server action without public export routes or logs containing private content.

- [x] Add Settings export UI. (AC: 1, 4, 5)
  - [x] Explain what export includes and distinguish manual content from imported context.
  - [x] Show preparing/completed/failed status.
  - [x] Provide retry and support path if export fails.
  - [x] Trigger a local JSON download after successful generation.

- [x] Extend validation and verify. (AC: 1-6)
  - [x] Update `scripts/validate-foundation.mjs` for export action, export UI, user scoping, and no public route.
  - [x] Run `npm test`, `npm run typecheck`, `npm run lint`, `npm audit --omit=dev`, `npm run build`, route smoke checks, and `git diff --check`.

## Dev Notes

- Requirements covered: FR7, NFR33, NFR34, NFR35, NFR37, UX-DR16, UX-DR28, AR36. [Source: `/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/epics.md` - Story 6.5]
- Export should preserve distinctions between manual content and imported context. Include source metadata and lifecycle state where relevant. [Source: `/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/prd.md` - NFR33-NFR35]
- Avoid public export routes, metadata, logs, or previews that could expose private data. Use an authenticated server action and local browser download for MVP.
- Deleted import records should not reappear in the export after Story 6.4 deletion. Hidden timeline events are user-owned content and can remain exportable; deleted timeline events should stay excluded.

### Current Code To Preserve

- `src/features/settings/components/privacy-data-section.tsx` owns Privacy and Data controls.
- `src/features/settings/actions/delete-imported-data.ts` shows how Settings server actions verify user ownership and revalidate safely.
- `src/features/imports/logger.ts` logs import errors without sensitive content; export failures should likewise avoid private content in logs.

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
- Added authenticated server-action export generation for timeline events, review sessions, reflection patterns, future intentions, import sources, imported records, and link tables.
- Preserved manual/imported distinctions, importance values, source references, source metadata, and import lifecycle states in the JSON export.
- Excluded deleted timeline events and deleted imported records.
- Added Settings export UI with preparing, completed, and failed states plus local JSON download.
- Extended foundation validation for export action, export UI, user scoping, and no public export route.

### File List

- `/Users/Tuckle/Projects/lifeline/_bmad-output/implementation-artifacts/6-5-export-timeline-data.md`
- `/Users/Tuckle/Projects/lifeline/_bmad-output/implementation-artifacts/sprint-status.yaml`
- `/Users/Tuckle/Projects/lifeline/scripts/validate-foundation.mjs`
- `/Users/Tuckle/Projects/lifeline/src/features/settings/actions/export-lifeline-data.ts`
- `/Users/Tuckle/Projects/lifeline/src/features/settings/components/privacy-data-section.tsx`
- `/Users/Tuckle/Projects/lifeline/src/lib/errors.ts`

## Change Log

| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-05-06 | 0.1 | Created implementation story context for timeline data export. | Codex |
| 2026-05-06 | 1.0 | Implemented authenticated structured Lifeline JSON export from Settings. | Amelia (Dev Agent) |
