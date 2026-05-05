---
stepsCompleted:
  - 1
  - 2
  - 3
  - 4
  - 5
  - 6
  - 7
  - 8
inputDocuments:
  - /Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/prd.md
  - /Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/product-brief-lifeline.md
workflowType: "architecture"
project_name: "lifeline"
user_name: "Tuckle"
date: "2026-05-04"
lastStep: 8
status: "complete"
completedAt: "2026-05-04T10:13:04Z"
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**

Lifeline is a greenfield full-stack web app centered on a private, authenticated personal timeline. Architecturally, the MVP needs to support user-scoped data, Google login, manual timeline event creation, approximate dates, photos or photo references, importance weighting, future intentions, search/filtering, review sessions, and import staging.

The most architecture-shaping capability is the distinction between **primary timeline content** and **suggested imported context**. RescueTime and notes data must not automatically become timeline events. The architecture needs separate lifecycle states for imported records: staged, promoted, attached, hidden/discarded, failed, partially synced, and deleted.

Offline drafting is also architecture-significant. Users must be able to create or edit mandatory event fields while temporarily offline, see sync state, and resolve failed or conflicting syncs.

**Non-Functional Requirements:**

The key NFR drivers are privacy, data integrity, import reliability, and timeline performance. Lifeline handles deeply personal memories, notes, reflections, activity data, and photo references, so private user isolation, encryption, explicit import permissions, deletion, disconnect, export, and log hygiene must shape the architecture from the start.

Timeline browsing must remain smooth for at least 1,000 combined events and imported context records, with incremental loading and non-blocking import processing. Manual event creation and reflection workflows must remain usable even while imports are running or failing.

**Scale & Complexity:**

- Primary domain: private full-stack web app with personal data imports
- Complexity level: medium
- Estimated architectural components: 9-11 major components

The likely component set includes authentication, user profile/workspace, timeline data model, event/reflection service, import connector layer, import staging/curation model, offline draft/sync handling, media/photo reference handling, export/delete subsystem, search/filtering, and responsive web UI.

### Technical Constraints & Dependencies

Known constraints and dependencies:

- Google login is required from day one.
- Timeline content is private and user-scoped.
- Desktop and mobile web are both required for MVP.
- SEO is not required for MVP because meaningful product content is authenticated and private.
- RescueTime import is MVP scope.
- Notes import from Notion or Google Keep-style sources is MVP scope.
- Social media imports are explicitly post-MVP.
- Offline support is scoped to mandatory manual event fields and draft sync, not full offline media/import support.
- The product must avoid clinical, diagnostic, treatment, therapist-workflow, or AI therapist positioning.
- Imports must preserve source metadata, timestamps, sync status, and user-curation state.
- Users must be able to disconnect sources, delete imported data, export timeline data, and distinguish manual content from imported context.

### Cross-Cutting Concerns Identified

- **Privacy and access control:** every data model and endpoint must enforce authenticated owner access.
- **Data lifecycle and deletion:** manual events, imported context, source connections, hidden items, staged items, promoted items, exports, and deleted records need consistent lifecycle rules.
- **Import curation:** imported data must flow into staging before becoming user-visible timeline meaning.
- **Data integrity:** timeline entries, offline drafts, reflections, importance values, source metadata, and promoted imports must survive refresh, reconnect, and sync flows.
- **Offline sync:** draft creation/editing needs local persistence, sync state, conflict handling, and recovery paths.
- **Timeline performance:** long timelines need incremental loading, efficient querying, and likely UI virtualization.
- **Emotional safety:** architecture should support hide/edit/delete, non-forced interpretation, and exits from review sessions.
- **Data portability:** export format should preserve source distinctions and be planned alongside the data model.
- **Integration failure handling:** partial import failures, retries, reconnects, deduplication, and source disconnect behavior need first-class modeling.
- **Responsive UI support:** the same domain capabilities must work across desktop and mobile web with different interaction density.

## Starter Template Evaluation

### Primary Technology Domain

Lifeline is a full-stack TypeScript web app. The starter should support authenticated private data, server-side routes/actions, responsive React UI, database-backed user content, import workflows, and deployment without heavy infrastructure setup.

