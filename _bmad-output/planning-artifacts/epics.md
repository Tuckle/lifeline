---
stepsCompleted:
  - 1
  - 2
  - 3
  - 4
inputDocuments:
  - /Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/prd.md
  - /Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/architecture.md
  - /Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/ux-design-specification.md
  - /Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/product-brief-lifeline.md
workflowType: "epics-and-stories"
project_name: "lifeline"
user_name: "Tuckle"
date: "2026-05-04"
lastStep: 4
status: "complete"
completedAt: "2026-05-04T15:38:57Z"
---

# lifeline - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for lifeline, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Users can sign in with Google to access their private Lifeline workspace.
FR2: Users can sign out of their account.
FR3: Users can access only their own timeline, events, imports, reflections, photos, and settings.
FR4: Users can view and manage connected import sources.
FR5: Users can disconnect an import source.
FR6: Users can delete imported data from a disconnected or active source.
FR7: Users can export their timeline data, including events, reflections, future intentions, and imported context.
FR8: Users can delete timeline content they created.
FR9: Users can understand what permissions each connected source uses.
FR10: Users can create dated life events on a vertical timeline.
FR11: Users can create events with approximate dates when exact dates are unknown.
FR12: Users can edit existing timeline events.
FR13: Users can delete existing timeline events.
FR14: Users can add story or reflection text to timeline events.
FR15: Users can attach or reference photos on timeline events.
FR16: Users can mark event importance.
FR17: Users can adjust event importance after creation.
FR18: Users can browse their timeline with history oriented upward and future entries oriented downward.
FR19: Users can identify the present point on the timeline.
FR20: Users can create future intentions below the present point.
FR21: Users can edit or delete future intentions.
FR22: Users can hide timeline items without permanently deleting them.
FR23: Users can search timeline content.
FR24: Users can filter timeline content by date or date range.
FR25: Users can filter timeline content by importance.
FR26: Users can filter timeline content by source.
FR27: Users can filter or group timeline content by basic themes.
FR28: Users can review a specific life period.
FR29: Users can record a self-review summary for a selected period.
FR30: Users can identify and record insights from a reflection session.
FR31: Users can link future intentions to past events, reflections, or patterns.
FR32: Users can exit or pause a reflection session without losing drafted work.
FR33: Users can connect RescueTime as an import source.
FR34: Users can import RescueTime activity data into Lifeline.
FR35: Users can connect a notes source such as Notion or Google Keep-style imported notes.
FR36: Users can import notes content into Lifeline.
FR37: Users can view imported records in a staged suggested-context area before they become primary timeline items.
FR38: Users can inspect imported records with source, timestamp, and sync status.
FR39: Users can promote an imported record into a primary timeline item.
FR40: Users can attach an imported record to an existing timeline event.
FR41: Users can hide or discard imported records from suggested context.
FR42: Users can retry a failed import.
FR43: Users can reconnect a source after authorization or sync failure.
FR44: Users can see which imported records succeeded, failed, or partially synced.
FR45: The system can preserve source metadata for imported records.
FR46: The system can prevent imported records from automatically becoming primary timeline events.
FR47: Users can create a draft timeline event while temporarily offline.
FR48: Users can edit mandatory fields of a draft event while temporarily offline.
FR49: Users can sync offline drafts when connectivity returns.
FR50: Users can see whether an offline draft is unsynced, syncing, synced, or failed.
FR51: Users can resolve failed draft syncs.
FR52: Users can edit, hide, or delete emotionally sensitive entries.
FR53: Users can control whether resurfaced imported content remains visible in their timeline workflow.
FR54: Users can use Lifeline without receiving clinical claims, diagnoses, treatment guidance, or therapist-like interpretation.
FR55: Users can access product language that frames Lifeline as private reflection and life visualization, not medical or therapeutic software.
FR56: Users can manually create their own interpretations and reflections rather than receiving forced conclusions from the product.
FR57: Users can use core Lifeline capabilities on desktop web.
FR58: Users can use core Lifeline capabilities on mobile web.
FR59: Users can perform quick capture and mandatory event edits on mobile web.
FR60: Users can perform richer timeline review and import curation on desktop web.
FR61: Users can use core forms and navigation with basic accessible interaction patterns.
FR62: Users can view clear import error messages.
FR63: Users can choose retry, reconnect, ignore, or disconnect when an import fails.
FR64: Users can access a manual support contact path for unresolved issues.
FR65: Users can understand whether an issue affects timeline content, import staging, sync, export, or account access.

### NonFunctional Requirements

NFR1: Authenticated users should be able to reach their timeline within 3 seconds on a normal broadband connection after initial app load.
NFR2: Manual event creation and editing interactions should provide visible feedback within 1 second.
NFR3: Timeline browsing should remain smooth for timelines containing at least 1,000 combined events and imported context records.
NFR4: Import processing must not block manual timeline creation, editing, or reflection workflows.
NFR5: Long timelines should load incrementally so users can begin browsing before all historical data is loaded.
NFR6: Timeline filtering and search should return usable results within 2 seconds for MVP-scale timelines.
NFR7: All private user data must be accessible only to the authenticated owner account.
NFR8: Personal timeline data, imported records, reflections, notes, and photo references must be protected in transit and at rest.
NFR9: Import permissions must be explicit, source-specific, and visible to the user before connection.
NFR10: Users must be able to disconnect import sources without losing manually created timeline content.
NFR11: Users must be able to delete imported data associated with a source.
NFR12: The product must not use private user data for public sharing, training, analytics resale, or secondary purposes without explicit user consent.
NFR13: Logs, analytics, and diagnostics must avoid storing sensitive timeline content, note content, imported activity details, or reflection text unless explicitly required and disclosed.
NFR14: Product language must avoid clinical, diagnostic, or treatment claims in the MVP.
NFR15: Manual timeline events, reflections, future intentions, and importance values must not be lost during normal save, edit, refresh, reconnect, or sign-in flows.
NFR16: Offline drafts must preserve mandatory event fields locally until they are synced, resolved, or explicitly discarded by the user.
NFR17: Sync states for offline drafts must be visible as unsynced, syncing, synced, conflict, or failed.
NFR18: If an offline draft conflicts with a server-side version, the user must be able to review and choose how to resolve the conflict.
NFR19: Import failures must preserve successfully imported records and clearly identify failed or partially synced records.
NFR20: Source metadata and timestamps must remain associated with imported records after staging, promotion, attachment, export, or deletion.
NFR21: The system should support recoverability for user-created timeline data through routine backups or equivalent data-protection mechanisms.
NFR22: RescueTime import should preserve enough timestamp and activity metadata for users to place activity context within life periods.
NFR23: Notes imports should preserve enough source, title/content, and timestamp context for users to understand where each note came from.
NFR24: Imported records must remain staged until the user explicitly promotes, attaches, hides, or discards them.
NFR25: Disconnecting an import source must stop future sync attempts for that source.
NFR26: Reconnect and retry flows must communicate whether authorization, network, source availability, or source-data problems caused the issue when known.
NFR27: Re-importing the same source data should avoid creating duplicate suggested-context records where records can be matched reliably.
NFR28: Core navigation and forms should be usable with keyboard input where practical.
NFR29: Form fields must have clear labels and validation messages.
NFR30: Color must not be the only indicator of importance, source, sync status, or error state.
NFR31: Timeline text and controls must remain readable and usable on supported desktop and mobile browsers.
NFR32: The app should support basic screen-reader semantics for core forms, settings, and timeline item content.
NFR33: Users must be able to export their timeline data in a usable structured format.
NFR34: Exports should include manual events, reflections, future intentions, importance values, source references, and imported context metadata.
NFR35: Exported data should distinguish manually created content from imported context.
NFR36: Deletion controls should make clear whether the user is deleting a single item, imported data from a source, or broader timeline content.
NFR37: Export and deletion flows should provide clear confirmation when the requested action has completed or failed.

### Additional Requirements

