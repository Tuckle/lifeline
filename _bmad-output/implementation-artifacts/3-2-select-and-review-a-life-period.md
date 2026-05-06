# Story 3.2: Select and Review a Life Period

Status: done

<!-- Validation note: Story context created from epics, PRD, architecture, UX spec, and completed Story 3.1 search/filter implementation. -->

## Story

As an authenticated Lifeline user,  
I want to select a life period for review,  
so that I can see what happened during that time in one coherent reflective view.

## Acceptance Criteria

1. Given I have timeline events and future intentions, when I select a date range or life period from Timeline or Reflect, then the app shows a period review view scoped to that selected period, and it includes relevant memories, future intentions where applicable, importance markers, and source/status labels.
2. Given a selected period has no items, when the period review view opens, then the empty state invites me to add a memory or adjust the period, and it avoids pressure or shame-based language.
3. Given I am reviewing a period, when the app presents the period summary, then it prioritizes high-importance events while still allowing lower-importance context to be visible or discoverable, and it does not invent meaning or diagnose patterns for me.
4. Given I use period review on desktop, when the review view renders, then it may use side-by-side context and timeline space for richer review, and the layout remains readable and stable.
5. Given I use period review on mobile, when the review view renders, then it uses a simplified stacked or step-based layout, and all actions remain reachable through visible controls.
6. Given I leave period review, when I return to the timeline, then the app preserves my prior timeline context where practical.

## Tasks / Subtasks

- [x] Add period review selection and query support. (AC: 1, 2, 3)
  - [x] Parse period review URL params with forgiving date range handling.
  - [x] Reuse the shared timeline search/filter query for scoped private period data.
  - [x] Keep review summaries factual and user-authored, without pattern diagnosis.

- [x] Add Reflect period review surface. (AC: 1, 2, 3, 4, 5)
  - [x] Replace the Reflect placeholder with period selection controls.
  - [x] Render selected-period summary, priority memories, and supporting timeline context.
  - [x] Add an empty state that invites adding a memory or adjusting the period.

- [x] Add Timeline entry point for review. (AC: 1, 6)
  - [x] Add a visible date-range review launcher to the Timeline route.
  - [x] Preserve a return path to `/timeline`.

- [x] Extend validation coverage. (AC: 1-6)
  - [x] Update `scripts/validate-foundation.mjs` for period parser/query, selector, review surface, Reflect page, Timeline entry point, and non-diagnostic copy.
  - [x] Run `npm run typecheck`, `npm run lint`, `npm test`, `npm audit --omit=dev`, `npm run build`, and route smoke checks.

## Dev Notes

### Current Code State

- Story 3.1 is done and pushed to `origin/main` at commit `0319de8`.
- `/reflect` is currently a protected placeholder page.
- `searchTimeline` supports private authenticated filtering across active timeline events and future intentions with date ranges.
- `LifeLineTimeline` can render custom headings and empty states, making it reusable for period review context.

### UX Guardrails

- Period review should feel calm, reflective, and factual.
- The UI can prioritize high/defining memories, but it must not invent meaning, diagnose patterns, or pressure the user to interpret.
- Desktop can use richer two-column context; mobile should remain stacked with reachable controls.
- Empty review states should invite adding a memory or adjusting the period without shame.
- Leaving review should offer a clear return to Timeline.

### Architecture Guardrails

- Keep period review in the `reviews` domain while using the timeline domain query for timeline-owned records.
- Do not add reflection draft persistence yet; Story 3.3 owns reflection session drafting.
- Do not add pattern/insight persistence yet; Story 3.4 owns user-named patterns.
- Use authenticated server-side access and existing `ActionResult<T>` error shape.

### Previous Story Intelligence

- Use `PATH="/opt/homebrew/bin:$PATH" npm ...` for local npm commands.
- Reuse `TimelineSearchPanel` and `LifeLineTimeline` patterns where practical.
- Route smoke checks should include `/reflect?from=YYYY-MM-DD&to=YYYY-MM-DD`.

### References

- [Epics Story 3.2](/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/epics.md)
- [PRD Reflection Workflow](/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/prd.md)
- [Architecture Reviews Domain](/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/architecture.md)
- [UX ReflectionSession and Period Review Patterns](/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/ux-design-specification.md)
- [Previous Story 3.1](/Users/Tuckle/Projects/lifeline/_bmad-output/implementation-artifacts/3-1-timeline-search-and-filters.md)

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
  - `/reflect` -> `307 /auth/login?next=%2Freflect` when unauthenticated
  - `/reflect?from=2020-01-01&to=2020-12-31` -> `307 /auth/login?next=%2Freflect%3Ffrom%3D2020-01-01%26to%3D2020-12-31` when unauthenticated
  - `/search?q=memory&itemType=memory` -> `307 /auth/login?next=%2Fsearch%3Fq%3Dmemory%26itemType%3Dmemory` when unauthenticated
  - `/auth/login?next=%2Freflect` -> `200`

### Completion Notes List

- Story context generated by BMad Create Story workflow on 2026-05-06.
- Added period review parsing/query support in the reviews domain, reusing private timeline search for scoped memories and future intentions.
- Replaced the Reflect placeholder with date-range selection and selected-period review rendering.
- Added a factual period summary with counts and priority memories without diagnostic or invented pattern language.
- Added a responsive review layout that is stacked on smaller screens and side-by-side on wide desktop.
- Added a Timeline route entry point for selecting a review period and returning to Timeline.
- Extended validation for parser/query, selector, review surface, Reflect page, Timeline entry, and calm empty-state copy.
- Code review pass completed locally with no remaining findings after validation, audit, build, and smoke.

### File List

- `/Users/Tuckle/Projects/lifeline/_bmad-output/implementation-artifacts/3-2-select-and-review-a-life-period.md`
- `/Users/Tuckle/Projects/lifeline/_bmad-output/implementation-artifacts/sprint-status.yaml`
- `/Users/Tuckle/Projects/lifeline/scripts/validate-foundation.mjs`
- `/Users/Tuckle/Projects/lifeline/src/app/(workspace)/reflect/page.tsx`
- `/Users/Tuckle/Projects/lifeline/src/app/(workspace)/timeline/page.tsx`
- `/Users/Tuckle/Projects/lifeline/src/features/reviews/components/period-review-selector.tsx`
- `/Users/Tuckle/Projects/lifeline/src/features/reviews/components/period-review-surface.tsx`
- `/Users/Tuckle/Projects/lifeline/src/features/reviews/queries/get-period-review.ts`

## Change Log

| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-05-06 | 0.1 | Created implementation story context for period review. | Amelia (Dev Agent) |
| 2026-05-06 | 1.0 | Implemented selected life period review. | Amelia (Dev Agent) |
