# Story 2.3: Browse Timeline with Present Anchor

Status: done

<!-- Validation note: Story context created from epics, UX spec, architecture, previous stories, and current timeline create/read foundation. -->

## Story

As an authenticated Lifeline user,  
I want to browse my memories on a vertical life-line with the present clearly anchored,  
so that I can understand where events sit in relation to my past and future.

## Acceptance Criteria

1. Given I have one or more timeline events, when I open the Timeline route, then events appear on the vertical life-line in chronological position, and history is oriented upward while future space is oriented downward.
2. Given I browse the timeline, when I move through past events, then the present marker remains understandable as the spatial reference point, and event date labels remain readable.
3. Given timeline events render as Memory Atlas cards, when I view a card, then I can see title, date/approximate date, type/status label, and a short preview if available, and source/status and importance information are not communicated by color alone.
4. Given the timeline loads multiple events, when events are fetched, then the query supports incremental loading or partial rendering, and the page does not block manual event creation or editing while loading older content.
5. Given I browse on mobile, tablet, desktop, or wide desktop, when the timeline layout adapts, then mobile uses a simplified single-column timeline, and desktop can use richer spacing and optional detail-panel space without breaking timeline readability.
6. Given I navigate away from the timeline and return, when the route supports returning to context, then the app preserves or restores relevant timeline context where practical, and later edit/detail flows can return to the same position.

## Tasks / Subtasks

- [x] Add server-side timeline event listing. (AC: 1, 4)
  - [x] Add a query helper that reads the authenticated user's `timeline_events`.
  - [x] Limit the initial query for partial rendering and future incremental loading.
  - [x] Keep RLS/user ownership as the protection model; do not use hardcoded user ids.

- [x] Render the populated life-line. (AC: 1, 2, 3, 5)
  - [x] Add a `LifeLineTimeline` component that renders empty state when no events exist and cards when events exist.
  - [x] Keep the present marker visible as the anchor between history and future space.
  - [x] Render event cards with title, date label, status/source labels, importance text, and story preview when available.
  - [x] Keep status/source/importance meaning visible through text and shape, not color alone.

- [x] Preserve responsive and return-to-context foundations. (AC: 4, 5, 6)
  - [x] Use stable card anchors/ids so future detail/edit flows can return to an event.
  - [x] Keep mobile single-column and desktop richer spacing without text overlap.
  - [x] Provide a partial-loading note when the initial event limit is reached.

- [x] Extend validation coverage. (AC: 1-6)
  - [x] Update `scripts/validate-foundation.mjs` to verify the list query, limit, Timeline page usage, life-line component, present marker, Memory Atlas card fields, source/status/importance labels, and stable event anchors.
  - [x] Run `npm run typecheck`, `npm run lint`, `npm test`, `npm audit --omit=dev`, `npm run build`, and route smoke checks.

## Dev Notes

### Current Code State

- Story 2.2 is done and pushed to `origin/main` at commit `fcbd018`.
- Add memory server action inserts manual timeline events into `timeline_events`.
- Timeline currently shows an empty Memory Atlas surface regardless of stored events.
- `timeline_events` migration has owner-scoped RLS policies and indexes by user/date and user/created time.

### UX Guardrails

- History is oriented upward, future space downward, with a visible present anchor.
- Memory Atlas cards should show title, date/approximate date, type/status label, optional story preview, importance, and source/status labels.
- Mobile timeline should be simplified single-column; desktop can use richer spacing and optional detail/context space.
- Color is not the only state indicator.

### Architecture Guardrails

- Use server-first reads for private timeline data.
- Direct Supabase reads are acceptable where RLS makes access safe and simple.
- Timeline queries should support incremental loading or partial rendering for MVP-scale browsing.
- Do not add edit/detail/delete flows in this story.

### Previous Story Intelligence

- Use `PATH="/opt/homebrew/bin:$PATH" npm ...` for local npm commands.
- Reuse `EmptyMemoryAtlasTimeline` for the no-events state.
- Use Lifeline tokens and shared primitives.
- `scripts/validate-foundation.mjs` is the lightweight validation path wired to `npm test`.

### References

- [Epics Story 2.3](/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/epics.md)
- [UX Design Specification](/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/ux-design-specification.md)
- [Architecture Decision Document](/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/architecture.md)
- [Previous Story 2.2](/Users/Tuckle/Projects/lifeline/_bmad-output/implementation-artifacts/2-2-create-life-event-with-approximate-date.md)

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
- Added `listTimelineEvents` server query with authenticated claims check, RLS-backed reads, chronological ordering, and an initial 50-event limit.
- Added `LifeLineTimeline` to render empty state or populated event cards with a present anchor and future space.
- Added `MemoryAtlasCard` with title, date label, memory/source/status labels, importance text, date precision text, and story preview.
- Added stable `memory-{id}` anchors for future return-to-context flows.
- Extended validation to cover query, timeline renderer, cards, present marker, initial limit, and stable anchors.
- Code review pass completed locally with no remaining findings after validation, audit, build, and smoke.

### File List

- `/Users/Tuckle/Projects/lifeline/_bmad-output/implementation-artifacts/2-3-browse-timeline-with-present-anchor.md`
- `/Users/Tuckle/Projects/lifeline/_bmad-output/implementation-artifacts/sprint-status.yaml`
- `/Users/Tuckle/Projects/lifeline/scripts/validate-foundation.mjs`
- `/Users/Tuckle/Projects/lifeline/src/app/(workspace)/timeline/page.tsx`
- `/Users/Tuckle/Projects/lifeline/src/features/timeline/components/life-line-timeline.tsx`
- `/Users/Tuckle/Projects/lifeline/src/features/timeline/components/memory-atlas-card.tsx`
- `/Users/Tuckle/Projects/lifeline/src/features/timeline/queries/list-timeline-events.ts`
- `/Users/Tuckle/Projects/lifeline/src/features/timeline/types.ts`

## Change Log

| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-05-05 | 1.0 | Implemented RLS-backed timeline event browsing with present anchor and Memory Atlas cards. | Amelia (Dev Agent) |