AR1: Initialize the project from the official Supabase Next.js starter using `npx create-next-app@latest --example with-supabase lifeline`.
AR2: Use a TypeScript-first Next.js App Router architecture with React, Tailwind CSS, ESLint, Turbopack-compatible development, and Vercel-compatible deployment.
AR3: Configure Supabase Auth with Google OAuth and cookie-based auth patterns.
AR4: Use Supabase Postgres as the system of record for timeline, future intention, reflection, import source, import record, sync attempt, media/reference, export, and deletion data.
AR5: Enable Row Level Security on all exposed user-owned tables and scope access to the authenticated user.
AR6: Use Supabase Storage for private photo/file objects when file storage is needed; user-uploaded private assets must not be placed in `public/`.
AR7: Keep manual timeline content separate from imported suggested context in both data model and UI.
AR8: Model imported record lifecycle states explicitly as `staged`, `promoted`, `attached`, `hidden`, `discarded`, and `deleted`.
AR9: Model import sync statuses explicitly as `pending`, `syncing`, `succeeded`, `partial_failure`, and `failed`.
AR10: Model offline draft sync statuses explicitly as `local_only`, `syncing`, `synced`, `conflict`, and `failed`.
AR11: Keep import tokens, secrets, callbacks, retries, sync work, exports, deletes, and other sensitive operations server-side.
AR12: Use Next.js server actions/routes for app-owned mutations and integration flows.
AR13: Use a shared typed mutation result shape: `ActionResult<T> = { ok: true; data: T } | { ok: false; error: { code: string; message: string; field?: string } }`.
AR14: Use stable machine-readable error codes such as `import_auth_failed`, `timeline_event_not_found`, `offline_conflict`, and `permission_denied`.
AR15: Use Zod or equivalent schema validation at form/action boundaries.
AR16: Use server-first data access for sensitive mutations; direct client reads are allowed only where RLS makes access safe and simple.
AR17: Keep UI state local or route-scoped unless cross-flow persistence is required.
AR18: Optimize timeline queries for date ranges, importance, source, review sessions, incremental loading, and at least MVP-scale timeline browsing.
AR19: Implement incremental loading or virtualization for long timelines.
AR20: Store offline drafts in local browser storage first, then sync to the server with visible sync/conflict states.
AR21: Import processing must not block manual event creation, editing, timeline browsing, or reflection workflows.
AR22: Use Supabase Cloud for auth, database, RLS, and storage; use Vercel for Next.js hosting unless deployment target changes later.
AR23: Provide environment-separated configuration for local, staging, and production; document environment variables in `.env.example`.
AR24: Implement monitoring/logging that tracks error codes and import failures without capturing sensitive timeline, note, reflection, or imported content.
AR25: Use plural `snake_case` database tables and columns, with `id` primary keys, `{table_singular}_id` foreign keys, `_at` timestamp instants, `_on` calendar dates, and explicit status fields.
AR26: Use kebab-case route segments, domain-verb server actions, camelCase query params and TypeScript variables, PascalCase components/types, and kebab-case domain utility files.
AR27: Organize source code by domain under `src/features/` with `timeline`, `imports`, `reviews`, `settings`, `auth`, and `offline` domains.
AR28: Keep shared UI primitives in `src/components/ui/`, shell/layout components in `src/components/layout/`, and domain-specific components under `src/features/*/components/`.
AR29: Split Supabase clients by runtime: browser client, server client, and privileged server/admin client where needed.
AR30: Put database migrations and RLS policies under `supabase/migrations/`, not ad hoc SQL snippets in app code.
AR31: Do not import server-only integration code into client components and never expose sensitive tokens through `NEXT_PUBLIC_*`.
AR32: Ensure timeline UI does not directly mutate imports; it must call domain actions.
AR33: Ensure import staging UI creates primary events only through `promoteImportRecord` or attach actions.
AR34: Implement RescueTime connector code under `src/features/imports/rescuetime/` and API routes under `src/app/api/imports/rescuetime/`.
AR35: Implement notes connector code under `src/features/imports/notes/` and API routes under `src/app/api/imports/notes/`.
AR36: Implement export generation under `src/app/api/export/route.ts` and settings/domain code for privacy, source management, export, delete, and troubleshooting.
AR37: Co-locate unit tests with domain modules when practical, place E2E tests under `tests/e2e/`, and use fixtures under `tests/fixtures/`.
AR38: Tests should validate domain logic, RLS-sensitive flows, imports, offline drafts, and core user journeys.
AR39: Product brief reinforces MVP scope: include one private life timeline, manual events, approximate dates, importance, photos/references, future intentions, RescueTime import, notes import, privacy controls, and reflection/pattern clarity; exclude family collaboration, public profiles, therapist portals, broad social publishing, and clinical/AI diagnosis framing.

### UX Design Requirements

UX-DR1: Implement Lifeline design tokens for the specified color system: background `#FAF7F2`, surface `#FFFFFF`, surface muted `#F1ECE4`, text primary `#1F2522`, text secondary `#5F6862`, border `#D8D0C4`, timeline line `#B8AA98`, primary accent `#2F6F68`, memory accent `#B86B4B`, reflection accent `#6E5E93`, future accent `#3B6E8F`, import accent `#667085`, warning `#B7791F`, and error `#B42318`.
UX-DR2: Implement semantic color mappings for past, present, future, manual memory, reflection/insight, imported staged context, promoted imports, hidden/discarded states, and sensitive content.
UX-DR3: Ensure color is never the only indicator of meaning; timeline state, source labels, icons, text, spacing, and shape must also communicate status.
UX-DR4: Implement typography tokens for page titles, section titles, panel/modal titles, item titles, body text, long-form reflection body, metadata/labels, and tiny utility text.
UX-DR5: Use a clean modern sans-serif such as Inter, Geist Sans, or system equivalent, with optional warm long-form treatment and tabular numerals for dates/timestamps/import summaries.
UX-DR6: Implement an 8px spacing system with micro, base, compact grouping, standard component, section, major content, reflective, and major transition spacing tokens.
UX-DR7: Use subtle radius generally between 6px and 8px, soft borders more often than heavy shadows, and elevation only for modals, sheets, floating controls, and active detail panels.
UX-DR8: Implement the chosen design direction: Memory Atlas as the emotional home, Studio as the product structure, and Pattern Clarity as a contextual layer.
UX-DR9: Build the MVP as multiple focused pages/surfaces: Timeline/Atlas, Memory Detail, Import Review, Reflection Session, Search, and Settings.
UX-DR10: Keep Pattern Clarity contextual through insight cards, related-memory clusters, reflection summaries, prompts, and future-intention links rather than a heavy standalone analytics dashboard.
UX-DR11: Implement a simple MVP navigation model: Timeline, Add, Imports, Reflect, Search, and Settings.
UX-DR12: Implement a blank/sparse timeline empty state that invites Add memory, Add future intention, and Import context without implying the user is behind or incomplete.
UX-DR13: Implement first timeline creation flow with Google login, present anchor, past/future orientation, memory/future/import starting points, approximate date entry, photo/reference option, importance setting, and immediate placement on the line.
UX-DR14: Implement import curation flow with permission explanation, staged context grouped by date/period, partial failure handling, Attach, Promote, Reflect, Hide, and Discard actions, and return-to-same-position behavior.
UX-DR15: Implement reflection flow with period selection, context display, safe continuation check, writing prompt, optional pattern naming, supporting memory/import connection, completion, optional future intention, and return to context.
UX-DR16: Implement privacy/import recovery flow with settings source list, disconnect, delete imported data, export, retry/reconnect, clear consequence copy, and manual support path.
UX-DR17: Implement reusable journey patterns: start anywhere, return to context, explicit state transparency, progressive detail, user-owned meaning, and safe exits.
UX-DR18: Use Tailwind CSS plus shadcn/ui-style primitives for foundation components: Button, Input, Textarea, Form, Dialog, Alert Dialog, Sheet/Drawer, Tabs, Dropdown Menu, Popover, Tooltip, Badge, Toast, Alert, Command/Search, Accordion, Slider/Segmented Control, Switch, and Checkbox.
UX-DR19: Build `LifeLineTimeline` custom component with vertical life-line, present marker, past/future treatment, date/period markers, item anchors, empty/sparse state, scroll preservation, filtered/search/loading/offline/error states, desktop/mobile/focused variants, and keyboard navigation.
UX-DR20: Build `MemoryAtlasCard` custom component with title, date/approximate date, type indicator, optional image/reference, story preview, importance indicator, source/status labels, primary/overflow actions, selected/expanded/draft/offline/sensitive/deleted states, and memory/event/reflection/future/import/photo variants.
UX-DR21: Build `ApproximateDateInput` with date precision selector, precision-specific input, human-readable preview, optional confidence note, validation/helper text, exact/month-year/year/period/unknown states, inline/full/period-range variants, and accessible labels.
UX-DR22: Build `ImportanceControl` with a small set of labeled levels, visual preview of timeline prominence, unset/low/medium/high/defining/disabled states, segmented/compact/read-only variants, and radio-group semantics.
UX-DR23: Build `ImportStagingCard` with source label, imported timestamp/date range, content summary, sync status, suggested matching period/event, Attach/Promote/Reflect/Hide/Discard actions, source details, lifecycle states, RescueTime/notes variants, and clear destructive confirmations.
UX-DR24: Build `PatternClarityCard` with title/prompt, supporting memories/imports count, explanation, suggestion vs user-authored framing, Review/Name pattern/Add reflection/Create future intention/Dismiss actions, suggested/user-named/confirmed/dismissed/linked states, and non-clinical language.
UX-DR25: Build `ReflectionSession` with period header, supporting context, prompt area, writing area, pattern naming field, future intention option, save draft, pause, complete, exit, emotional safety controls, autosave/offline/completed/paused/error states, desktop two-column and mobile step variants.
UX-DR26: Build `FutureIntentionMarker` with title, optional future date/period, linked pattern/reflection, status label, edit/complete/defer actions, draft/active/linked/completed/deferred/archived states, and timeline/completion/chip variants.
UX-DR27: Build `SourceStatusLabel` with source name, state label, optional icon/timestamp/details popover, manual/imported/staged/promoted/attached/hidden/draft/sync/disconnected states, badge/inline/settings variants, and text-based state clarity.
UX-DR28: Build `PrivacyDataControl` with action title, consequence copy, affected data scope, confirmation state, primary/cancel actions, support/recovery note, disconnect/delete/export/retry/reconnect variants, and safe focus management.
UX-DR29: Implement button hierarchy rules for primary, secondary, ghost/tertiary, and destructive actions; use verb-first labels and avoid multiple equal primary actions in one focused area.
UX-DR30: Implement destructive action patterns with clear destructive styling, confirmation, consequence copy, affected data scope, and safe cancel behavior.
UX-DR31: Implement calm feedback patterns for success, error, warning, offline/sync, and import states using toasts, inline state changes, alerts, and recoverable action copy.
UX-DR32: Implement forgiving form patterns: clear labels, helper text, inline validation after blur/submit, draft preservation, required-vs-optional separation, and save-now-enrich-later behavior.
UX-DR33: Implement approximate-date form behavior with exact date, month/year, year only, approximate period, unknown-but-drafted, and timeline preview.
UX-DR34: Implement reflection form behavior with large readable writing area, autosave/draft state, pause/exit controls, optional pattern naming, optional future intention creation, and no forced completion pressure.
UX-DR35: Implement search over title/story/date/approximate date/source/importance/reflection/future intentions/basic tags, with filters for date/period, importance, source, item type, staged/promoted/attached state, and future intentions.
UX-DR36: Implement overlay patterns: dialogs for destructive confirmations/permissions/export/short decisions, sheets/drawers for mobile memory detail/quick add/source details/item actions, and avoid overlays for long reflection writing or complex import review.
UX-DR37: Implement consistent lifecycle labels: Draft, Saved, Sync pending, Synced, Staged, Attached, Promoted, Hidden, Discarded, Failed, and Disconnected.
UX-DR38: Implement sensitive content handling with edit/hide/delete controls, pause/exit paths, non-alarming treatment, no forced resurfacing, and no automatic interpretation.
UX-DR39: Implement responsive behavior mobile-first with desktop as the richest review/curation/reflection surface, tablet as touch-friendly simplified layout, and mobile focused on quick capture, mandatory edits, lightweight review, reflection drafts, search, and privacy/source controls.
UX-DR40: Implement breakpoints: mobile 320-767px, tablet 768-1023px, desktop 1024px+, and wide desktop 1280px+ with timeline-specific density and side-panel behavior.
UX-DR41: Implement mobile timeline as single-column with simplified cards and bottom sheets for detail; tablet as central timeline with expandable detail or drawer; desktop as timeline plus persistent detail/context panel where useful; wide desktop with richer spacing and optional filter/search rail.
UX-DR42: Target WCAG 2.2 AA for MVP, including contrast, keyboard focus, keyboard navigation, semantic HTML, accessible icon labels, 44px practical touch targets, reduced motion, focus management, and readable long-form text.
UX-DR43: Implement emotional accessibility: pause/exit/save draft/hide/edit/delete paths, no forced resurfacing, no diagnostic language, no streak/shame/completion guilt, calm recoverable errors, and visible data ownership.
UX-DR44: Test responsive layouts at 320px, 375px, 430px, 768px, 1024px, and 1280px+.
UX-DR45: Test MVP browsers Chrome, Safari, Firefox, and Edge, with Safari included for mobile web and iOS behavior.
UX-DR46: Test accessibility with automated checks, keyboard-only navigation, screen-reader smoke tests, color contrast checks, reduced-motion checks, touch target checks, and focus management checks.
UX-DR47: Ensure private user data never appears in public routes, metadata, previews, or unauthenticated states.

