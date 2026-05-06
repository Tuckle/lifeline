# Story 3.1: Timeline Search and Filters

Status: done

<!-- Validation note: Story context created from epics, PRD, architecture, UX spec, and completed Epic 2 implementation. -->

## Story

As an authenticated Lifeline user,  
I want to search and filter my timeline,  
so that I can find meaningful memories, periods, and patterns without manually scrolling through everything.

## Acceptance Criteria

1. Given I have timeline events and future intentions, when I use search, then I can search memory title, story text, date/approximate date labels, reflection text where available, and future intention text, and results are scoped only to my authenticated account.
2. Given I am viewing the timeline, when I apply filters, then I can filter by date/period, importance, source, item type, and future intentions, and filters are visible and easy to clear.
3. Given search or filters produce results, when results render, then they preserve timeline context where practical, and result cards retain readable source/status/date labels.
4. Given search or filters produce no results, when the empty result state appears, then it suggests relaxing filters or searching broader terms, and it does not imply user failure.
5. Given search/filter queries run at MVP scale, when results are requested, then usable results return within the performance target defined for MVP-scale timelines, and the UI shows loading state without wiping the previous useful context unnecessarily.
6. Given I use search/filter on mobile or desktop, when controls render, then they remain accessible by keyboard and touch, and controls do not overlap timeline content.

## Tasks / Subtasks

- [x] Add private timeline search query support. (AC: 1, 4, 5)
  - [x] Add typed search filters and URL parameter parsing.
  - [x] Query active timeline events and future intentions under authenticated user/RLS scope.
  - [x] Search current available fields and explicitly avoid inventing unavailable reflection/tag data.

- [x] Add visible search and filter controls. (AC: 2, 5, 6)
  - [x] Add reusable search/filter form for `/timeline` entry and `/search`.
  - [x] Support date range, importance, source, item type, and future intention filters.
  - [x] Add clear-filter affordance and stable loading fallback.

- [x] Render results with timeline context. (AC: 3, 4, 6)
  - [x] Render matching memories and future intentions on the life-line where practical.
  - [x] Add calm empty results state that suggests relaxing filters.
  - [x] Keep labels, source/status/date text, and touch targets readable on mobile and desktop.

- [x] Extend validation coverage. (AC: 1-6)
  - [x] Update `scripts/validate-foundation.mjs` for search query, form, search page, timeline entry point, and empty result copy.
  - [x] Run `npm run typecheck`, `npm run lint`, `npm test`, `npm audit --omit=dev`, `npm run build`, and route smoke checks.

## Dev Notes

### Current Code State

- Story 2.7 is done and pushed to `origin/main` at commit `406c797`.
- `timeline_events` and `future_intentions` are private user-owned tables protected by Supabase RLS.
- `listTimelineEvents` currently loads the Timeline page with active memories, active future intentions, and an initial event limit.
- `/search` is currently a protected placeholder page.

### UX Guardrails

- Search and filtering should help users find meaning without making Lifeline feel like a database.
- Search results should preserve timeline context where possible.
- Filters must be visible and easy to clear.
- Empty search results should suggest relaxing filters or searching broader terms without implying failure.
- Controls must remain accessible by keyboard/touch and must not overlap timeline content.

### Architecture Guardrails

- Keep timeline filtering inside the shared timeline domain/query model. Do not build one-off filters that bypass ownership/RLS patterns.
- Use server-side Supabase access through `createClient()` and `supabase.auth.getClaims()`.
- Return calm `ActionResult<T>` errors, not raw Supabase errors.
- Do not add reflection, tag, import, or AI-pattern schema in this story. Search reflection text only when a reflection source exists in later stories.
- MVP search may cover up to 1,000 current timeline records to satisfy the MVP-scale performance target without introducing full-text infrastructure prematurely.

### Previous Story Intelligence

- Use `PATH="/opt/homebrew/bin:$PATH" npm ...` for local npm commands.
- Reuse `LifeLineTimeline`, `MemoryAtlasCard`, and `FutureIntentionCard` so result cards keep existing labels and actions.
- Keep photo references as user-controlled external references; do not introduce public private-media storage.
- `scripts/validate-foundation.mjs` is the lightweight validation path wired to `npm test`.

### References

- [Epics Story 3.1](/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/epics.md)
- [PRD MVP Scope](/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/prd.md)
- [Architecture Query Guardrails](/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/architecture.md)
- [UX Search and Filtering Patterns](/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/ux-design-specification.md)
- [Previous Story 2.7](/Users/Tuckle/Projects/lifeline/_bmad-output/implementation-artifacts/2-7-future-intentions-below-present.md)

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
  - `/search?q=memory&itemType=memory` -> `307 /auth/login?next=%2Fsearch%3Fq%3Dmemory%26itemType%3Dmemory` when unauthenticated
  - `/settings` -> `307 /auth/login?next=%2Fsettings` when unauthenticated
  - `/auth/login?next=%2Fsearch` -> `200`

### Completion Notes List

- Story context generated by BMad Create Story workflow on 2026-05-06.
- Added typed private timeline search with URL parsing, active filter detection, authenticated Supabase access, and MVP-scale 1,000-row bounds.
- Added reusable visible search/filter controls for timeline entry and the dedicated search page.
- Added search results rendering through the existing life-line timeline context, preserving memory and future-intention labels/actions.
- Added calm empty result copy with clear-filter and add-to-line recovery paths.
- Updated protected route redirects so filtered search returns through login with the full query preserved.
- Extended validation coverage for search query, controls, result page, timeline entry point, and empty state copy.
- Code review pass completed locally with no remaining findings after validation, audit, build, and smoke.

### File List

- `/Users/Tuckle/Projects/lifeline/_bmad-output/implementation-artifacts/3-1-timeline-search-and-filters.md`
- `/Users/Tuckle/Projects/lifeline/_bmad-output/implementation-artifacts/sprint-status.yaml`
- `/Users/Tuckle/Projects/lifeline/scripts/validate-foundation.mjs`
- `/Users/Tuckle/Projects/lifeline/src/app/(workspace)/search/page.tsx`
- `/Users/Tuckle/Projects/lifeline/src/app/(workspace)/timeline/page.tsx`
- `/Users/Tuckle/Projects/lifeline/src/features/timeline/components/life-line-timeline.tsx`
- `/Users/Tuckle/Projects/lifeline/src/features/timeline/components/timeline-search-panel.tsx`
- `/Users/Tuckle/Projects/lifeline/src/features/timeline/queries/search-timeline.ts`
- `/Users/Tuckle/Projects/lifeline/src/lib/errors.ts`
- `/Users/Tuckle/Projects/lifeline/src/lib/supabase/proxy.ts`

## Change Log

| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-05-06 | 0.1 | Created implementation story context for timeline search and filters. | Amelia (Dev Agent) |
| 2026-05-06 | 1.0 | Implemented private timeline search and filters. | Amelia (Dev Agent) |