### Starter Options Considered

**Next.js default starter**

The current Next.js docs recommend `create-next-app`, with defaults including TypeScript, Tailwind CSS, ESLint, App Router, Turbopack, and import alias support. This is a strong frontend foundation, but it does not provide authentication, database, storage, or row-level privacy patterns by itself.

**Supabase Next.js starter**

The Supabase Next.js quickstart provides a `with-supabase` template preconfigured for cookie-based auth, TypeScript, and Tailwind CSS. Supabase also provides Auth, Google OAuth support, Postgres, Row Level Security, Storage, and server/client patterns that fit Lifeline's private user-scoped data needs.

This is the strongest MVP fit because Lifeline needs Google login, private timeline data, source-scoped imports, export/delete controls, and eventual photo/reference storage. Supabase's Postgres + RLS model maps naturally to "users can only access their own timeline."

**Create T3 App**

Create T3 App is a strong modular starter for type-safe Next.js apps, with options such as NextAuth, Tailwind, Drizzle, Prisma, and PostgreSQL. It is attractive if we want a more explicitly type-safe app architecture with tRPC. For Lifeline's MVP, it adds choices we do not yet need and does not give us the same direct RLS-backed privacy model out of the box.

**Vite / React SPA**

Vite is excellent for frontend-only apps, but Lifeline is not frontend-only. It needs auth, private data, imports, export/delete flows, and backend jobs. A Vite SPA would require more custom backend architecture from the start.

### Selected Starter: Next.js with Supabase Starter

**Rationale for Selection:**

Use the official Supabase Next.js starter as the foundation. It gives Lifeline the cleanest path to Google login, authenticated user-scoped data, Postgres modeling, RLS privacy, file/photo storage options, and server-side import workflows while preserving a modern React/Next.js development experience.

**Initialization Command:**

```bash
npx create-next-app@latest --example with-supabase lifeline
```

### Architectural Decisions Provided by Starter

**Language & Runtime:**

- TypeScript-first Next.js app.
- React-based web UI.
- Next.js App Router foundation.
- Server/client boundaries compatible with authenticated private data.

**Styling Solution:**

- Tailwind CSS baseline from the Supabase starter.
- Suitable for responsive desktop/mobile layouts.
- Compatible with shadcn/ui-style accessible primitives and Lifeline-specific design tokens.

**Build Tooling:**

- Next.js build pipeline.
- Turbopack-enabled development path through current Next.js defaults.
- Vercel-compatible deployment path if desired.

**Authentication & Data Foundation:**

- Supabase Auth with cookie-based auth patterns.
- Google login can be configured through Supabase Auth provider settings.
- Supabase Postgres for timeline, event, import, reflection, and source metadata.
- Row Level Security should be mandatory on user-owned tables.

**Code Organization:**

- Next.js route/app structure.
- Supabase client/server utilities from the starter.
- Architecture should add explicit domain folders for timeline, imports, reflections, export/delete, and offline draft sync.

**Development Experience:**

- Hot reload local development.
- TypeScript support.
- Tailwind styling loop.
- Clear path to add database migrations, RLS policies, tests, and import job structure.

**Note:** Project initialization using this command should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions:**

- Next.js + TypeScript + App Router for the web app.
- Supabase Auth with Google OAuth for login.
- Supabase Postgres as the primary database.
- Supabase Row Level Security for user-owned private data.
- Supabase Storage for private photo/file storage when needed.
- Server-side import processing through Next.js server routes/actions initially.
- Staged import records separate from primary timeline events.
- Offline drafts stored client-side first, then synced to server.

**Important Decisions:**

- Zod or equivalent schema validation at form/action boundaries.
- Server-first data access for sensitive mutations.
- Client-side state kept local/route-scoped unless a feature needs shared state.
- Timeline query model optimized for date ranges, importance, source, and review sessions.
- Export/delete designed around the same data lifecycle as the core model.

**Deferred Decisions:**

- AI summaries and pattern detection.
- Social media imports.
- Admin/support console.
- Dedicated background worker infrastructure beyond MVP.
- Public landing/SEO architecture.