### FR Coverage Map

FR1: Epic 1 - Google sign-in for private workspace access.
FR2: Epic 1 - User sign-out.
FR3: Epic 1 - User-scoped private access to timeline, events, imports, reflections, photos, and settings.
FR4: Epic 6 - View and manage connected import sources.
FR5: Epic 6 - Disconnect import sources.
FR6: Epic 6 - Delete imported data from active or disconnected sources.
FR7: Epic 6 - Export timeline data, reflections, future intentions, and imported context.
FR8: Epic 2 - Delete user-created timeline content.
FR9: Epic 6 - Understand permissions for connected sources.
FR10: Epic 2 - Create dated life events on the vertical timeline.
FR11: Epic 2 - Create approximate-dated events.
FR12: Epic 2 - Edit timeline events.
FR13: Epic 2 - Delete timeline events.
FR14: Epic 2 - Add story or reflection text to events.
FR15: Epic 2 - Attach or reference photos on events.
FR16: Epic 2 - Mark event importance.
FR17: Epic 2 - Adjust event importance.
FR18: Epic 2 - Browse timeline with history upward and future downward.
FR19: Epic 2 - Identify the present point.
FR20: Epic 2 - Create future intentions below present.
FR21: Epic 2 - Edit or delete future intentions.
FR22: Epic 2 - Hide timeline items without permanent deletion.
FR23: Epic 3 - Search timeline content.
FR24: Epic 3 - Filter timeline by date or date range.
FR25: Epic 3 - Filter timeline by importance.
FR26: Epic 3 - Filter timeline by source.
FR27: Epic 3 - Filter or group timeline by basic themes.
FR28: Epic 3 - Review a specific life period.
FR29: Epic 3 - Record a self-review summary.
FR30: Epic 3 - Identify and record reflection insights.
FR31: Epic 3 - Link future intentions to past events, reflections, or patterns.
FR32: Epic 3 - Pause or exit reflection without losing draft work.
FR33: Epic 4 - Connect RescueTime as an import source.
FR34: Epic 4 - Import RescueTime activity data.
FR35: Epic 4 - Connect notes source or import notes.
FR36: Epic 4 - Import notes content.
FR37: Epic 4 - View imported records in staged suggested-context area.
FR38: Epic 4 - Inspect imported records with source, timestamp, and sync status.
FR39: Epic 4 - Promote an imported record into a primary timeline item.
FR40: Epic 4 - Attach an imported record to an existing timeline event.
FR41: Epic 4 - Hide or discard imported records.
FR42: Epic 4 - Retry failed imports.
FR43: Epic 4 - Reconnect source after auth or sync failure.
FR44: Epic 4 - See succeeded, failed, or partially synced import records.
FR45: Epic 4 - Preserve source metadata for imported records.
FR46: Epic 4 - Prevent imported records from automatically becoming primary timeline events.
FR47: Epic 5 - Create draft timeline event while offline.
FR48: Epic 5 - Edit mandatory draft fields while offline.
FR49: Epic 5 - Sync offline drafts when connectivity returns.
FR50: Epic 5 - Show offline draft sync state.
FR51: Epic 5 - Resolve failed draft syncs.
FR52: Epic 2 - Edit, hide, or delete emotionally sensitive entries.
FR53: Epic 4 - Control whether resurfaced imported content remains visible.
FR54: Epic 3 - Use Lifeline without clinical claims or therapist-like interpretation.
FR55: Epic 3 - Access product language framing Lifeline as private reflection and life visualization.
FR56: Epic 3 - Manually create interpretations and reflections without forced conclusions.
FR57: Epic 1 - Use core Lifeline capabilities on desktop web.
FR58: Epic 1 - Use core Lifeline capabilities on mobile web.
FR59: Epic 1 - Perform quick capture and mandatory edits on mobile web.
FR60: Epic 1 - Perform richer timeline review and import curation on desktop web.
FR61: Epic 1 - Use core forms and navigation with accessible interaction patterns.
FR62: Epic 4 - View clear import error messages.
FR63: Epic 4 - Choose retry, reconnect, ignore, or disconnect when import fails.
FR64: Epic 4 - Access manual support contact for unresolved issues.
FR65: Epic 4 - Understand whether issues affect timeline, import staging, sync, export, or account access.

## Epic List

### Epic 1: Private Workspace Foundation

Users can sign in with Google, enter a private Lifeline workspace, sign out, and use the authenticated app shell across desktop and mobile with baseline accessible navigation.

**FRs covered:** FR1, FR2, FR3, FR57, FR58, FR59, FR60, FR61

### Epic 2: Memory Atlas Timeline & Life Event Capture

Users can create, edit, browse, hide, and delete meaningful life events on the vertical life-line, including approximate dates, stories, photo references, importance, present anchoring, and future intentions.

**FRs covered:** FR8, FR10, FR11, FR12, FR13, FR14, FR15, FR16, FR17, FR18, FR19, FR20, FR21, FR22, FR52

### Epic 3: Reflection, Pattern Clarity & Life Review

Users can search/filter the timeline, review a life period, record self-review summaries and insights, link future intentions to past patterns, pause/exit reflection safely, and retain full control over interpretation.

**FRs covered:** FR23, FR24, FR25, FR26, FR27, FR28, FR29, FR30, FR31, FR32, FR54, FR55, FR56

### Epic 4: Imports as Suggested Context

Users can connect RescueTime and notes sources, import data into a staged review area, inspect source metadata/status, promote or attach meaningful records, hide/discard noise, and recover from import errors.

**FRs covered:** FR33, FR34, FR35, FR36, FR37, FR38, FR39, FR40, FR41, FR42, FR43, FR44, FR45, FR46, FR53, FR62, FR63, FR64, FR65

### Epic 5: Offline Drafting & Sync Recovery

Users can create/edit mandatory timeline fields while temporarily offline, see draft sync state, sync when connectivity returns, and resolve failed draft syncs.

**FRs covered:** FR47, FR48, FR49, FR50, FR51

### Epic 6: Privacy, Source Management, Export & Deletion

Users can understand source permissions, manage connected import sources, disconnect sources, delete imported data, export their timeline, and trust that privacy-critical actions have clear consequences.

**FRs covered:** FR4, FR5, FR6, FR7, FR9

## Epic 1: Private Workspace Foundation

Users can sign in with Google, enter a private Lifeline workspace, sign out, and use the authenticated app shell across desktop and mobile with baseline accessible navigation.

### Story 1.1: Initialize Authenticated App Foundation

As a Lifeline user,
I want the app to have a stable private-web foundation,
So that I can later access my life timeline through a secure, modern web experience.

**Requirements covered:** FR57, FR58, FR61, NFR1, NFR21, AR1, AR2, AR12, AR13, AR17, AR22, AR23, AR25, AR26, AR27, AR28, AR29, AR37, AR38

**Acceptance Criteria:**

**Given** the Lifeline repository is ready for implementation
**When** the developer initializes the app foundation
**Then** the project uses the Supabase Next.js starter or equivalent Next.js App Router setup with TypeScript, Tailwind CSS, and Supabase client/server utilities
**And** the codebase has a clear `src/app`, `src/features`, `src/components`, and `src/lib` structure aligned with the architecture.

**Given** the app foundation exists
**When** environment configuration is added
**Then** `.env.example` documents required Supabase and app environment variables without containing secrets
**And** local secrets are expected only in ignored local environment files.

