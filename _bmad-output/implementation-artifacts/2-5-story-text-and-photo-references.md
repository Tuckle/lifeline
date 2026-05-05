# Story 2.5: Story Text and Photo References

Status: done

<!-- Validation note: Story context created from epics, UX spec, architecture, previous stories, and current memory create/detail forms. -->

## Story

As an authenticated Lifeline user,  
I want to enrich a memory with story text and photo references,  
so that my timeline feels personal and emotionally recognizable.

## Acceptance Criteria

1. Given I am creating or editing a memory, when I add story text, then the story is saved with the user-owned timeline event, and long-form text remains readable in the memory detail view.
2. Given I am creating or editing a memory, when I add a photo reference or supported photo attachment, then the reference/attachment is associated with the selected timeline event, and the timeline card can show an appropriate photo-led or reference-aware preview.
3. Given private media storage is used, when a photo/file object is stored, then it uses private Supabase Storage or equivalent private storage, and it is not exposed through public assets or unauthenticated routes.
4. Given I remove a photo reference from a memory, when the change is saved, then the memory no longer displays that reference, and the event itself remains intact.
5. Given story text or photo reference saving fails, when the app shows feedback, then my entered text is preserved where practical, and the error explains the recovery action without alarming language.
6. Given a memory includes an image preview, when it renders on timeline or detail surfaces, then it has alt text or an explicitly decorative treatment, and it does not cause text, date labels, or controls to overlap.

## Tasks / Subtasks

- [x] Add photo reference storage. (AC: 2, 3, 4)
  - [x] Add a migration for optional `photo_reference_url` and `photo_alt_text` columns on `timeline_events`.
  - [x] Keep photo references user-owned through existing timeline event RLS.
  - [x] Do not place private media in `public/` or add public storage uploads in this story.

- [x] Extend create/edit forms. (AC: 1, 2, 4, 5)
  - [x] Add optional photo reference URL and alt text fields to create and edit forms.
  - [x] Validate photo reference URLs at the form boundary.
  - [x] Allow clearing/removing a photo reference without deleting the event.
  - [x] Preserve entered story/photo reference values on validation errors.

- [x] Render reference-aware timeline/detail previews. (AC: 1, 2, 6)
  - [x] Show readable long-form story text in memory detail.
  - [x] Show a reference-aware card preview when a photo reference exists.
  - [x] Use alt text for image previews and keep layout stable on mobile and desktop.

- [x] Extend validation coverage. (AC: 1-6)
  - [x] Update `scripts/validate-foundation.mjs` to verify migration columns, schema fields, create/update persistence, form fields, card/detail previews, alt text, and no public media storage.
  - [x] Run `npm run typecheck`, `npm run lint`, `npm test`, `npm audit --omit=dev`, `npm run build`, and route smoke checks.

## Dev Notes

### Current Code State

- Story 2.4 is done and pushed to `origin/main` at commit `a00027b`.
- Create and edit forms already save `story_text`.
- `timeline_events` RLS scopes owner access for all row fields.
- Memory cards and detail panels already render story preview/text when present.

### UX Guardrails

- Photo/reference enrichment should make memories more personal but remain optional.
- If an image preview renders, it needs alt text and stable dimensions.
- Entered text should be preserved on recoverable failures.
- Do not expose private media through public assets or unauthenticated routes.

### Architecture Guardrails

- Supabase Storage for private files is reserved for actual uploads; this story can support photo references without storing files.
- Keep sensitive operations server-side and validated.
- Do not add public media assets for private user memories.
- Keep imports separate from primary timeline events.

### Previous Story Intelligence

- Use `PATH="/opt/homebrew/bin:$PATH" npm ...` for local npm commands.
- Reuse timeline event Zod schema and server actions.
- Use Lifeline tokens and existing primitives.
- `scripts/validate-foundation.mjs` is the lightweight validation path wired to `npm test`.

### References

- [Epics Story 2.5](/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/epics.md)
- [UX Design Specification](/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/ux-design-specification.md)
- [Architecture Decision Document](/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/architecture.md)
- [Previous Story 2.4](/Users/Tuckle/Projects/lifeline/_bmad-output/implementation-artifacts/2-4-memory-detail-edit-hide-and-delete.md)

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
  - `/auth/login?next=%2Fadd` -> `200`

### Completion Notes List

- Story context generated by BMad Create Story workflow on 2026-05-05.
- Added optional `photo_reference_url` and `photo_alt_text` columns to `timeline_events`.
- Extended create/edit schemas and actions to validate and persist story text plus photo reference metadata.
- Added create/edit form fields for photo reference URL and photo description, with support for clearing the URL to remove the reference.
- Added card-level photo reference badge, stable image preview with alt text, and external reference link.
- Kept actual private file uploads out of scope; no public private-media storage was introduced.
- Extended validation to cover migration columns, schema fields, form fields, persistence, card/detail previews, alt text, and no public media storage.
- Code review pass completed locally; intentionally kept external references as plain images with a targeted lint note because they are user-controlled external references, not app-owned optimized media.

### File List

- `/Users/Tuckle/Projects/lifeline/_bmad-output/implementation-artifacts/2-5-story-text-and-photo-references.md`
- `/Users/Tuckle/Projects/lifeline/_bmad-output/implementation-artifacts/sprint-status.yaml`
- `/Users/Tuckle/Projects/lifeline/scripts/validate-foundation.mjs`
- `/Users/Tuckle/Projects/lifeline/src/features/timeline/actions/create-timeline-event.ts`
- `/Users/Tuckle/Projects/lifeline/src/features/timeline/actions/manage-timeline-event.ts`
- `/Users/Tuckle/Projects/lifeline/src/features/timeline/components/memory-atlas-card.tsx`
- `/Users/Tuckle/Projects/lifeline/src/features/timeline/components/memory-creation-form.tsx`
- `/Users/Tuckle/Projects/lifeline/src/features/timeline/components/memory-detail-panel.tsx`
- `/Users/Tuckle/Projects/lifeline/src/features/timeline/queries/list-timeline-events.ts`
- `/Users/Tuckle/Projects/lifeline/src/features/timeline/schemas/timeline-event-form.ts`
- `/Users/Tuckle/Projects/lifeline/src/features/timeline/types.ts`
- `/Users/Tuckle/Projects/lifeline/supabase/migrations/20260505201400_add_photo_references_to_timeline_events.sql`

## Change Log

| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-05-05 | 1.0 | Added story/photo reference enrichment fields and previews for memories. | Amelia (Dev Agent) |