### Data Architecture

Use Supabase Postgres as the system of record. Model manual timeline content separately from imported suggested context.

Core data families:

- Users/profile/workspace metadata
- Timeline events
- Future intentions
- Reflections/review summaries
- Media/photo references
- Import sources/connections
- Imported staged records
- Import sync attempts/statuses
- Export/delete requests or audit records

All user-owned tables should use RLS policies scoped to the authenticated user. Imported records need lifecycle states such as `staged`, `promoted`, `attached`, `hidden`, `discarded`, `failed`, and `deleted`.

### Authentication & Security

Use Supabase Auth with Google OAuth. Authenticated user identity should be the root ownership key for timeline data.

Security defaults:

- RLS enabled on all exposed user-owned tables.
- Server-side operations for sensitive mutations, exports, imports, and deletes.
- No public access to private timeline content.
- Import tokens/secrets kept server-side.
- Logs and analytics must not store sensitive notes, reflections, or imported content.

### API & Communication Patterns

Use Next.js server actions/routes for app-owned mutations and integration flows. Direct client reads can be allowed only where RLS policies make the access safe and simple.

API patterns:

- Domain-oriented server modules for timeline, imports, review, export/delete, and settings.
- Consistent typed result/error shape.
- Import retries and partial failures modeled explicitly.
- Rate limiting considered for import/connect/retry endpoints.
- No GraphQL/tRPC for MVP unless we later decide type-safe API ergonomics are worth the added layer.

### Frontend Architecture

Use React/Next.js with Tailwind. Keep UI state close to the route/component unless it needs cross-flow persistence.

Frontend patterns:

- Use Tailwind CSS plus shadcn/ui-style primitives as the MVP UI foundation, customized through Lifeline design tokens.
- Timeline UI should use incremental loading or virtualization.
- Import staging should be a distinct UI flow from primary timeline browsing.
- Offline drafts should use local browser storage with visible sync state.
- Desktop should prioritize rich review/curation; mobile should prioritize capture and mandatory edits.
- Target WCAG 2.2 AA for MVP UI implementation, including contrast, keyboard focus/navigation, semantic HTML, accessible icon labels, practical 44px touch targets, reduced-motion support, focus management, and readable long-form text.

### Infrastructure & Deployment

Use Supabase Cloud for auth, database, RLS, and storage. Use Vercel for Next.js hosting unless a different deployment target is selected later.

MVP infrastructure:

- Supabase project with SQL migrations and RLS policies.
- Environment-separated config for local/staging/prod.
- Vercel deployment for web app.
- Scheduled/manual import execution can begin inside the app/backend layer before introducing separate workers.
- Monitoring/logging should track errors and import failures without capturing sensitive content.

### Decision Impact Analysis

**Implementation Sequence:**

1. Initialize Supabase Next.js starter.
2. Configure Google Auth.
3. Define database schema and RLS policies.
4. Build manual timeline/event/future-intention model.
5. Add import source and staged import model.
6. Add RescueTime/notes import flows.
7. Add offline draft persistence/sync.
8. Add export/delete controls.
9. Optimize timeline loading and review flows.

**Cross-Component Dependencies:**

- RLS policies depend on the user ownership model.
- Timeline performance depends on date/index/query design.
- Import staging depends on source metadata and lifecycle states.
- Export/delete depends on distinguishing manual content from imported context.
- Offline sync depends on event identity, draft identity, and conflict rules.
- Emotional safety depends on edit/hide/delete capabilities being built into the core model, not added later.

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:** 9 areas where AI agents could make different choices:

1. Database table and column naming
2. Route and API naming
3. Domain folder organization
4. Supabase client/server access patterns
5. Validation and error shape
6. Import lifecycle states
7. Date/time representation
8. Offline draft sync states
9. Timeline item identity and ownership

### Naming Patterns

**Database Naming Conventions:**