**Given** the app foundation exists
**When** the developer adds baseline shared utilities
**Then** the codebase includes the shared `ActionResult<T>` result shape for app-owned mutations
**And** server/client Supabase utilities are separated by runtime.

**Given** the app foundation exists
**When** architectural conventions are established
**Then** database naming, route naming, code naming, domain organization, test organization, deployment assumptions, and local-vs-shared state guidance match the architecture
**And** the project includes a recoverability path for user-created data through Supabase backups or equivalent data-protection planning.

**Given** the app foundation exists
**When** continuous integration is configured
**Then** `.github/workflows/ci.yml` runs dependency installation, TypeScript checks, lint checks, and available automated tests on pull requests or pushes
**And** the workflow is allowed to skip test execution only when no test script exists yet, with the expectation that later stories add tests to the same CI path.

**Given** the app foundation exists
**When** the developer runs validation
**Then** TypeScript and lint checks pass
**And** the app can start locally without accessing private user data or requiring unfinished future timeline features.

### Story 1.2: Google Sign-In and Sign-Out

As a Lifeline user,
I want to sign in and out with Google,
So that my life timeline is private and tied to my own account.

**Requirements covered:** FR1, FR2, FR3, FR55, AR3, AR5, AR11

**Acceptance Criteria:**

**Given** I am not authenticated
**When** I open Lifeline
**Then** I see a sign-in screen with a Google sign-in action
**And** the screen uses calm product framing that describes Lifeline as private reflection and life visualization.

**Given** I choose Google sign-in
**When** Supabase Auth completes the OAuth callback successfully
**Then** I am authenticated into my Lifeline workspace
**And** the app stores no private timeline data in public routes, metadata, previews, or unauthenticated states.

**Given** Google sign-in fails or is canceled
**When** I return to Lifeline
**Then** I see a calm, specific error or canceled state
**And** I can retry sign-in without losing app stability.

**Given** I am authenticated
**When** I choose sign out
**Then** my session ends
**And** I return to the unauthenticated sign-in experience.

**Given** auth code is implemented
**When** access rules are reviewed
**Then** Supabase Auth identity is the root ownership key for future user-owned records
**And** no temporary bypass or hardcoded user identity is used.

### Story 1.3: Protected Private Workspace Routing

As an authenticated Lifeline user,
I want private app pages to require my account session,
So that my life data cannot be reached by unauthenticated visitors or other users.

**Requirements covered:** FR3, FR57, FR58, NFR7, NFR8, NFR12, UX-DR47, AR5, AR16

**Acceptance Criteria:**

**Given** I am not authenticated
**When** I try to open an authenticated app route such as `/timeline`, `/add`, `/imports`, `/reflect`, `/search`, or `/settings`
**Then** I am redirected to the sign-in experience
**And** no private app shell content or private user data is rendered before authentication is confirmed.

**Given** I am authenticated
**When** I open an authenticated app route
**Then** the route loads inside the private workspace
**And** the authenticated user identity is available to server-side route/action code.

**Given** protected routing is implemented
**When** unauthenticated crawlers, previews, or metadata requests access private app routes
**Then** private user content is not exposed in route metadata, page previews, or unauthenticated HTML.

**Given** a future user-owned table is added
**When** server-side access patterns are used
**Then** the route/action structure supports user-scoped access through Supabase Auth and RLS
**And** no private route relies on client-only checks for protection.

**Given** I am signed in on mobile or desktop
**When** I refresh a protected route
**Then** the app preserves the authenticated routing state
**And** does not briefly flash unauthenticated-only or private-only content in the wrong state.

### Story 1.4: Responsive App Shell Navigation

As a Lifeline user,
I want a simple responsive workspace shell,
So that I can move between core areas on desktop and mobile without losing orientation.

**Requirements covered:** FR57, FR58, FR59, FR60, FR61, UX-DR9, UX-DR11, UX-DR39, UX-DR40, UX-DR41

**Acceptance Criteria:**

**Given** I am authenticated
**When** I enter the Lifeline workspace
**Then** I see a private app shell with navigation for Timeline, Add, Imports, Reflect, Search, and Settings
**And** Timeline is treated as the default emotional home surface.
**And** the primary route paths are `/timeline`, `/add`, `/imports`, `/reflect`, `/search`, and `/settings`.

**Given** I use Lifeline on desktop
**When** the app shell renders
**Then** navigation is visible and supports richer workspace pages such as timeline review, imports, reflection, search, and settings
**And** the layout has room for future detail panels without requiring those feature pages to be fully implemented in this story.

**Given** I use Lifeline on mobile
**When** the app shell renders
**Then** navigation remains usable for quick capture, mandatory edits, lightweight review, reflection drafts, search, and privacy/source controls
**And** touch targets are at least 44px where practical.

**Given** I navigate between workspace routes
**When** the route changes
**Then** the active navigation state updates clearly
**And** the app does not expose private data in public routes or unauthenticated states.

**Given** a workspace route is not implemented yet
**When** I open it from navigation
**Then** I see a calm placeholder page that preserves the app shell
**And** the placeholder does not pretend unfinished functionality is complete.

### Story 1.5: Baseline Accessible UI Foundation

As a Lifeline user,
I want the app's basic interface to be readable, calm, and accessible,
So that every later feature starts from a trustworthy and usable foundation.

**Requirements covered:** FR61, NFR13, NFR28, NFR29, NFR30, NFR31, NFR32, UX-DR1, UX-DR2, UX-DR3, UX-DR4, UX-DR5, UX-DR6, UX-DR7, UX-DR18, UX-DR29, UX-DR42, UX-DR44, UX-DR45, UX-DR46

**Acceptance Criteria:**

**Given** the app shell exists
**When** Lifeline design tokens are implemented
**Then** the app includes the approved core color tokens, semantic state tokens, typography scale, spacing scale, radius rules, and focus state styling
**And** token usage supports the warm, minimal, reflective visual direction.

**Given** shared UI primitives are added
**When** buttons, links, inputs, labels, alerts, badges, toasts, dialogs, and sheets are used
**Then** they follow the chosen Tailwind plus shadcn/ui-style foundation
**And** they are themed consistently with Lifeline tokens.

**Given** a user navigates with keyboard input
**When** they move through the sign-in screen and private app shell
**Then** all interactive controls have visible focus states
**And** tab order is logical.

**Given** the app renders text, controls, and status states
**When** colors are used
**Then** WCAG 2.2 AA contrast is met for normal text and controls
**And** color is not the only indicator of active route, source state, error, or status.

**Given** the app shell is viewed at mobile, tablet, desktop, and wide desktop widths
**When** layout is tested at 320px, 375px, 430px, 768px, 1024px, and 1280px+
**Then** navigation and visible text do not overlap or overflow incoherently
**And** the app remains usable without viewport-based font scaling.

## Epic 2: Memory Atlas Timeline & Life Event Capture

Users can create, edit, browse, hide, and delete meaningful life events on the vertical life-line, including approximate dates, stories, photo references, importance, present anchoring, and future intentions.

### Story 2.1: Empty Memory Atlas Timeline

As an authenticated Lifeline user,
I want to see an empty vertical life-line before I add memories,
So that I understand where my past, present, and future will live.

**Requirements covered:** FR3, FR18, FR19, UX-DR8, UX-DR12, UX-DR19, AR4, AR5, AR30

**Acceptance Criteria:**

**Given** I am authenticated and have no timeline items
**When** I open the Timeline route
**Then** I see a blank or sparse Memory Atlas timeline with a visible vertical life-line
**And** the present point is clearly marked.

**Given** the timeline is empty
**When** I view the empty state
**Then** it invites me to begin with Add memory, Add future intention, or Import context
**And** the copy does not imply I am behind, incomplete, or failing.

**Given** the timeline route is implemented
**When** timeline storage is created
**Then** the app includes the minimal timeline data model needed for user-owned life events
**And** user ownership is enforced through Supabase Auth identity and RLS.

**Given** I view the empty timeline on mobile and desktop
**When** the layout adapts
**Then** the life-line remains legible
**And** the primary actions remain usable without overlapping text or controls.

**Given** the timeline has no items
**When** the app renders
**Then** it does not require imports, reflection sessions, photos, or future stories to function
**And** it is ready for the next story to add event creation.

### Story 2.2: Create Life Event with Approximate Date

As an authenticated Lifeline user,
I want to add a meaningful life event with an exact or approximate date,
So that I can begin placing memories on the line even when I do not know the exact day.

**Requirements covered:** FR10, FR11, FR14, FR57, FR58, FR59, NFR2, UX-DR13, UX-DR20, UX-DR21, UX-DR32, UX-DR33, AR12, AR13, AR15

**Acceptance Criteria:**

**Given** I am on the Timeline or Add route
**When** I choose Add memory
**Then** I see a memory creation form with required fields for title and date/approximate date
**And** optional enrichment fields do not block saving.

**Given** I am creating a memory
**When** I choose a date precision
**Then** I can enter an exact date, month/year, year only, approximate period, or unknown-but-drafted date state
**And** the form previews how the date will appear on the timeline.

**Given** I submit a valid memory
**When** the save succeeds
**Then** the event is persisted as a user-owned timeline event
**And** the new memory appears on the life-line with title, date label, and default source/status labeling.

**Given** I submit invalid or incomplete required fields
**When** validation runs
**Then** I see clear inline validation messages
**And** entered draft content is preserved.

**Given** event creation is implemented
**When** server-side mutation code runs
**Then** it validates input through the agreed form/action boundary pattern
**And** it returns the shared `ActionResult<T>` shape with stable error codes.

**Given** I create a memory on mobile or desktop
**When** the form and resulting card render
**Then** controls remain reachable, labels remain readable, and no text overlaps its container.

### Story 2.3: Browse Timeline with Present Anchor

