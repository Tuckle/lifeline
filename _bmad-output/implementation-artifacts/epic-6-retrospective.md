# Epic 6 Retrospective: Privacy, Source Management, Export & Deletion

Status: done
Date: 2026-05-06

## Epic Review

Epic 6 completed the MVP privacy and ownership surface for Lifeline. Authenticated users can now understand connected source permissions, distinguish future access from already imported records, disconnect sources, delete imported data, and export a structured copy of their Lifeline data without exposing private content through public routes.

The strongest product outcome is that privacy-critical controls now live in one understandable Settings area with calm consequence copy. The implementation also preserved the product's core promise: manual memories, reflections, and future intentions remain distinct from imported context, so users can control sensitive source data without accidentally losing authored life content.

## What Went Well

- The epic layered naturally from visibility to action: Privacy and Data settings, source permission details, disconnect, delete imported data, then export.
- Existing import-source recovery behavior was reused and hardened for disconnect instead of creating a competing source-management path.
- Server-side actions consistently scoped privacy work to the authenticated user and avoided public export URLs, metadata exposure, or sensitive logs.
- Each story extended the validation script alongside the implementation, which kept acceptance criteria visible during the full epic.
- The UX copy stayed aligned with the product tone: clear, non-alarming, and explicit about what changes and what remains unchanged.

## Challenges And Risks

- `PrivacyDataSection` now carries summary rendering, permission detail disclosure, disconnect controls, imported-data deletion, and export state. It is cohesive for MVP, but large enough to deserve a follow-up split.
- Imported-data deletion currently performs related mutations across imported records and promoted timeline events. The behavior is owner-scoped and validated, but a transaction or RPC would make consistency stronger if one mutation succeeds and another fails.
- Export returns a complete JSON payload through the server-action response for local download. That is suitable for MVP data volume, but larger real timelines will need size limits, streaming, or a background export strategy.
- Validation relies partly on static snippet checks. This caught important regressions, but it is brittle when code is reorganized or copy wraps differently.
- The newer privacy actions use explicit user ownership checks. A broader audit should confirm older import actions follow the same standard rather than relying only on RLS.

## Decisions To Carry Forward

- Keep destructive and privacy-critical actions separated from ordinary navigation with clear confirmation states and consequence copy.
- Preserve manual/imported distinctions in every data operation, export shape, and timeline behavior.
- Prefer authenticated server actions for private Settings operations unless a future architecture requires a dedicated private API.
- Continue pairing feature implementation with focused validation updates so acceptance criteria remain executable.
- Treat source disconnection and imported-data deletion as separate user intents; do not blur future access control with existing data removal.

## Action Items

1. Split `src/features/settings/components/privacy-data-section.tsx` into smaller controls for source details, disconnect, imported-data deletion, and export.
2. Add focused tests for ownership boundaries across disconnect, delete imported data, and export.
3. Design a transaction, RPC, or compensating consistency path for imported-data deletion and promoted imported timeline events.
4. Audit import and Settings actions for explicit `user_id` scoping in addition to RLS.
5. Define post-MVP export scaling behavior for large timelines, including payload limits and user-facing status.

## Next Epic Preparation

No Epic 7 is currently defined in the planning artifacts, and all MVP implementation epics are marked done. The next BMAD preparation step should shift from feature delivery to MVP hardening and release readiness.

Recommended next work:

1. Run an end-to-end acceptance pass against the PRD and epics.
2. Validate Supabase RLS and ownership behavior with realistic multi-user scenarios.
3. Create realistic seed or demo data for timeline memories, imported context, reflection sessions, and future intentions.
4. Perform a browser UX pass across mobile and desktop for the Atlas-style timeline, reflection flows, imports, offline drafts, and Settings privacy controls.
5. Review deployment configuration, environment variables, auth redirects, and production logging boundaries.

## Sprint Status Update

Epic 6 retrospective is complete. All MVP epics and implementation stories are now done in the sprint tracker.