- Tables use plural `snake_case`: `timeline_events`, `future_intentions`, `import_sources`, `import_records`, `review_sessions`.
- Columns use `snake_case`: `user_id`, `source_id`, `created_at`, `updated_at`, `occurred_on`, `approximate_date_label`.
- Primary keys use `id`.
- Foreign keys use `{table_singular}_id`: `event_id`, `source_id`, `record_id`.
- Timestamps use `_at` for instants and `_on` for calendar dates.
- Status fields use explicit names: `sync_status`, `lifecycle_state`, `visibility_state`.

**API Naming Conventions:**

- Authenticated MVP app routes use fixed kebab-case path segments: `/timeline`, `/add`, `/imports`, `/reflect`, `/search`, and `/settings`.
- Source-management and deep-link routes may be nested under the primary app routes when needed, such as `/settings/import-sources` or `/reflect/sessions/[id]`.
- Route groups should separate authenticated app areas from auth/callback routes.
- Server actions and route handlers should use domain verbs: `createTimelineEvent`, `promoteImportRecord`, `disconnectImportSource`.
- Query params use camelCase in app code and URLs: `dateFrom`, `dateTo`, `sourceId`, `importance`.

**Code Naming Conventions:**

- React components use PascalCase: `TimelineView`, `ImportRecordCard`.
- Component files use PascalCase when exporting one component: `TimelineView.tsx`.
- Domain utilities and server modules use kebab-case files: `timeline-events.ts`, `import-records.ts`.
- TypeScript variables/functions use camelCase.
- Type names use PascalCase: `TimelineEvent`, `ImportRecordLifecycleState`.

### Structure Patterns

**Project Organization:**

- Use feature/domain organization rather than generic layer-only folders.
- Domain code should live under clear domains: `timeline`, `imports`, `reviews`, `settings`, `auth`, `offline`.
- The `/reflect` route uses `src/features/reviews/` domain code; "Reflect" is the user-facing navigation label, while "reviews" remains the implementation domain for review sessions, summaries, and insights.
- Shared UI primitives go in `src/components/ui/` and should follow the Tailwind plus shadcn/ui-style foundation; domain-specific components stay with their domain.
- Supabase clients must be split by runtime: browser client, server client, and privileged server/admin client where needed.
- Tests should be co-located for domain logic when practical: `timeline-events.test.ts`, `import-records.test.ts`.

**File Structure Patterns:**

- Database migrations live in Supabase migration files, not ad hoc SQL snippets in app code.
- RLS policies live alongside schema migrations.
- Environment variables are documented in `.env.example`.
- Server-only integration code must not be imported into client components.
- Sensitive source tokens and secrets must never be exposed through `NEXT_PUBLIC_*`.

### Format Patterns

**API Response Formats:**

Use a consistent action result shape for app-owned mutations:

```ts
type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: string; message: string; field?: string } };
```

Error codes should be stable machine-readable strings, such as `import_auth_failed`, `timeline_event_not_found`, `offline_conflict`, `permission_denied`.

**Data Exchange Formats:**

- JSON fields returned to client code use camelCase.
- Database fields remain snake_case.
- Mapping between database rows and client models should happen in domain modules.
- Dates/times crossing API boundaries use ISO 8601 strings.
- Calendar-only life dates use date strings plus approximate-date metadata when needed.
- Null means intentionally absent; undefined should not be persisted.

### Communication Patterns

**Event/System State Patterns:**

Use explicit lifecycle states rather than inferred booleans.

Import record lifecycle states:

- `staged`
- `promoted`
- `attached`
- `hidden`
- `discarded`
- `deleted`

Import sync statuses:

- `pending`
- `syncing`
- `succeeded`
- `partial_failure`
- `failed`

Offline draft sync statuses:

- `local_only`
- `syncing`
- `synced`
- `conflict`
- `failed`

**State Management Patterns:**

- Server data should be read through server components/actions where practical.
- Client state should be local unless shared across a workflow.
- Import curation state should not be merged with primary timeline state until the user promotes or attaches a record.
- Optimistic UI is allowed for manual drafts but must show sync state and recovery options.

### Process Patterns

**Error Handling Patterns:**

- User-facing errors should be calm, specific, and action-oriented.
- Logs should capture error codes and technical context, not sensitive timeline/reflection/note content.
- Import errors must distinguish authorization, network, source availability, source data, and unknown failures when known.
- Permission failures should never reveal whether another user's private record exists.