As an authenticated Lifeline user,
I want to browse my memories on a vertical life-line with the present clearly anchored,
So that I can understand where events sit in relation to my past and future.

**Requirements covered:** FR18, FR19, FR57, FR58, FR60, NFR3, NFR5, UX-DR19, UX-DR20, UX-DR39, UX-DR40, UX-DR41, AR18, AR19

**Acceptance Criteria:**

**Given** I have one or more timeline events
**When** I open the Timeline route
**Then** events appear on the vertical life-line in chronological position
**And** history is oriented upward while future space is oriented downward.

**Given** I browse the timeline
**When** I move through past events
**Then** the present marker remains understandable as the spatial reference point
**And** event date labels remain readable.

**Given** the timeline loads multiple events
**When** events are fetched
**Then** the query supports incremental loading or partial rendering
**And** the page does not block manual event creation or editing while loading older content.

**Given** timeline events render as Memory Atlas cards
**When** I view a card
**Then** I can see title, date/approximate date, type/status label, and a short preview if available
**And** source/status and importance information are not communicated by color alone.

**Given** I browse on mobile, tablet, desktop, or wide desktop
**When** the timeline layout adapts
**Then** mobile uses a simplified single-column timeline
**And** desktop can use richer spacing and optional detail-panel space without breaking timeline readability.

**Given** I navigate away from the timeline and return
**When** the route supports returning to context
**Then** the app preserves or restores relevant timeline context where practical
**And** later edit/detail flows can return to the same position.

### Story 2.4: Memory Detail, Edit, Hide, and Delete

As an authenticated Lifeline user,
I want to open and manage a memory after creating it,
So that I can refine, hide, or remove sensitive life material while staying in control.

**Requirements covered:** FR8, FR12, FR13, FR22, FR52, UX-DR20, UX-DR30, UX-DR31, UX-DR36, UX-DR38, AR5, AR12, AR13

**Acceptance Criteria:**

**Given** I have a timeline event
**When** I select it from the timeline
**Then** I can open a memory detail view or panel
**And** the detail view shows the event title, date/approximate date, story preview or text if present, source/status label, and available actions.

**Given** I am viewing a memory detail
**When** I choose edit
**Then** I can update the title and date/approximate date fields introduced in earlier stories
**And** saving changes updates the timeline card and preserves user ownership.

**Given** I want to reduce visibility without deleting
**When** I choose hide
**Then** the event is marked hidden rather than permanently removed
**And** the timeline visually de-emphasizes or excludes it according to the active view without losing the record.

**Given** I choose delete
**When** the destructive confirmation appears
**Then** the copy clearly explains that the selected timeline event will be deleted
**And** I can cancel safely or confirm deletion.

**Given** deletion succeeds
**When** I return to the timeline
**Then** the event no longer appears in normal timeline browsing
**And** the app returns me to the prior timeline context where practical.

**Given** edit, hide, or delete fails
**When** the app shows feedback
**Then** the error is calm, specific, recoverable, and does not expose raw Supabase errors.

### Story 2.5: Story Text and Photo References

As an authenticated Lifeline user,
I want to enrich a memory with story text and photo references,
So that my timeline feels personal and emotionally recognizable.

**Requirements covered:** FR14, FR15, NFR8, UX-DR20, UX-DR32, AR6, AR24, AR31

**Acceptance Criteria:**

**Given** I am creating or editing a memory
**When** I add story text
**Then** the story is saved with the user-owned timeline event
**And** long-form text remains readable in the memory detail view.

**Given** I am creating or editing a memory
**When** I add a photo reference or supported photo attachment
**Then** the reference/attachment is associated with the selected timeline event
**And** the timeline card can show an appropriate photo-led or reference-aware preview.

**Given** private media storage is used
**When** a photo/file object is stored
**Then** it uses private Supabase Storage or equivalent private storage
**And** it is not exposed through public assets or unauthenticated routes.

**Given** I remove a photo reference from a memory
**When** the change is saved
**Then** the memory no longer displays that reference
**And** the event itself remains intact.

**Given** story text or photo reference saving fails
**When** the app shows feedback
**Then** my entered text is preserved where practical
**And** the error explains the recovery action without alarming language.

**Given** a memory includes an image preview
**When** it renders on timeline or detail surfaces
**Then** it has alt text or an explicitly decorative treatment
**And** it does not cause text, date labels, or controls to overlap.

### Story 2.6: Importance Weighting

As an authenticated Lifeline user,
I want to mark how important a memory is,
So that defining moments stand out without making every timeline item feel equal.

**Requirements covered:** FR16, FR17, NFR30, UX-DR22, AR18

**Acceptance Criteria:**

**Given** I am creating or editing a timeline event
**When** I set importance
**Then** I can choose from a small labeled set of importance levels
**And** the control explains the levels without judgmental language.

**Given** an event has an importance value
**When** it appears on the timeline
**Then** its visual prominence reflects the importance level
**And** the meaning is communicated through text/structure as well as color or size.

**Given** I update importance after creation
**When** the save succeeds
**Then** the timeline card and detail view reflect the new importance
**And** the event remains associated with the authenticated user.

**Given** I use keyboard navigation
**When** I interact with the importance control
**Then** the control behaves like an accessible radio group or equivalent pattern
**And** each option has a clear accessible label.

**Given** importance affects visual hierarchy
**When** the timeline renders at mobile and desktop widths
**Then** importance styling does not create overlapping cards, unreadable text, or unstable layout shifts.

**Given** importance saving fails
**When** the app shows feedback
**Then** I see a calm recoverable error
**And** the previous saved importance value remains clear.

### Story 2.7: Future Intentions Below Present

As an authenticated Lifeline user,
I want to add future intentions below the present point,
So that Lifeline connects my past memories with what I want to build next.

**Requirements covered:** FR20, FR21, FR57, FR58, UX-DR26, UX-DR39, UX-DR41, AR4, AR5

**Acceptance Criteria:**

**Given** I am on the Timeline or Add route
**When** I choose Add future intention
**Then** I see a focused form for intention title and optional future date or approximate future period
**And** saving does not require reflection or pattern-linking features from future stories.

**Given** I save a valid future intention
**When** I return to the timeline
**Then** the intention appears below the present point
**And** it is visually distinct from past memories without relying only on color.

**Given** I view a future intention
**When** I open its detail or actions
**Then** I can edit or delete the intention
**And** destructive deletion uses clear confirmation copy.

**Given** I create or edit a future intention
**When** it is persisted
**Then** it is user-owned and protected by the same private data access model as timeline events.

**Given** I view the future area on mobile or desktop
**When** the timeline renders
**Then** the future direction remains understandable
**And** intention markers do not overlap with the present marker, cards, labels, or controls.

**Given** saving or deleting a future intention fails
**When** the app shows feedback
**Then** the message is calm, specific, and recoverable
**And** user-entered draft text is preserved where practical.

## Epic 3: Reflection, Pattern Clarity & Life Review

Users can search/filter the timeline, review a life period, record self-review summaries and insights, link future intentions to past patterns, pause/exit reflection safely, and retain full control over interpretation.

### Story 3.1: Timeline Search and Filters

As an authenticated Lifeline user,
I want to search and filter my timeline,
So that I can find meaningful memories, periods, and patterns without manually scrolling through everything.

**Requirements covered:** FR23, FR24, FR25, FR26, FR27, NFR6, UX-DR35, AR18

**Acceptance Criteria:**

**Given** I have timeline events and future intentions
**When** I use search
**Then** I can search memory title, story text, date/approximate date labels, reflection text where available, and future intention text
**And** results are scoped only to my authenticated account.

**Given** I am viewing the timeline
**When** I apply filters
**Then** I can filter by date/period, importance, source, item type, and future intentions
**And** filters are visible and easy to clear.

**Given** search or filters produce results
**When** results render
**Then** they preserve timeline context where practical
**And** result cards retain readable source/status/date labels.

**Given** search or filters produce no results
**When** the empty result state appears
**Then** it suggests relaxing filters or searching broader terms
**And** it does not imply user failure.

**Given** search/filter queries run at MVP scale
**When** results are requested
**Then** usable results return within the performance target defined for MVP-scale timelines
**And** the UI shows loading state without wiping the previous useful context unnecessarily.

**Given** I use search/filter on mobile or desktop
**When** controls render
**Then** they remain accessible by keyboard and touch
**And** controls do not overlap timeline content.

### Story 3.2: Select and Review a Life Period

As an authenticated Lifeline user,
I want to select a life period for review,
So that I can see what happened during that time in one coherent reflective view.

**Requirements covered:** FR28, FR29, FR57, FR58, FR60, UX-DR15, UX-DR17, UX-DR39, UX-DR41

**Acceptance Criteria:**

**Given** I have timeline events and future intentions
**When** I select a date range or life period from Timeline or Reflect
**Then** the app shows a period review view scoped to that selected period
**And** it includes relevant memories, future intentions where applicable, importance markers, and source/status labels.

**Given** a selected period has no items
**When** the period review view opens
**Then** the empty state invites me to add a memory or adjust the period
**And** it avoids pressure or shame-based language.

**Given** I am reviewing a period
**When** the app presents the period summary
**Then** it prioritizes high-importance events while still allowing lower-importance context to be visible or discoverable
**And** it does not invent meaning or diagnose patterns for me.

**Given** I use period review on desktop
**When** the review view renders
**Then** it may use side-by-side context and timeline space for richer review
**And** the layout remains readable and stable.

**Given** I use period review on mobile
**When** the review view renders
**Then** it uses a simplified stacked or step-based layout
**And** all actions remain reachable through visible controls.

**Given** I leave period review
**When** I return to the timeline
**Then** the app preserves my prior timeline context where practical.

