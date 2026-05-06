# Story 5.4: Failed Sync and Conflict Recovery

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an authenticated Lifeline user,  
I want to recover from failed or conflicting draft syncs,  
so that offline-captured memories are not silently lost.

## Acceptance Criteria

1. Given an offline draft fails to sync, when the failure is shown, then the draft remains available locally and the app labels it as failed with a calm, recoverable message.
2. Given a failed draft is recoverable, when I choose Retry, then the app attempts to sync that draft again and the retry result updates only that draft's sync state.
3. Given a local draft conflicts with a server-side version, when the conflict is detected, then the app labels the draft as conflict and I can review the local and server versions before choosing how to resolve it.
4. Given I resolve a conflict, when I choose a resolution, then the selected version is saved or retained according to my choice and the app does not silently overwrite user-authored content.
5. Given sync failure or conflict recovery UI appears, when I use mobile, desktop, keyboard, or screen-reader navigation, then retry, keep local, use server version, cancel, and delete/discard actions are clearly labeled and reachable.
6. Given sync or conflict errors are logged, when diagnostics are written, then logs capture stable error codes and technical context and avoid storing sensitive memory text by default.

## Tasks / Subtasks

- [x] Extend offline draft sync result handling. (AC: 1, 2, 6)
  - [x] Keep failed drafts in local storage and set only the affected draft to `failed`.
  - [x] Add a Retry path that reuses the existing `syncOfflineDraftAction` per draft.
  - [x] Add scrubbed offline sync diagnostics with stable error codes and no memory text.

- [x] Add conflict detection and review data. (AC: 3, 4, 6)
  - [x] Detect when a draft identity already maps to a server timeline event with different mandatory fields.
  - [x] Return an `offline_conflict` result with safe server comparison fields only.
  - [x] Preserve user ownership checks and do not reveal another user's private records.

- [x] Add conflict recovery UI. (AC: 3, 4, 5)
  - [x] Label conflicted drafts as `Conflict`.
  - [x] Show local versus server title/date placement in a reviewable, accessible structure.
  - [x] Provide clearly labeled actions: Retry, Keep local, Use server version, Cancel, and Delete/discard local draft.
  - [x] Ensure one conflict or failed retry does not block other drafts.

- [x] Extend validation and verify. (AC: 1-6)
  - [x] Update `scripts/validate-foundation.mjs` for retry, conflict UI, conflict result, and scrubbed logging.
  - [x] Run `npm test`, `npm run typecheck`, `npm run lint`, `npm audit --omit=dev`, `npm run build`, route smoke checks, and `git diff --check`.

## Dev Notes

- Requirements covered: FR50, FR51, NFR17, NFR18, UX-DR31, AR10, AR14, AR20, AR24. [Source: `/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/epics.md` - Story 5.4]
- Offline draft statuses must remain explicit: `local_only`, `syncing`/`sync_pending` in UI, `synced`, `conflict`, and `failed`. Existing code currently uses `sync_pending` in the client label set; keep compatibility with current local storage values unless a migration is added. [Source: `/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/epics.md` - AR10; `/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/architecture.md` - State Management Patterns]
- User-facing failure/conflict language must be calm, specific, and recoverable. Avoid blame and avoid clinical claims. [Source: `/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/ux-design-specification.md` - Error States]
- Diagnostics must capture stable error codes and technical context only. Do not log draft titles, memory text, notes, reflection text, imported activity details, or other sensitive content. [Source: `/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/prd.md` - NFR13; `/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/architecture.md` - Error Handling Patterns]
- New server actions and mutation branches must return the shared `ActionResult<T>` shape and use stable codes such as `offline_conflict`, `permission_denied`, and `validation_failed`. [Source: `/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/epics.md` - AR13, AR14]

### Current Code To Preserve

- `src/features/offline/components/offline-memory-draft-panel.tsx` owns local draft state, local storage persistence, mandatory draft editing, and per-draft sync controls. Preserve local-only creation/editing and the existing delete behavior.
- `src/features/offline/actions/sync-offline-draft.ts` creates authenticated user-owned `timeline_events`, stores `source_metadata.offlineDraftId`, checks duplicate identity for the signed-in user, and revalidates `/timeline` and `/add`.
- `src/lib/errors.ts` already defines `offlineConflict: "offline_conflict"`. Reuse it instead of adding a new string literal.
- `src/features/imports/logger.ts` is the existing pattern for scrubbed structured diagnostics. Add an offline-domain logger rather than routing offline errors through import logging.
- `scripts/validate-foundation.mjs` is the project safety net. Add targeted snippets instead of broad brittle assertions.