**Loading State Patterns:**

- Timeline loading should support partial rendering rather than blocking the whole page.
- Import jobs should show source-level status and record-level status where relevant.
- Offline drafts should show local/sync/conflict state.
- Empty states must distinguish "no data yet" from "data failed to load."

### Enforcement Guidelines

**All AI Agents MUST:**

- Use Supabase RLS-backed user ownership for user-owned data.
- Keep imported records separate from primary timeline events until explicit user action.
- Preserve source metadata on every imported record.
- Use the shared `ActionResult<T>` shape for app-owned mutations.
- Use snake_case in database schema and camelCase in TypeScript client models.
- Avoid storing sensitive timeline, note, reflection, or imported content in logs.
- Keep server-only integration code out of client components.
- Include delete/export implications when adding new user-owned data types.
- Update lifecycle states explicitly instead of adding ad hoc boolean flags.

**Pattern Enforcement:**

- Schema changes must include table naming, ownership, RLS, lifecycle, export, and deletion considerations.
- New server actions must return the shared result shape.
- New import features must define source metadata, staging behavior, retry behavior, and disconnect/delete behavior.
- New timeline features must define date semantics, visibility behavior, and review-session implications.
- Pattern violations should be corrected before story completion.

### Pattern Examples

**Good Examples:**

- `timeline_events.occurred_on` for a calendar date.
- `import_records.lifecycle_state = 'staged'` before user curation.
- `promoteImportRecord(recordId)` returning `ActionResult<TimelineEvent>`.
- `sourceMetadata` preserved when an imported note is attached to an existing event.
- `offlineDraft.syncStatus = 'conflict'` when local and server versions diverge.

**Anti-Patterns:**

- Creating imported RescueTime rows directly as timeline events.
- Adding `is_deleted`, `is_hidden`, `is_promoted`, and `is_attached` booleans instead of a lifecycle state.
- Returning raw Supabase errors directly to the UI.
- Using `NEXT_PUBLIC_*` for import tokens or private source secrets.
- Logging note content, reflection text, or imported activity details.
- Building one-off timeline filters that bypass the shared query/date model.

## Project Structure & Boundaries

### Complete Project Directory Structure

```text
lifeline/
├── README.md
├── package.json
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── postcss.config.mjs
├── tailwind.config.ts
├── middleware.ts
├── .env.example
├── .gitignore
├── .github/
│   └── workflows/
│       └── ci.yml
├── docs/
│   ├── architecture.md
│   └── decisions/
├── public/
│   └── assets/
├── supabase/
│   ├── config.toml
│   ├── migrations/
│   │   ├── 0001_initial_schema.sql
│   │   ├── 0002_rls_policies.sql
│   │   └── 0003_storage_policies.sql
│   └── seed.sql
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── auth/
│   │   │   └── callback/
│   │   │       └── route.ts
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── (app)/
│   │   │   ├── layout.tsx
│   │   │   ├── timeline/
│   │   │   │   └── page.tsx
│   │   │   ├── add/
│   │   │   │   └── page.tsx
│   │   │   ├── imports/
│   │   │   │   └── page.tsx
│   │   │   ├── reflect/
│   │   │   │   └── page.tsx
│   │   │   ├── search/
│   │   │   │   └── page.tsx
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   └── api/
│   │       ├── imports/
│   │       │   ├── rescuetime/
│   │       │   │   ├── connect/
│   │       │   │   │   └── route.ts
│   │       │   │   ├── callback/
│   │       │   │   │   └── route.ts
│   │       │   │   └── sync/
│   │       │   │       └── route.ts
│   │       │   └── notes/
│   │       │       ├── connect/
│   │       │       │   └── route.ts
│   │       │       └── sync/
│   │       │           └── route.ts
│   │       └── export/
│   │           └── route.ts
│   ├── components/
│   │   ├── ui/
│   │   └── layout/
│   ├── features/
│   │   ├── timeline/
│   │   │   ├── components/
│   │   │   ├── actions.ts
│   │   │   ├── queries.ts
│   │   │   ├── schemas.ts
│   │   │   ├── types.ts
│   │   │   └── timeline-events.test.ts
│   │   ├── imports/
│   │   │   ├── components/
│   │   │   ├── rescuetime/
│   │   │   ├── notes/
│   │   │   ├── actions.ts
│   │   │   ├── queries.ts
│   │   │   ├── schemas.ts
│   │   │   ├── types.ts
│   │   │   └── import-records.test.ts
│   │   ├── reviews/
│   │   │   ├── components/
│   │   │   ├── actions.ts
│   │   │   ├── queries.ts
│   │   │   ├── schemas.ts
│   │   │   └── types.ts
│   │   ├── offline/
│   │   │   ├── offline-drafts.ts
│   │   │   ├── sync.ts
│   │   │   ├── schemas.ts
│   │   │   └── offline-drafts.test.ts
│   │   └── settings/
│   │       ├── components/
│   │       ├── actions.ts
│   │       ├── export.ts
│   │       └── delete-data.ts
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── admin.ts
│   │   ├── action-result.ts
│   │   ├── dates.ts
│   │   ├── errors.ts
│   │   ├── logger.ts
│   │   └── utils.ts
│   ├── styles/
│   └── types/
│       └── database.ts
├── tests/
│   ├── e2e/
│   │   ├── auth.spec.ts
│   │   ├── timeline.spec.ts
│   │   ├── imports.spec.ts
│   │   └── privacy.spec.ts
│   └── fixtures/
└── playwright.config.ts
```