### Story 3.3: Reflection Session Drafting

As an authenticated Lifeline user,
I want to write and save a reflection for a selected life period,
So that I can capture what I noticed without pressure to finish immediately.

**Requirements covered:** FR29, FR30, FR32, NFR15, UX-DR25, UX-DR31, UX-DR34, UX-DR43, AR4, AR12

**Acceptance Criteria:**

**Given** I am reviewing a selected life period
**When** I start a reflection session
**Then** I see a calm reflection surface with period context, a writing area, and prompts such as what happened, what repeated, and what changed
**And** the prompts are optional support rather than forced conclusions.

**Given** I write reflection text
**When** draft saving occurs
**Then** my draft is preserved with the selected period and authenticated user
**And** I can leave and return without losing drafted work.

**Given** I want to stop mid-session
**When** I choose pause, save draft, exit, or close
**Then** the app preserves my draft where practical
**And** returns me to the period or timeline context without making me feel trapped.

**Given** I complete a reflection summary
**When** I save it
**Then** the summary is associated with the selected life period
**And** it can appear in future period review and search contexts.

**Given** autosave or manual save fails
**When** the app shows feedback
**Then** the message is calm, specific, and recoverable
**And** it clearly distinguishes local draft state from synced state when applicable.

**Given** I use keyboard or screen-reader navigation
**When** I enter the reflection session
**Then** focus order, labels, and heading structure support writing and exiting safely.

### Story 3.4: Record Insights and User-Named Patterns

As an authenticated Lifeline user,
I want to name insights and patterns I notice during reflection,
So that Lifeline helps me create clarity without assigning meaning for me.

**Requirements covered:** FR30, FR54, FR55, FR56, UX-DR10, UX-DR24, UX-DR31, UX-DR38, AR24

**Acceptance Criteria:**

**Given** I am in a reflection session or period review
**When** I notice a repeated behavior, theme, turning point, or life pattern
**Then** I can record an insight or user-named pattern
**And** the pattern is saved as my authored interpretation.

**Given** a pattern or insight is shown in the UI
**When** it appears on a period review, reflection summary, or related memory area
**Then** it is clearly distinguished as user-authored or user-confirmed
**And** it is not presented as a diagnosis, clinical conclusion, or system certainty.

**Given** I want to connect supporting context
**When** I add memories or timeline items as supporting evidence
**Then** the pattern records those links
**And** the linked items remain accessible from the pattern view.

**Given** I edit or dismiss a pattern
**When** the change is saved
**Then** the updated state is reflected in period review and reflection contexts
**And** the app preserves the underlying memories/events.

**Given** the UI offers a possible pattern prompt
**When** I choose not to use it
**Then** I can dismiss or ignore it without penalty
**And** the app does not pressure me to create a pattern.

**Given** pattern content is saved or displayed
**When** logs and diagnostics run
**Then** sensitive pattern/reflection text is not stored in logs unless explicitly required and disclosed.

### Story 3.5: Link Future Intentions to Reflections and Patterns

As an authenticated Lifeline user,
I want to connect a future intention to a reflection or pattern,
So that the future part of my life-line grows from what I learned about the past.

**Requirements covered:** FR31, FR20, FR21, UX-DR15, UX-DR26, AR4, AR5

**Acceptance Criteria:**

**Given** I have a saved reflection or user-named pattern
**When** I create or edit a future intention
**Then** I can link it to the reflection, pattern, or supporting past event
**And** the link is saved under my authenticated user account.

**Given** a future intention is linked to a reflection or pattern
**When** I view the future intention
**Then** I can see the linked past context
**And** I can navigate back to the reflection, pattern, or memory that inspired it.

**Given** I complete a reflection session
**When** the completion view appears
**Then** I am offered the option to create a future intention
**And** I can skip that option without penalty or pressure.

**Given** I unlink a future intention from a pattern or reflection
**When** the change is saved
**Then** the future intention remains intact
**And** only the relationship is removed.

**Given** linked future intentions appear on the timeline
**When** they render below the present
**Then** the relationship to past insight is understandable through text/structure, not only position or color.

**Given** linking fails
**When** the app shows feedback
**Then** the message explains the issue calmly
**And** the original reflection, pattern, and future intention remain unchanged.

### Story 3.6: Product Boundary and Emotional Safety Language

As a reflective Lifeline user,
I want the product to support self-understanding without diagnosing or pressuring me,
So that I feel safe using it around sensitive life material.

**Requirements covered:** FR52, FR54, FR55, FR56, NFR14, UX-DR24, UX-DR31, UX-DR38, UX-DR43, AR39

**Acceptance Criteria:**

**Given** I use timeline review, reflection, pattern, or future intention surfaces
**When** product copy appears
**Then** it frames Lifeline as private reflection and life visualization
**And** it avoids clinical, diagnostic, treatment, therapist-like, or certainty-based claims.

**Given** I review emotionally sensitive content
**When** I interact with memories, reflections, or patterns
**Then** edit, hide, delete, pause, save draft, and exit paths are visible where relevant
**And** no flow traps me inside difficult content.

**Given** I complete or pause a reflection
**When** the app provides feedback
**Then** the feedback is calm and non-gamified
**And** it avoids streaks, shame, completion guilt, or pressure to make a future decision.

**Given** the app surfaces a possible pattern prompt
**When** the prompt is displayed
**Then** the language makes clear that the user chooses meaning
**And** the product does not force conclusions.

**Given** errors happen in reflection or pattern flows
**When** feedback appears
**Then** errors are specific, recoverable, and emotionally non-alarming
**And** user-authored draft content is preserved where practical.

**Given** app copy is reviewed before completion
**When** clinical or diagnostic phrases are found
**Then** they are replaced with private reflection and user-authored meaning language.

## Epic 4: Imports as Suggested Context

Users can connect RescueTime and notes sources, import data into a staged review area, inspect source metadata/status, promote or attach meaningful records, hide/discard noise, and recover from import errors.

### Story 4.1: Import Review Staging Foundation

As an authenticated Lifeline user,
I want imported data to appear in a separate staged review area,
So that my main life-line is not flooded with raw activity or note records.

**Requirements covered:** FR37, FR38, FR45, FR46, NFR4, NFR24, UX-DR14, UX-DR23, AR4, AR7, AR8, AR9, AR21, AR24, AR30

**Acceptance Criteria:**

**Given** I am authenticated
**When** I open the Imports route
**Then** I see an Import Review surface separate from the main Timeline
**And** the page explains that imports remain staged until I choose what matters.

**Given** import storage is implemented
**When** import source and import record tables are created
**Then** they are user-owned through Supabase Auth identity and RLS
**And** imported records are stored separately from primary timeline events.

**Given** imported records exist
**When** they are queried for the Imports page
**Then** they include lifecycle state, sync status, source metadata, timestamp/date range, and content summary fields
**And** they do not automatically appear as primary timeline events.

**Given** there are no connected sources or staged records
**When** I open Imports
**Then** the empty state explains imports calmly
**And** offers actions to connect RescueTime or import notes.

**Given** import lifecycle states are implemented
**When** a record is created
**Then** its initial lifecycle state is `staged`
**And** later states use explicit lifecycle values rather than ad hoc booleans.

**Given** import staging code logs errors
**When** logs or diagnostics are written
**Then** they capture stable error codes and technical context only
**And** they do not store sensitive note content or detailed activity content.

### Story 4.2: Connect and Import RescueTime Data

As an authenticated Lifeline user,
I want to connect RescueTime and import activity context,
So that I can review what I was doing during selected life periods without polluting my main timeline.

**Requirements covered:** FR33, FR34, FR37, FR38, FR44, FR45, FR46, FR62, FR63, NFR9, NFR22, UX-DR14, AR11, AR34

**MVP scope guard:** This story is intended as a narrow vertical slice: one supported RescueTime connection/import path, a small normalized activity dataset, staged records, and recoverable source-specific errors. It should not expand into broad historical sync, background worker infrastructure, advanced analytics, or multi-source import abstractions. If the first supported RescueTime path cannot fit into one implementation slice, split this story into "connect RescueTime source" and "normalize first RescueTime import into staging" before development.

**Acceptance Criteria:**

**Given** I am on the Imports route
**When** I choose Connect RescueTime
**Then** I see a clear permission explanation for what Lifeline will access and why
**And** the copy states that imported data will remain staged until I curate it.

**Given** I authorize RescueTime successfully
**When** the connection is saved
**Then** an import source record is created for my authenticated account
**And** any token or secret handling stays server-side.

**Given** I trigger a RescueTime import
**When** activity data is fetched
**Then** Lifeline normalizes records into staged import records with source metadata, timestamps/date ranges, sync status, and activity summaries
**And** no RescueTime record becomes a primary timeline event automatically.

**Given** the RescueTime import succeeds
**When** I return to Import Review
**Then** I can see newly staged RescueTime records grouped by date or period
**And** each record is labeled as RescueTime-sourced.

**Given** the RescueTime import partially fails
**When** results are shown
**Then** successfully imported records remain available
**And** failed records or failed ranges are identified with retry guidance.

**Given** authorization fails, expires, or is canceled
**When** I return to Lifeline
**Then** I see a calm source-specific error state
**And** I can retry, reconnect, ignore, or disconnect as appropriate.

### Story 4.3: Import Notes Content

As an authenticated Lifeline user,
I want to import notes content into staged review,
So that private written material can help me remember life periods without automatically becoming timeline events.

**Requirements covered:** FR35, FR36, FR37, FR38, FR44, FR45, FR46, FR62, FR63, NFR23, UX-DR14, AR11, AR24, AR35