### Implementation Guidance

- Conflict detection should be practical for MVP: when `source_metadata.offlineDraftId` matches an existing user-owned timeline event, compare mandatory fields currently available offline: title, date precision, exact date/occurred-on, and approximate period label. If the server event differs from the local draft, return a conflict result instead of silently treating it as synced.
- Conflict result data should include only safe comparison fields needed by the UI, such as `timelineEventId`, title, date precision, occurred date, and approximate date label. Do not include story text or sensitive freeform content by default.
- "Use server version" should keep the server event as authoritative and mark or clear the local draft safely. "Keep local" should update the user-owned timeline event from the draft's mandatory fields or create it if it no longer exists. "Cancel" should leave the draft unchanged. "Delete/discard local draft" should remove only the local draft after clear labeling.
- Retry should call the same sync action path for only the selected draft. While retrying, show pending status for that draft only.
- Accessibility: use real buttons, labels, `role="alert"` for failure text, and text labels in addition to badge state. Controls need to work in the existing responsive card layout without relying on color alone.

### Project Structure Notes

- Expected files to update:
  - `/Users/Tuckle/Projects/lifeline/src/features/offline/actions/sync-offline-draft.ts`
  - `/Users/Tuckle/Projects/lifeline/src/features/offline/components/offline-memory-draft-panel.tsx`
  - `/Users/Tuckle/Projects/lifeline/src/lib/errors.ts` only if additional stable codes are truly needed
  - `/Users/Tuckle/Projects/lifeline/scripts/validate-foundation.mjs`
- Expected new file:
  - `/Users/Tuckle/Projects/lifeline/src/features/offline/logger.ts`
- Stay inside the offline domain for local draft sync/recovery logic. Do not introduce import-domain dependencies, global client stores, or a new database table for MVP conflict recovery unless implementation proves it necessary.

### Previous Story Intelligence

- Story 5.3 completed and pushed as `c908e68 Add offline draft sync`.
- The previous slice intentionally left failed retry and conflict refinement for this story.
- The per-draft sync control already updates `synced` or `failed` after an action result; extend that behavior rather than replacing the whole panel.
- Recent verification baseline: `npm test`, `npm run typecheck`, `npm run lint`, `npm audit --omit=dev`, `npm run build`, route smoke checks for `/add` and `/auth/login?next=%2Fadd`, and `git diff --check`.

### References

- `/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/epics.md` - Story 5.4, NFR/AR mappings.
- `/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/prd.md` - NFR13, NFR16, NFR17, NFR18.
- `/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/architecture.md` - Error handling, offline statuses, service boundaries, mutation result shape.
- `/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/ux-design-specification.md` - Error states and emotional safety.

## Dev Agent Record

### Agent Model Used

GPT-5

### Debug Log References

- `npm test`
- `npm run typecheck`
- `npm run lint`
- `npm audit --omit=dev`
- `npm run build`
- `curl -I -s http://localhost:3001/add`
- `curl -I -s 'http://localhost:3001/auth/login?next=%2Fadd'`
- `git diff --check`

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created.
- Added failed retry behavior that reuses the per-draft sync action and updates only the selected draft state.
- Added conflict detection when an offline draft identity matches a server timeline event with different mandatory fields.
- Added conflict recovery actions for keeping the local draft version or retaining the server version without silently overwriting user-authored content.
- Added scrubbed offline sync diagnostics that log stable error codes and technical context without memory content.

### File List

- `/Users/Tuckle/Projects/lifeline/_bmad-output/implementation-artifacts/5-4-failed-sync-and-conflict-recovery.md`
- `/Users/Tuckle/Projects/lifeline/_bmad-output/implementation-artifacts/sprint-status.yaml`
- `/Users/Tuckle/Projects/lifeline/scripts/validate-foundation.mjs`
- `/Users/Tuckle/Projects/lifeline/src/features/offline/actions/sync-offline-draft.ts`
- `/Users/Tuckle/Projects/lifeline/src/features/offline/components/offline-memory-draft-panel.tsx`
- `/Users/Tuckle/Projects/lifeline/src/features/offline/logger.ts`

## Change Log

| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-05-06 | 0.1 | Created implementation story context for failed sync and conflict recovery. | Codex |
| 2026-05-06 | 1.0 | Implemented retry, conflict review/resolution, and scrubbed offline sync logging. | Amelia (Dev Agent) |