### Architectural Boundaries

**API Boundaries:**

- `src/app/api/imports/**` handles external import authorization, callbacks, sync, retry, and source-specific failures.
- `src/app/api/export/route.ts` handles export generation.
- Feature server actions handle app-owned mutations for timeline, imports, reviews, offline drafts, and settings.
- Sensitive operations must run server-side and enforce authenticated user ownership.

**Component Boundaries:**

- `src/components/ui/` contains reusable UI primitives only, implemented with Tailwind plus shadcn/ui-style component patterns and Lifeline tokens.
- `src/components/layout/` contains shell/navigation/layout components.
- `src/features/*/components/` contains domain-specific UI.
- Timeline UI must not directly mutate imports; it calls domain actions.
- Import staging UI must not directly create primary events except through `promoteImportRecord` or attach actions.

**Service Boundaries:**

- Timeline domain owns manual events, future intentions, importance, visibility, and timeline queries.
- Imports domain owns source connections, imported records, sync attempts, staging, promotion, attachment, discard/hide, and disconnect/delete behavior.
- Reviews domain owns self-review sessions, summaries, and insights.
- Offline domain owns local drafts, sync state, conflict state, and retry behavior.
- Settings domain owns source management, export, delete, and user-facing privacy controls.

**Data Boundaries:**

- Supabase Postgres is the system of record.
- RLS policies enforce user ownership for every user-owned table.
- Supabase Storage stores private photo/file objects when file storage is needed.
- Client-side offline draft storage is temporary and must sync into server-owned records.
- Import tokens/secrets and privileged operations stay server-side.

### Requirements to Structure Mapping

**User Accounts & Privacy:**

- `src/app/login/`
- `src/app/auth/callback/`
- `src/lib/supabase/`
- `src/features/settings/`
- `supabase/migrations/*rls*`

**Timeline & Event Management:**

- `src/app/(app)/timeline/`
- `src/features/timeline/`
- `supabase/migrations/0001_initial_schema.sql`

**Timeline Discovery & Review:**

- `src/features/timeline/queries.ts`
- `src/features/reviews/`
- `src/app/(app)/reflect/`
- `src/app/(app)/search/`

**Imports & Suggested Context:**

- `src/app/(app)/imports/`
- `src/app/api/imports/`
- `src/features/imports/`
- `supabase/migrations/0001_initial_schema.sql`

**Offline Drafting & Sync:**

- `src/features/offline/`
- Timeline action integration points
- E2E tests for offline draft creation and sync recovery

**Emotional Safety & Product Boundaries:**