**MVP scope guard:** This story is intended as a narrow vertical slice for the first supported notes import path, such as a constrained export/upload or a single explicitly scoped connector path. It should not expand into broad Notion/Google Keep parity, bidirectional sync, rich note editing, or multi-provider abstraction. If the first supported notes path cannot fit into one implementation slice, split this story into "accept/connect notes source" and "normalize first notes import into staging" before development.

**Acceptance Criteria:**

**Given** I am on the Imports route
**When** I choose Import Notes
**Then** I see a clear explanation of supported notes import options for MVP
**And** the copy explains whether content is uploaded, connected, copied, or referenced.

**Given** I provide a supported notes source or export
**When** Lifeline processes the notes
**Then** imported note records are normalized into staged import records with source name, title or summary, content reference or content body where supported, timestamp/date metadata where available, and sync/import status.

**Given** notes contain sensitive written material
**When** records are stored or logged
**Then** user-owned note data is protected by authenticated ownership and RLS
**And** logs avoid storing note content.

**Given** a notes import succeeds
**When** I return to Import Review
**Then** I can see newly staged notes grouped by date or period where possible
**And** each record is labeled with its notes source.

**Given** a note has missing or ambiguous date metadata
**When** it appears in staging
**Then** the record clearly indicates that date placement needs review
**And** the user can still hide, discard, or later promote with an approximate date.

**Given** a notes import fails or partially fails
**When** results are shown
**Then** the app distinguishes successful records from failed records
**And** offers retry, ignore, or support guidance without losing successful imports.

### Story 4.4: Inspect Staged Import Records

As an authenticated Lifeline user,
I want to inspect staged imported records with clear source and status information,
So that I can decide what belongs in my life story.

**Requirements covered:** FR37, FR38, FR44, FR45, FR65, NFR20, UX-DR23, UX-DR27, UX-DR31, UX-DR37, AR8, AR9

**Acceptance Criteria:**

**Given** I have staged imported records
**When** I open Import Review
**Then** each record appears as an Import Staging Card with source label, date/timestamp or date range, content summary, lifecycle state, and sync status
**And** each state is communicated through text, not color alone.

**Given** I inspect a staged record
**When** I open details or source information
**Then** I can understand where the record came from, when it was imported, and whether it is staged, failed, attached, promoted, hidden, or discarded
**And** essential state information is visible without relying only on a tooltip.

**Given** imported records are grouped
**When** I browse staging
**Then** records can be grouped by date or period where metadata allows
**And** records with missing date metadata are clearly separated for review.

**Given** a record has sync failure or partial failure status
**When** it appears in the list
**Then** the failure is specific enough to guide retry/reconnect/ignore
**And** successful records in the same import remain usable.

**Given** I use the Import Review page on desktop
**When** staged records render
**Then** the UI supports efficient review without becoming a dense analytics dashboard.

**Given** I use the Import Review page on mobile
**When** staged records render
**Then** actions and status labels remain readable and touch-friendly
**And** the layout does not hide destructive or privacy-relevant consequences.

### Story 4.5: Promote or Attach Imported Context

As an authenticated Lifeline user,
I want to promote or attach meaningful imported records,
So that useful context becomes part of my life story only when I choose it.

**Requirements covered:** FR39, FR40, FR45, FR46, NFR20, NFR24, UX-DR14, UX-DR23, UX-DR27, AR7, AR8, AR13, AR32, AR33

**Acceptance Criteria:**

**Given** I am reviewing a staged imported record
**When** I choose Promote
**Then** the app creates a primary timeline item from that record using only the required missing fields needed for timeline placement
**And** the original source metadata remains associated with the promoted item.

**Given** an imported record has insufficient date information for promotion
**When** I choose Promote
**Then** the app asks for the minimum required exact or approximate date information
**And** the record remains staged until valid placement information is provided.

**Given** I am reviewing a staged imported record
**When** I choose Attach
**Then** I can select an existing timeline event to attach the record to
**And** the imported record lifecycle state changes to attached after success.

**Given** an imported record is promoted or attached
**When** I return to Import Review
**Then** the record clearly shows its new state
**And** I return to the same review position where practical.

**Given** an imported record is promoted or attached
**When** I view the related timeline item or memory detail
**Then** the source/status label makes the imported context understandable
**And** the main timeline remains visually focused on meaningful life events.

**Given** promotion or attachment fails
**When** feedback appears
**Then** the record remains staged
**And** the error explains how to recover without raw technical error leakage.

### Story 4.6: Hide, Discard, and Control Resurfaced Imports

As an authenticated Lifeline user,
I want to hide or discard imported records that do not matter,
So that imported data stays useful without overwhelming my timeline or reflection workflow.

**Requirements covered:** FR41, FR53, NFR24, UX-DR23, UX-DR27, UX-DR37, AR8

**Acceptance Criteria:**

**Given** I am reviewing a staged imported record
**When** I choose Hide
**Then** the record is removed from normal staged review visibility without being promoted or attached
**And** its lifecycle state clearly shows hidden where relevant.

**Given** I am reviewing a staged imported record
**When** I choose Discard
**Then** I see a clear confirmation if the action is destructive or difficult to reverse
**And** confirming changes the record lifecycle state to discarded.

**Given** a record is hidden or discarded
**When** I browse timeline, reflection, or import suggestions
**Then** the record does not keep resurfacing as suggested context
**And** I remain in control of whether hidden/imported content is visible in relevant workflows.

**Given** a hidden or discarded record appears in a management or filtered state
**When** I inspect it
**Then** source metadata and lifecycle state remain understandable
**And** I can distinguish hidden/discarded records from staged, promoted, and attached records.

**Given** hide or discard fails
**When** feedback appears
**Then** the record remains in its previous state
**And** the app provides a calm recovery path.

**Given** lifecycle state is displayed
**When** the UI communicates staged, attached, promoted, hidden, discarded, failed, or disconnected states
**Then** state labels are explicit and not color-only.

### Story 4.7: Import Error Recovery and Support Path

As an authenticated Lifeline user,
I want import problems to be understandable and recoverable,
So that I can trust Lifeline even when external sources fail.

**Requirements covered:** FR42, FR43, FR44, FR62, FR63, FR64, FR65, NFR19, NFR26, NFR27, UX-DR14, UX-DR23, UX-DR31, AR9, AR14

**Acceptance Criteria:**

**Given** an import fails
**When** the failure state is shown
**Then** the message identifies whether the issue is authorization, network, source availability, source data, partial sync, or unknown when known
**And** it explains whether timeline content, import staging, sync, export, or account access is affected.

**Given** an import partially succeeds
**When** the import result is displayed
**Then** successful records remain available in staging
**And** failed records or ranges are separately identified with retry guidance.

**Given** authorization expires or becomes invalid
**When** I view the affected source
**Then** I can choose Reconnect
**And** the app explains what reconnecting will and will not change.

**Given** a failed import can be retried
**When** I choose Retry
**Then** only the relevant failed source, records, or range is retried where practical
**And** duplicate staged records are avoided when records can be matched reliably.

**Given** an import issue cannot be resolved in-product
**When** I need more help
**Then** I can access a manual support contact path
**And** the support context avoids exposing sensitive note/reflection/activity content by default.

**Given** import recovery actions are rendered
**When** I use mobile, desktop, keyboard, or screen-reader navigation
**Then** retry, reconnect, ignore, disconnect, and support actions remain reachable and clearly labeled.

## Epic 5: Offline Drafting & Sync Recovery

Users can create/edit mandatory timeline fields while temporarily offline, see draft sync state, sync when connectivity returns, and resolve failed draft syncs.

### Story 5.1: Create Offline Timeline Draft

As an authenticated Lifeline user,
I want to draft a memory while temporarily offline,
So that I can capture important life material without waiting for connectivity.

**Requirements covered:** FR47, FR50, NFR16, NFR17, UX-DR31, AR10, AR20

**Acceptance Criteria:**

**Given** I am authenticated and temporarily offline
**When** I choose Add memory
**Then** I can create a local draft with the mandatory event fields supported by MVP
**And** the app clearly labels the draft as saved on this device or local only.

**Given** I create an offline draft
**When** the draft is stored locally
**Then** it preserves title, date/approximate date, and any other mandatory event fields supported for offline editing
**And** it does not require imports, media upload, or full reflection sync while offline.

**Given** I return to the timeline while offline
**When** local drafts are visible
**Then** the draft appears in the timeline or draft area with an explicit unsynced/local state
**And** the state is not communicated by color alone.

**Given** local draft storage fails
**When** I attempt to save
**Then** I see a clear recoverable error
**And** the app does not falsely claim the draft was saved.

**Given** I refresh the app while still offline
**When** I return to Lifeline
**Then** locally stored drafts remain available where practical
**And** the app distinguishes local drafts from synced timeline events.

### Story 5.2: Edit Mandatory Draft Fields Offline

As an authenticated Lifeline user,
I want to edit mandatory memory draft fields while offline,
So that I can keep refining a captured memory before it syncs.

**Requirements covered:** FR48, FR50, NFR16, NFR17, UX-DR21, UX-DR32, UX-DR33, AR10, AR20

**Acceptance Criteria:**

**Given** I have a local-only offline draft
**When** I open it while offline
**Then** I can edit the supported mandatory fields such as title and date/approximate date
**And** the UI clearly communicates that full enrichment may require connectivity.

**Given** I edit an offline draft
**When** I save changes locally
**Then** the updated mandatory fields are preserved in local storage
**And** the draft remains labeled with a local or unsynced state.

**Given** I enter invalid mandatory field values
**When** validation runs
**Then** I see inline validation messages
**And** the draft content is not discarded.

**Given** I view offline draft status
**When** the draft appears in forms, timeline, or draft surfaces
**Then** the state uses the shared offline labels such as local only, sync pending, synced, conflict, or failed
**And** the state is communicated through text/structure, not color alone.

**Given** I attempt unsupported offline actions such as media upload, import sync, or full reflection sync
**When** I am offline
**Then** the app explains calmly that the action requires connectivity
**And** it does not block supported mandatory field editing.

### Story 5.3: Sync Drafts When Connectivity Returns

As an authenticated Lifeline user,
I want offline drafts to sync when connectivity returns,
So that captured memories become part of my private timeline.

**Requirements covered:** FR49, FR50, NFR15, NFR16, NFR17, UX-DR31, AR10, AR13, AR20

**Acceptance Criteria:**

**Given** I have one or more local-only drafts
**When** the app detects connectivity has returned
**Then** it offers or begins sync according to the MVP sync behavior
**And** each draft shows a clear sync status.

**Given** a draft is syncing
**When** sync is in progress
**Then** the draft state changes to syncing or sync pending
**And** I can distinguish it from fully synced timeline events.

**Given** a draft sync succeeds
**When** the server creates the timeline event
**Then** the synced event appears as a normal user-owned timeline event
**And** the local draft state changes to synced or is safely cleared after confirmation.

**Given** multiple drafts exist
**When** syncing occurs
**Then** each draft has its own sync result
**And** one failed draft does not prevent successful drafts from syncing.

**Given** sync succeeds after refresh or route change
**When** I return to the timeline
**Then** synced events remain visible in the correct timeline position
**And** duplicate events are avoided where draft identity can be matched.

**Given** sync uses server-side mutation code
**When** the draft is persisted
**Then** ownership is scoped to the authenticated user
**And** the mutation returns the shared `ActionResult<T>` shape.

### Story 5.4: Failed Sync and Conflict Recovery

As an authenticated Lifeline user,
I want to recover from failed or conflicting draft syncs,
So that offline-captured memories are not silently lost.

**Requirements covered:** FR50, FR51, NFR17, NFR18, UX-DR31, AR10, AR14, AR20, AR24

**Acceptance Criteria:**

**Given** an offline draft fails to sync
**When** the failure is shown
**Then** the draft remains available locally
**And** the app labels it as failed with a calm, recoverable message.

**Given** a failed draft is recoverable
**When** I choose Retry
**Then** the app attempts to sync that draft again
**And** the retry result updates only that draft's sync state.

**Given** a local draft conflicts with a server-side version
**When** the conflict is detected
**Then** the app labels the draft as conflict
**And** I can review the local and server versions before choosing how to resolve it.

**Given** I resolve a conflict
**When** I choose a resolution
**Then** the selected version is saved or retained according to my choice
**And** the app does not silently overwrite user-authored content.

**Given** sync failure or conflict recovery UI appears
**When** I use mobile, desktop, keyboard, or screen-reader navigation
**Then** retry, keep local, use server version, cancel, and delete/discard actions are clearly labeled and reachable.

**Given** sync or conflict errors are logged
**When** diagnostics are written
**Then** logs capture stable error codes and technical context
**And** they avoid storing sensitive memory text by default.

## Epic 6: Privacy, Source Management, Export & Deletion

Users can understand source permissions, manage connected import sources, disconnect sources, delete imported data, export their timeline, and trust that privacy-critical actions have clear consequences.

### Story 6.1: Privacy and Data Settings

As an authenticated Lifeline user,
I want a clear Privacy and Data settings area,
So that I can understand and control sensitive timeline and import data.

**Requirements covered:** FR4, FR7, FR9, NFR7, NFR8, UX-DR16, UX-DR28, AR36

**Acceptance Criteria:**

**Given** I am authenticated
**When** I open Settings
**Then** I can access a Privacy and Data section
**And** it uses calm, plain-language copy about private user-owned data.

**Given** the Privacy and Data section renders
**When** data controls are shown
**Then** I can see entry points for connected sources, source permissions, disconnect, delete imported data, and export
**And** destructive or privacy-critical actions are visually and textually distinct from ordinary navigation.

**Given** no import sources are connected
**When** I open Privacy and Data
**Then** the section explains that no sources are connected
**And** it still provides export/data ownership context where relevant.

**Given** settings are viewed on mobile or desktop
**When** controls render
**Then** touch targets, labels, consequence copy, and focus states remain usable
**And** content does not overlap or hide critical privacy information.

**Given** settings code accesses user data
**When** connected sources or data summaries are queried
**Then** only the authenticated user's records are returned
**And** permission failures do not reveal whether another user's private records exist.

### Story 6.2: Connected Source Permission Details

As an authenticated Lifeline user,
I want to understand what each connected source can access,
So that I can make informed privacy decisions.

**Requirements covered:** FR4, FR9, FR62, FR65, NFR9, NFR20, UX-DR16, UX-DR27, UX-DR28, AR36

**Acceptance Criteria:**

**Given** I have one or more connected import sources
**When** I open connected source settings
**Then** I see each source listed with source name, connection status, last sync/import status, and available management actions.

**Given** I inspect a connected source
**When** permission details are displayed
**Then** I can understand what data Lifeline can access or has imported from that source
**And** the explanation distinguishes future sync access from already imported records.

**Given** a source has an error, expired authorization, or partial failure
**When** I view its details
**Then** I see the relevant status and recovery actions
**And** the copy explains whether authorization, network, source availability, source data, or unknown failure caused the issue when known.

**Given** a source has imported records
**When** I inspect source details
**Then** I can understand whether records are staged, promoted, attached, hidden, discarded, or failed in aggregate
**And** source metadata remains visible enough to support export/delete decisions.

**Given** source permission details render
**When** I use keyboard or screen-reader navigation
**Then** source status, permissions, and actions are reachable and clearly labeled.

### Story 6.3: Disconnect Import Source

As an authenticated Lifeline user,
I want to disconnect an import source,
So that Lifeline stops future access or sync without confusing that action with deleting existing data.

**Requirements covered:** FR5, NFR10, NFR25, UX-DR16, UX-DR28, UX-DR30, AR36

**Acceptance Criteria:**

**Given** I have a connected import source
**When** I choose Disconnect
**Then** I see a confirmation explaining that future sync/access will stop
**And** the copy clearly states whether already imported records will be kept unless I choose deletion separately.

**Given** I confirm disconnect
**When** the action succeeds
**Then** the import source status changes to disconnected
**And** future sync attempts for that source stop.

**Given** I disconnect a source with existing imported records
**When** I return to source settings or import review
**Then** existing imported records remain visible according to their lifecycle state
**And** their source label indicates that the source is disconnected where relevant.

**Given** disconnect fails
**When** the app shows feedback
**Then** the source remains in its previous connection state
**And** I receive a calm recoverable error with retry guidance.

**Given** disconnect is a privacy-critical action
**When** the confirmation dialog opens
**Then** focus is managed safely
**And** primary, cancel, and destructive actions are clearly labeled.

**Given** disconnect code runs server-side
**When** it updates source records
**Then** it verifies authenticated user ownership
**And** it does not affect manually created timeline events.

### Story 6.4: Delete Imported Data

As an authenticated Lifeline user,
I want to delete imported data from a source,
So that I can remove sensitive imported context while preserving manually created timeline content.

**Requirements covered:** FR6, NFR11, NFR36, NFR37, UX-DR16, UX-DR28, UX-DR30, AR8, AR36

**Acceptance Criteria:**

**Given** I have imported data from a source
**When** I choose Delete imported data
**Then** I see a confirmation explaining the affected source and data scope
**And** the copy distinguishes deleting imported records from deleting manual memories, reflections, or future intentions.

**Given** I confirm deletion
**When** the action succeeds
**Then** imported records for the selected scope are deleted or marked deleted according to the lifecycle model
**And** future sync behavior is unchanged unless the source was also disconnected separately.

**Given** imported records were promoted or attached
**When** deletion rules apply
**Then** the app clearly explains what happens to promoted/attached timeline references before confirmation
**And** source metadata/deletion implications remain consistent with export and timeline behavior.

**Given** deletion succeeds
**When** I return to source settings or Import Review
**Then** the deleted imported data no longer appears in normal import review
**And** a clear completion state confirms the action.

**Given** deletion fails
**When** feedback appears
**Then** the app explains what failed and what remains unchanged
**And** no data is falsely shown as deleted.

**Given** delete imported data is implemented
**When** server-side code runs
**Then** it verifies authenticated user ownership
**And** logs avoid storing sensitive imported content.

### Story 6.5: Export Timeline Data

As an authenticated Lifeline user,
I want to export my Lifeline data,
So that I can keep ownership of my memories, reflections, future intentions, and imported context.

**Requirements covered:** FR7, NFR33, NFR34, NFR35, NFR37, UX-DR16, UX-DR28, AR36

**Acceptance Criteria:**

**Given** I open Privacy and Data settings
**When** I choose Export data
**Then** I see an explanation of what the export includes
**And** the copy distinguishes manual content from imported context.

**Given** I request an export
**When** export generation succeeds
**Then** I receive a usable structured export containing manual events, reflections, future intentions, importance values, source references, and imported context metadata
**And** the export is scoped only to my authenticated account.

**Given** the export includes imported context
**When** I inspect exported data
**Then** imported records are distinguishable from manually created content
**And** source metadata and lifecycle state are included where relevant.

**Given** export generation is in progress
**When** the app shows status
**Then** I can understand whether the export is preparing, completed, or failed
**And** the app does not expose private export contents in public routes, metadata, logs, or previews.

**Given** export generation fails
**When** feedback appears
**Then** the app explains the failure calmly
**And** I can retry or use a support path if needed.

**Given** export code runs server-side
**When** it gathers user data
**Then** it verifies authenticated user ownership across timeline, reflections, future intentions, imports, and source records
**And** it avoids including data from other users.