- `src/features/timeline/`
- `src/features/reviews/`
- `src/features/settings/delete-data.ts`
- Product copy inside relevant route/components

**Responsive Web Experience:**

- `src/app/(app)/`
- `src/components/ui/`
- `src/components/layout/`
- `src/features/*/components/`

**Support & Troubleshooting:**

- `src/features/imports/`
- `src/features/settings/`
- `src/lib/errors.ts`
- `src/lib/logger.ts`

### Integration Points

**Internal Communication:**

- Pages call feature components and server actions.
- Feature modules expose typed actions, queries, schemas, and types.
- Shared utilities live in `src/lib/`.
- Server actions return `ActionResult<T>`.

**External Integrations:**

- Supabase Auth handles Google login.
- Supabase Postgres stores user-owned data.
- Supabase Storage stores private photos/files.
- RescueTime connector lives in `src/features/imports/rescuetime/` and API routes under `src/app/api/imports/rescuetime/`.
- Notes connector lives in `src/features/imports/notes/` and API routes under `src/app/api/imports/notes/`.

**Data Flow:**

1. User signs in through Supabase Auth.
2. User creates timeline events through timeline actions.
3. Import source is connected through API route.
4. Import sync creates staged `import_records`.
5. User reviews staged records.
6. User promotes, attaches, hides, discards, or deletes imported records.
7. Timeline queries combine primary events, future intentions, and promoted/attached context.
8. Export/delete flows traverse the same ownership and lifecycle model.

### File Organization Patterns

**Configuration Files:**

- Root config files stay at project root.
- Supabase config/migrations live under `supabase/`.
- Environment examples live in `.env.example`; local secrets stay in `.env.local`.

**Source Organization:**

- App routes live under `src/app/`.
- Domain code lives under `src/features/`.
- Shared primitives live under `src/components/ui/`.
- Shared runtime utilities live under `src/lib/`.

**Test Organization:**

- Unit tests are co-located with domain modules when practical.
- E2E tests live under `tests/e2e/`.
- Fixtures live under `tests/fixtures/`.

**Asset Organization:**

- Static public assets live under `public/assets/`.
- User-uploaded private assets live in Supabase Storage, not in `public/`.

### Development Workflow Integration

**Development Server Structure:**

- Next.js development server runs the app.
- Supabase local/dev project provides auth, database, storage, and RLS.
- Feature modules are independently testable.

**Build Process Structure:**

- Next.js builds web app routes and server code.
- TypeScript checks shared types and feature modules.
- Tests validate domain logic, RLS-sensitive flows, and core user journeys.

**Deployment Structure:**

- Vercel hosts the Next.js app.
- Supabase hosts auth, database, storage, and RLS policies.
- Environment variables connect deployed app to the correct Supabase project.
- Import routes execute in the app/backend layer until a separate worker is justified.

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**

The selected architecture is internally consistent. Next.js, TypeScript, Supabase Auth, Supabase Postgres, Supabase RLS, Supabase Storage, Tailwind, and Vercel fit the PRD's full-stack web app requirements. The starter choice supports the authentication, private data, server/client boundary, and deployment assumptions made in the core decisions.

The major architectural decisions align with the MVP constraints: Google login, private user-scoped data, desktop/mobile web, RescueTime and notes imports, staged import curation, offline event drafts, export/delete controls, and no public SEO dependency.

**Pattern Consistency:**

The implementation patterns support the decisions. Database naming, RLS ownership, import lifecycle states, `ActionResult<T>`, server-only import code, and snake_case database/camelCase TypeScript conventions all reduce likely AI-agent conflicts.

**Structure Alignment:**

The project structure supports the architecture. `src/features/` maps to product domains, `src/app/` handles routes and API boundaries, `src/lib/supabase/` separates runtime clients, and `supabase/migrations/` gives schema/RLS policies a clear home.

### Requirements Coverage Validation ✅

**Feature Coverage:**

All major PRD feature areas have architectural support: user accounts, privacy, manual timeline events, approximate dates, reflections, future intentions, imports, staged context, offline drafts, responsive web, export/delete, and troubleshooting.

**Functional Requirements Coverage:**

All FR categories are mapped to structure and boundaries:

- User accounts and privacy → Supabase Auth, RLS, settings, export/delete.
- Timeline and event management → timeline domain and schema.
- Timeline discovery and review → timeline queries and reviews domain.
- Imports and suggested context → imports domain, API routes, lifecycle states.
- Offline drafting and sync → offline domain and sync states.
- Emotional safety → edit/hide/delete, review exits, product-boundary requirements.
- Responsive web → Next.js routes, feature components, Tailwind.
- Support/troubleshooting → errors, logger, import status, settings.

**Non-Functional Requirements Coverage:**

NFRs are addressed architecturally:

- Performance → incremental loading/virtualization, date/index-aware queries.
- Security/privacy → auth, RLS, server-side sensitive operations, log hygiene.
- Reliability/data integrity → lifecycle states, sync states, migrations, backups/recoverability to be handled in implementation.
- Integration quality → source metadata, staged records, sync attempts, retry/reconnect paths.
- Accessibility → WCAG 2.2 AA target preserved in frontend patterns.
- Data portability → export/delete subsystem and manual/imported source distinction.

### Implementation Readiness Validation ✅

**Decision Completeness:**

Critical implementation blockers are resolved: starter, stack, auth, database, RLS, storage, import staging, offline draft approach, API/action patterns, deployment direction, naming conventions, and project structure.

**Structure Completeness:**

The structure is specific enough for AI agents to place files consistently. It defines routes, domains, Supabase migrations, tests, import connectors, offline sync, settings/export/delete, and shared utilities.

**Pattern Completeness:**

The architecture defines patterns for naming, data formats, error results, lifecycle states, loading states, import states, offline sync states, and enforcement rules. These are sufficient to prevent most multi-agent implementation drift.

### Gap Analysis Results

**Critical Gaps:** None.

**Important Gaps:**

- Source-specific import specs still need to be created during implementation for RescueTime and notes sources.
- Database schema and RLS policy details need to be written as implementation artifacts.
- Export format should be specified before export implementation begins.
- Offline conflict resolution UX should be clarified in UX/design work before detailed build-out.

**Nice-to-Have Gaps:**

- A future ADR could document whether import processing should move to dedicated workers after MVP.
- A future ADR could document whether AI-assisted summaries enter the architecture post-MVP.
- A future monitoring plan could define concrete error dashboards and alert thresholds.

### Validation Issues Addressed

No blocking issues were found. The architecture intentionally keeps background workers, AI summaries, social imports, admin console, and public SEO out of the MVP to protect founder-use validation and reduce early complexity.

### Architecture Completeness Checklist

**Requirements Analysis**

- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**Architectural Decisions**

- [x] Critical decisions documented with versions/current sources checked
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**Implementation Patterns**

- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**Project Structure**

- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION
**Confidence Level:** High

**Key Strengths:**

- Strong privacy-first data foundation with Supabase Auth, Postgres, and RLS.
- Clear separation between primary timeline content and staged imported context.
- Explicit lifecycle states for imports and offline drafts.
- Project structure maps directly to PRD functional areas.
- Patterns are concrete enough for AI agents to implement consistently.

**Areas for Future Enhancement:**

- Dedicated worker architecture for imports if sync complexity grows.
- More formal observability plan after the MVP import paths exist.
- Post-MVP social import architecture.
- Post-MVP AI summary/pattern architecture.
- Deeper UX specification for emotional safety and offline conflict resolution.

### Implementation Handoff

**AI Agent Guidelines:**

- Follow all architectural decisions exactly as documented.
- Use implementation patterns consistently across all components.
- Respect project structure and domain boundaries.
- Refer to this document for naming, lifecycle, API, data, and folder decisions.
- Do not bypass RLS or merge imported data directly into primary timeline events.
- Do not add social imports, AI therapist behavior, admin console, or worker infrastructure unless a later story explicitly scopes it.

**First Implementation Priority:**

Initialize the project with:

```bash
npx create-next-app@latest --example with-supabase lifeline
```

Then configure Google Auth, define the initial Supabase schema/RLS policies, and build the manual timeline/event foundation before import connectors.
