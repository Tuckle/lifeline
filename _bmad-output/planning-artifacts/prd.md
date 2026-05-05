---
stepsCompleted:
  - step-01-init
  - step-02-discovery
  - step-02b-vision
  - step-02c-executive-summary
  - step-03-success
  - step-04-journeys
  - step-05-domain
  - step-06-innovation
  - step-07-project-type
  - step-08-scoping
  - step-09-functional
  - step-10-nonfunctional
  - step-11-polish
  - step-12-complete
inputDocuments:
  - /Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/product-brief-lifeline.md
documentCounts:
  productBriefs: 1
  research: 0
  brainstorming: 0
  projectDocs: 0
  projectContext: 0
workflowType: "prd"
classification:
  projectType: "web_app"
  domain: "general / personal growth and self-reflection"
  complexity: "low-to-medium"
  projectContext: "greenfield"
releaseMode: "phased"
completedAt: "2026-05-04T09:31:04Z"
---

# Product Requirements Document - Lifeline

**Author:** Tuckle
**Date:** 2026-05-01

## Executive Summary

Lifeline is a private web app for visualizing, understanding, and reflecting on a person's life as one continuous vertical timeline. The past scrolls upward, the future extends downward, and the user can place memories, photos, notes, major events, imported activity data, and future intentions on the same life line. The product is designed for therapy-adjacent self-reflection and personal growth users who want to understand their patterns, preserve meaningful memories, and build a clearer relationship with both their past and future.

The core problem Lifeline solves is fragmentation of personal history. A person's life evidence is scattered across journals, photos, social posts, productivity tools, notes apps, memory, and reflection documents. Existing tools capture pieces of this history, but they rarely connect what happened, what the person was doing, what they were thinking, and why it mattered. Lifeline turns these scattered records into a curated autobiographical interface where users can identify patterns, mark turning points, and revisit important periods with context.

The MVP should prioritize a private, emotionally safe life timeline that supports manual event creation, photo/story attachment, event importance weighting, future intentions, RescueTime imports, and notes imports from Notion or Google Keep-style sources. Imported data should enter as suggested context that users can review and promote into meaningful timeline items, preventing the product from becoming a raw data dump. The first product experience should make users feel: "I can finally see what happened, what it meant, and where I want to go next."

### What Makes This Special

Lifeline is not primarily a journal, analytics dashboard, social archive, or therapy tool. Its differentiator is the combination of authored memories, imported digital traces, importance weighting, and future orientation in one private life visualization. The product's core insight is that users do not only need to record life events; they need to understand the relationships between events, habits, memories, notes, and identity over time.

Users will choose Lifeline over adjacent tools because it makes personal history navigable and meaningful. Journaling apps help users write entries. Productivity tools show behavior. Social platforms preserve public-facing fragments. Lifeline uses all of these as source material for a deeper reflective experience: seeing the shape of one's life, recognizing recurring patterns, remembering what mattered, and connecting reflection to future intention.

## Project Classification

Lifeline is a greenfield `web_app` in the personal growth and self-reflection domain. Domain complexity is low-to-medium: the product is not healthcare by default, but it handles sensitive personal data and therapy-adjacent use cases, so privacy, trust, emotional safety, data import controls, export, deletion, and clear product boundaries are central requirements. The MVP should avoid clinical claims, diagnosis, therapist workflows, or AI therapist positioning unless the product strategy changes.

## Success Criteria

### User Success

Lifeline succeeds for its first users when it becomes a private reflection tool they return to for pattern recognition and self-review, not merely a place to store memories. The MVP should help a user build a coherent personal timeline, revisit important periods, connect events with behavioral context from imports, and leave a reflection session with clearer insight into what happened, what repeated, and what they want to do next.

The primary user success moment is: "I can see a meaningful pattern in my life that was previously scattered across memory, notes, activity data, and photos." A successful session should help the user understand a period of life, identify a recurring behavior or turning point, or prepare for a personal review or therapy-adjacent reflection session.

### Business Success

Initial business success is personal-utility validation rather than scale. The first milestone is that Lifeline becomes a useful tool for the founder's own reflection workflow. After that, early beta success means at least 10 users create complete enough timelines to support meaningful self-review.

A "complete timeline" for beta purposes should mean a user has added enough dated events, memories, reflections, photos, and/or imported context to review at least one meaningful life period. The early business question is whether reflective users find the timeline valuable enough to invest effort into building and revisiting it.

### Technical Success

The MVP must provide a stable, private web experience for creating, browsing, and reviewing a personal life timeline. The core timeline interaction must feel smooth enough to support reflective browsing across past, present, and future entries. Data entry and import flows must be reliable, understandable, and reversible.

Technical success requires clear privacy controls, including delete, disconnect, and export capabilities. RescueTime and notes imports must enter as reviewable suggested context rather than automatically polluting the main timeline. The product must preserve user trust by making imported data visible, understandable, and user-controlled.

### Measurable Outcomes

- Founder can use Lifeline as a real self-review tool for personal reflection.
- 10 beta users create complete timelines suitable for reviewing at least one meaningful life period.
- Users can create manual events, attach photos/stories, mark importance, and add future intentions.
- Users can import RescueTime data and notes context into a reviewable staging flow.
- Users can promote imported context into timeline items only when it is personally meaningful.
- Users return for self-review or reflection sessions, not just one-time data entry.
- Users report discovering at least one meaningful pattern, turning point, or life-period insight.
- Users understand privacy controls and can delete, disconnect, and export their data.

## Product Scope

### MVP - Minimum Viable Product

The MVP is a private web app for one user's life timeline. It must support manual creation of dated events, memories, reflections, future intentions, story text, photo references or attachments, and importance weighting. It must provide a beautiful vertical timeline where history scrolls upward and future intentions extend downward.

The MVP must include RescueTime imports and notes imports from Notion or Google Keep-style sources, with imported data treated as suggested context for review. Users must be able to inspect imported activity or notes, decide what matters, and promote selected items into the primary timeline. The MVP should support search and filtering by date, source, importance, and basic themes.

Social media references are post-MVP. The MVP should stay focused on founder-use validation, reflective self-review, pattern discovery, privacy, and the core timeline interaction.

### Growth Features (Post-MVP)

Growth features include social media post references/imports, richer import sources, stronger pattern review tools, guided reflection prompts, improved timeline visualizations, tagging and themes, richer search, and structured weekly/monthly/yearly review modes.

Post-MVP may also include optional AI-assisted summaries, but only if framed as user-controlled reflection support rather than therapy, diagnosis, or clinical interpretation.

### Vision (Future)

The long-term vision is a private life visualization system that helps people understand their life across memories, behavior, relationships, major transitions, personal growth, and future hopes. Lifeline can become the place where users prepare for reflection sessions, review life chapters, recognize repeating patterns, preserve important stories, and make intentional plans for what comes next.

Over time, Lifeline may support selective sharing, family memory collaboration, therapist or coach preparation exports, deeper autobiographical synthesis, and broader integrations, while keeping the core product centered on private self-understanding.

## User Journeys

### Journey 1: Founder First-User Builds a Meaningful Life Timeline

Tuckle opens Lifeline because the idea is personal before it is commercial. He is not looking for another place to write daily notes; he wants a way to see the shape of his life. He starts with a blank vertical line where the present is anchored, history extends upward, and the future extends downward.

He adds a few major life events manually: childhood memories, turning points, difficult periods, accomplishments, creative projects, and moments he wants to understand better. For each event, he assigns a date or approximate date, writes a short story, attaches or references photos where available, and marks the event's importance. The line starts to become legible: not a calendar, but a personal map.

After adding enough entries, he scrolls through a life period and notices clustering: certain activities, moods, decisions, and life events seem connected. The product's value arrives when he can say, "I understand this period more clearly now." The session ends with a future intention placed below the present: a marker for what he wants to build or become next.

This journey reveals requirements for timeline creation, approximate dating, event importance, story text, photo references, vertical navigation, present/future anchoring, and reflective review.

### Journey 2: Founder Uses Imports as Suggested Context

Tuckle connects RescueTime and a notes source such as Notion or Google Keep-style imported notes. Lifeline does not immediately dump every activity block and note onto the main timeline. Instead, it presents imported material as suggested context grouped by date or time period.

He reviews a past week, month, or life chapter and sees RescueTime activity next to relevant notes. Some imported items are noise, some are useful evidence, and a few explain what was really happening during that period. He promotes selected items into the main timeline, attaches them to existing events, or uses them as prompts to write a new reflection.

The value arrives when imported data helps reveal a pattern without overwhelming the timeline. Tuckle remains in control of what becomes part of his life story.

This journey reveals requirements for integration authorization, import staging, suggested context review, source labels, date matching, promote-to-timeline actions, attach-to-existing-event actions, discard/hide controls, and sync failure recovery.

### Journey 3: Founder Revisits an Emotionally Sensitive Period

Tuckle scrolls back to a difficult period of life. The timeline contains important events, personal notes, and possibly imported activity data from that time. He wants clarity, but he also needs control. The experience must feel private, calm, and reversible.

He opens an event, edits wording that feels too raw, lowers the importance of something he no longer wants visually emphasized, hides an imported item, or pauses the review session entirely. He may add a new reflection that reframes the period with more distance: what happened, what repeated, what he learned, and what he wants to carry forward.

The product succeeds if he feels agency rather than exposure. Lifeline should not interpret him, diagnose him, or push emotional conclusions. It should give him a safe structure to inspect and organize his own material.

This journey reveals requirements for edit/delete/hide controls, emotional safety affordances, private-by-default data handling, clear source attribution, session exit points, no forced AI interpretation, and user-controlled reflection prompts.

### Journey 4: Founder Prepares for a Self-Review Session

Tuckle returns to Lifeline before a reflection session: a weekly review, monthly review, annual review, or therapy-adjacent personal check-in. He filters the timeline to a period, reviews high-importance events, checks imported activity context, and looks for repeated themes.

He writes a short summary of what he noticed: what went well, what felt hard, what repeated, what changed, and what he wants to do next. He may add future intentions below the present and link them back to patterns from the past.

The value arrives when Lifeline becomes part of a repeatable reflective ritual. It is not used because of a streak; it is used because it helps him leave the session with clarity.

This journey reveals requirements for period filtering, importance filtering, reflection-session mode, review summaries, theme/tag support, future intentions, and linking future intentions to past events or patterns.

### Journey 5: User Handles Privacy, Export, Delete, and Import Problems

A beta user connects an import source, then later worries about what was imported or wants to disconnect the account. There is no admin console in the MVP, so the product must give users enough direct control to resolve common concerns themselves.

The user opens settings, sees connected sources, understands what data each source can access, disconnects a source, deletes imported data if desired, and exports their timeline. If an import fails, Lifeline explains the issue clearly and offers retry, reconnect, or ignore options.

If the problem cannot be solved in-product, the user can contact support manually, but the MVP should minimize support burden by making privacy and data controls visible and understandable.

This journey reveals requirements for connected-source settings, permission explanations, disconnect controls, delete-imported-data controls, full export, clear import error states, retry/reconnect flows, and manual support contact.

### Journey 6: Integration System Processes Imported Context

Lifeline periodically or manually imports RescueTime and notes data. The system must normalize source data into dated suggested context without assuming everything is meaningful. Each imported item needs source metadata, timestamps, sync status, and a relationship to existing timeline dates or periods.

When an import succeeds, the user sees new suggested context ready for review. When it partially fails, the user sees what succeeded, what failed, and what can be retried. When a source is disconnected, Lifeline stops future syncs and gives the user a choice about keeping or deleting already imported data.

This journey reveals requirements for import jobs, source metadata, sync status, partial failure handling, deduplication, date normalization, staging records, source disconnect behavior, and deletion/export consistency.

### Journey Requirements Summary

These journeys reveal the following capability areas:

- Timeline foundation: vertical infinite timeline, present anchor, past/future direction, smooth scrolling, dated and approximate-dated events.
- Event model: memories, stories, reflections, photos/references, importance weighting, future intentions, source attribution.
- Reflection workflow: period review, importance filtering, review summaries, pattern discovery support, future intention creation.
- Import workflow: RescueTime import, notes import, authorization, staging, review, promote, attach, discard/hide, retry, reconnect, disconnect.
- Privacy and trust: private-by-default data, clear permissions, edit/delete/hide, export, delete imported data, no clinical or diagnostic claims.
- Emotional safety: calm review experience, reversible actions, session exit points, user-controlled interpretation.
- Support without admin console: user-facing troubleshooting, clear import error states, manual contact path for unresolved issues.
- Technical import reliability: source metadata, date normalization, sync status, deduplication, partial failure handling.

## Domain-Specific Requirements

### Compliance & Regulatory

Lifeline must avoid positioning itself as clinical software in the MVP. It should not diagnose, treat, prescribe, assess mental health risk, replace therapy, or provide medical advice. Product copy and onboarding should describe Lifeline as a private reflection and life visualization tool.

The MVP should treat user data as highly sensitive even if HIPAA does not apply by default. Lifeline should use privacy practices appropriate for deeply personal data: explicit consent for imports, clear source permissions, delete/export controls, and no hidden secondary use of imported personal data.

If Lifeline later introduces therapist workflows, clinical interpretation, risk detection, or provider-facing features, the product should be re-evaluated for healthcare compliance, regional privacy law obligations, and professional liability concerns.

### Technical Constraints

Lifeline must be private by default. Timeline data, notes, photos, imported activity data, and reflections require user authentication and should not be publicly accessible unless a future sharing feature is explicitly introduced.

Imported data must be reversible and inspectable. Users need to know what source an item came from, when it was imported, whether it is staged or promoted, and how to delete it. Imports should never silently become permanent primary timeline events.

The product should support data export early because trust is central to adoption. Users should be able to leave with their memories, events, reflections, and imported context in a usable format.

### Integration Requirements

RescueTime and notes imports must use explicit user authorization or user-provided export/import flows. Lifeline should preserve source metadata, timestamps, and sync status for imported records.

Notion and Google Keep-style notes should be treated as sensitive written material. The import flow should make clear what is being accessed, whether content is copied or referenced, and how users can disconnect or delete imported content.

The MVP should prioritize import staging and curation over broad integration coverage. A smaller set of well-controlled imports is better than many opaque connections.

### Risk Mitigations

The main domain risk is emotional overwhelm. Lifeline should avoid forcing resurfacing, interpretation, or conclusions. It should provide calm browsing, edit/hide/delete controls, and clear exits from reflection sessions.

The second risk is data overload. Imports can easily flood the timeline with low-signal activity. Lifeline should separate suggested context from primary events and require user action before imported items become central timeline content.

The third risk is trust loss. A user who feels surprised by what was imported, unsure where data is stored, or unable to delete/export their history may abandon the product. Privacy and control must be visible product features, not buried settings.

The fourth risk is accidental clinical framing. Because users may use Lifeline around therapy-adjacent reflection, the product must stay careful: it can help users organize and reflect on their own material, but it should not claim to interpret mental health, identify trauma patterns, or offer therapeutic guidance.

## Innovation & Novel Patterns

### Detected Innovation Areas

Lifeline's primary innovation is a new reflective product pattern: a private life timeline that combines authored memories, personal stories, photos, future intentions, and imported behavioral context into one navigable vertical interface. The product is not novel because of any single source of data; it is novel because it turns fragmented personal records into a curated autobiographical system for pattern recognition and self-review.

The most important novel pattern is import curation. RescueTime and notes data should not become timeline content automatically. Instead, imported records appear as suggested context that users can inspect, attach, promote, hide, or discard. This lets Lifeline combine quantified-self data with personal meaning without turning the timeline into a noisy activity log.

The second novel pattern is future orientation. Lifeline is not only a memory archive. The line extends downward into future intentions, allowing users to connect what they have noticed about the past with what they want to become next.

### Market Context & Competitive Landscape

Adjacent products validate pieces of the behavior: journaling apps capture dated reflections and photos, productivity tools capture behavior, notes apps capture thoughts, and social platforms preserve public fragments. Lifeline's differentiation is bringing these fragments into a single private reflection experience organized around meaning, importance, and life periods.

The competitive risk is that users may compare Lifeline to journaling apps or productivity dashboards. The product should avoid competing on generic journaling features or raw analytics. Its strongest positioning is: a private life visualization and reflection tool for understanding personal patterns over time.

### Validation Approach

The innovation should be validated through founder use first, then a small beta. The key question is whether a user can create enough timeline structure and imported context to discover a meaningful pattern or gain clarity from a self-review session.

Validation should focus on qualitative evidence before scale: whether users say the timeline helped them understand a life period, recognize a repeated pattern, prepare for reflection, or connect past events to future intentions. The first beta target is 10 users with complete timelines suitable for reviewing at least one meaningful life period.

### Risk Mitigation

The main innovation risk is that combining memories and imports creates more clutter instead of more clarity. Lifeline mitigates this by staging imports separately from primary timeline events and requiring user curation before imported data becomes central.

The second risk is that the product's metaphor feels beautiful but not useful. Lifeline must validate the timeline as an active reflection tool, not just a visual archive. Reflection sessions, period filters, importance weighting, and future intentions should make the interface useful for self-review.

The third risk is overreach into AI interpretation or therapy-like claims. Lifeline should keep interpretation user-controlled in the MVP. It can structure and surface material, but should not claim to diagnose, treat, or explain the user psychologically.

## Web App Specific Requirements

### Project-Type Overview

Lifeline is a private web app for creating, importing, curating, and reviewing a personal life timeline. The MVP should support both desktop web and mobile web from the beginning, with the timeline optimized for reflective browsing on larger screens while remaining usable on mobile for capture, review, and quick edits.

The product does not require SEO for MVP because timeline content is private and authenticated. Any public-facing marketing or landing page can be handled later and should not shape the initial product architecture.

### Technical Architecture Considerations

Lifeline should require authentication from day one using Google login. User data must be scoped to the authenticated user, with no public access to timeline content, imported notes, RescueTime data, photos, reflections, or future intentions.

The web app should be responsive across desktop and mobile browsers. Desktop should prioritize timeline exploration, review sessions, import curation, and richer filtering. Mobile should prioritize quick event capture, lightweight browsing, editing mandatory fields, and reviewing staged imported context.

Offline support is desirable for MVP, especially for mandatory event fields and draft creation. Users should be able to start or edit core timeline entries when temporarily offline, then sync changes when connectivity returns. Offline support does not need to cover full import sync, media upload, or advanced review workflows in the first version.

### Browser Matrix

The MVP should support current stable versions of major modern browsers:

- Chrome desktop and mobile
- Safari desktop and iOS
- Firefox desktop
- Edge desktop

Legacy browser support is not required for MVP.

### Responsive Design

The app must support both desktop and mobile web layouts. The timeline should maintain the same conceptual model across breakpoints: history upward, future downward, present anchored clearly.

Desktop layouts should support richer timeline density, side panels, filters, import review, and reflection sessions. Mobile layouts should simplify controls, preserve readable event cards, avoid overlapping text, and make capture/edit actions easy with touch input.

### Performance Targets

The timeline must feel smooth during normal browsing and self-review. MVP performance should prioritize:

- Fast initial load after authentication.
- Smooth scrolling through a user's timeline.
- Efficient rendering of long timelines through pagination, virtualization, or incremental loading.
- Clear loading states for imports, media, and staged context.
- No blocking of core manual event creation while imports are syncing.

### SEO Strategy

SEO is not a requirement for the MVP. All meaningful product content is private and authenticated. Public pages, marketing content, and discoverability can be deferred until after the product proves founder utility and early beta value.

### Accessibility Level

The MVP should provide basic accessible UX. Core flows should be keyboard reachable where practical, form fields should have clear labels, color should not be the only indicator of importance/source/status, and timeline text should remain readable across desktop and mobile.

Accessibility should be treated as part of product quality, but formal WCAG AA compliance can be deferred unless the product later targets broader public launch or accessibility-sensitive users.

### Implementation Considerations

Google login, private user-scoped data, import authorization, and delete/export controls should be treated as foundational, not optional polish. Offline drafting should be scoped carefully: support local creation/editing of required event fields first, then sync when online.

The import system should not depend on SEO or public routing. RescueTime and notes imports should feed into a private staging area associated with the authenticated user. Imported data should preserve source metadata and sync state so users can understand, promote, hide, delete, or export it.

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Founder-use validation MVP. The first release should prove that Lifeline is personally useful as a private self-review and pattern-discovery tool before optimizing for broad market growth.

**Resource Requirements:** MVP implementation likely needs product/design ownership, a full-stack web developer, and enough integration/backend capability to support Google login, private user data, RescueTime import, notes import, import staging, export/delete controls, and offline event drafts. If resources are limited, visual polish and timeline interaction should remain high priority because the product's core value depends on the life-line experience feeling meaningful, calm, and usable.

The MVP should answer one question: can a reflective user build a complete enough timeline, enrich it with staged imported context, and leave a self-review session with clearer insight into a life period or recurring pattern?

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:**

- Founder first-user builds a meaningful life timeline.
- Founder imports RescueTime and notes as suggested context.
- Founder revisits emotionally sensitive periods with control and privacy.
- Founder prepares for a self-review session.
- User handles privacy, export, delete, disconnect, and import failure states.
- System processes imported context into staged, reviewable records.

**Must-Have Capabilities:**

- Google login and authenticated private user data.
- Responsive web app for desktop and mobile web.
- Vertical life timeline with clear present anchor, history upward, and future downward.
- Manual event creation with date or approximate date, title, story/reflection text, and importance weighting.
- Photo attachment or photo reference support.
- Future intention creation below the present.
- Timeline browsing, filtering, and search by date, source, importance, and basic themes.
- Reflection/self-review workflow for reviewing a life period and recording insights.
- RescueTime import into a staged suggested-context area.
- Notes import from Notion or Google Keep-style sources into a staged suggested-context area.
- User curation actions for imported context: inspect, promote to timeline, attach to existing event, hide/discard.
- Source metadata and sync status for imported records.
- Import error states with retry/reconnect paths.
- Private-by-default data model.
- User-facing delete, disconnect, and export controls.
- Basic accessible UX.
- Offline draft support for mandatory manual event fields, with sync when online.
- No social media imports in MVP.
- No clinical claims, diagnosis, therapist workflows, or AI therapist positioning in MVP.

### Post-MVP Features

**Phase 2 (Post-MVP):**

- Social media post references/imports.
- Richer review modes for weekly, monthly, yearly, and life-chapter reflection.
- Stronger theme/tag system and pattern review tools.
- Improved timeline visualization options.
- Guided reflection prompts.
- Better import coverage and deeper import controls.
- Optional AI-assisted summaries framed as user-controlled reflection support, not therapy or diagnosis.
- Public landing page and basic growth/marketing surface if product validation supports it.

**Phase 3 (Expansion):**

- Selective sharing of individual stories or life chapters.
- Family memory collaboration.
- Therapist or coach preparation exports, without clinical workflow ownership unless compliance is revisited.
- Rich autobiographical synthesis and long-term pattern dashboards.
- Broader integrations across photos, social platforms, calendars, location history, and other personal data sources.
- Advanced privacy controls for shared/exported subsets of the timeline.

### Risk Mitigation Strategy

**Technical Risks:** The largest technical risk is overbuilding imports before proving the timeline reflection loop. Mitigation: implement a narrow import pipeline first, stage all imported records, and keep manual event creation fully usable even if imports fail. Use virtualization or incremental loading for long timelines. Scope offline support to draft/edit of mandatory event fields rather than full offline sync for imports and media.

**Market Risks:** The largest market risk is that users find the concept beautiful but do not invest enough effort to build a useful timeline. Mitigation: validate through founder use first, then 10 beta users with complete timelines, and measure whether users report discovering a meaningful pattern or using Lifeline for self-review.

**Resource Risks:** The MVP includes several nontrivial systems: responsive timeline UI, auth, private storage, import staging, export/delete, and offline drafts. If resources are constrained, keep the beta single-user/private, avoid social features, avoid AI interpretation, avoid admin consoles, and prioritize the core loop: create timeline → import suggested context → curate → reflect → record insight/future intention.

## Functional Requirements

### User Accounts & Privacy

- FR1: Users can sign in with Google to access their private Lifeline workspace.
- FR2: Users can sign out of their account.
- FR3: Users can access only their own timeline, events, imports, reflections, photos, and settings.
- FR4: Users can view and manage connected import sources.
- FR5: Users can disconnect an import source.
- FR6: Users can delete imported data from a disconnected or active source.
- FR7: Users can export their timeline data, including events, reflections, future intentions, and imported context.
- FR8: Users can delete timeline content they created.
- FR9: Users can understand what permissions each connected source uses.

### Timeline & Event Management

- FR10: Users can create dated life events on a vertical timeline.
- FR11: Users can create events with approximate dates when exact dates are unknown.
- FR12: Users can edit existing timeline events.
- FR13: Users can delete existing timeline events.
- FR14: Users can add story or reflection text to timeline events.
- FR15: Users can attach or reference photos on timeline events.
- FR16: Users can mark event importance.
- FR17: Users can adjust event importance after creation.
- FR18: Users can browse their timeline with history oriented upward and future entries oriented downward.
- FR19: Users can identify the present point on the timeline.
- FR20: Users can create future intentions below the present point.
- FR21: Users can edit or delete future intentions.
- FR22: Users can hide timeline items without permanently deleting them.

### Timeline Discovery & Review

- FR23: Users can search timeline content.
- FR24: Users can filter timeline content by date or date range.
- FR25: Users can filter timeline content by importance.
- FR26: Users can filter timeline content by source.
- FR27: Users can filter or group timeline content by basic themes.
- FR28: Users can review a specific life period.
- FR29: Users can record a self-review summary for a selected period.
- FR30: Users can identify and record insights from a reflection session.
- FR31: Users can link future intentions to past events, reflections, or patterns.
- FR32: Users can exit or pause a reflection session without losing drafted work.

### Imports & Suggested Context

- FR33: Users can connect RescueTime as an import source.
- FR34: Users can import RescueTime activity data into Lifeline.
- FR35: Users can connect a notes source such as Notion or Google Keep-style imported notes.
- FR36: Users can import notes content into Lifeline.
- FR37: Users can view imported records in a staged suggested-context area before they become primary timeline items.
- FR38: Users can inspect imported records with source, timestamp, and sync status.
- FR39: Users can promote an imported record into a primary timeline item.
- FR40: Users can attach an imported record to an existing timeline event.
- FR41: Users can hide or discard imported records from suggested context.
- FR42: Users can retry a failed import.
- FR43: Users can reconnect a source after authorization or sync failure.
- FR44: Users can see which imported records succeeded, failed, or partially synced.
- FR45: The system can preserve source metadata for imported records.
- FR46: The system can prevent imported records from automatically becoming primary timeline events.

### Offline Drafting & Sync

- FR47: Users can create a draft timeline event while temporarily offline.
- FR48: Users can edit mandatory fields of a draft event while temporarily offline.
- FR49: Users can sync offline drafts when connectivity returns.
- FR50: Users can see whether an offline draft is unsynced, syncing, synced, or failed.
- FR51: Users can resolve failed draft syncs.

### Emotional Safety & Product Boundaries

- FR52: Users can edit, hide, or delete emotionally sensitive entries.
- FR53: Users can control whether resurfaced imported content remains visible in their timeline workflow.
- FR54: Users can use Lifeline without receiving clinical claims, diagnoses, treatment guidance, or therapist-like interpretation.
- FR55: Users can access product language that frames Lifeline as private reflection and life visualization, not medical or therapeutic software.
- FR56: Users can manually create their own interpretations and reflections rather than receiving forced conclusions from the product.

### Responsive Web Experience

- FR57: Users can use core Lifeline capabilities on desktop web.
- FR58: Users can use core Lifeline capabilities on mobile web.
- FR59: Users can perform quick capture and mandatory event edits on mobile web.
- FR60: Users can perform richer timeline review and import curation on desktop web.
- FR61: Users can use core forms and navigation with basic accessible interaction patterns.

### Support & Troubleshooting

- FR62: Users can view clear import error messages.
- FR63: Users can choose retry, reconnect, ignore, or disconnect when an import fails.
- FR64: Users can access a manual support contact path for unresolved issues.
- FR65: Users can understand whether an issue affects timeline content, import staging, sync, export, or account access.

## Non-Functional Requirements

### Performance

- NFR1: Authenticated users should be able to reach their timeline within 3 seconds on a normal broadband connection after initial app load.
- NFR2: Manual event creation and editing interactions should provide visible feedback within 1 second.
- NFR3: Timeline browsing should remain smooth for timelines containing at least 1,000 combined events and imported context records.
- NFR4: Import processing must not block manual timeline creation, editing, or reflection workflows.
- NFR5: Long timelines should load incrementally so users can begin browsing before all historical data is loaded.
- NFR6: Timeline filtering and search should return usable results within 2 seconds for MVP-scale timelines.

### Security & Privacy

- NFR7: All private user data must be accessible only to the authenticated owner account.
- NFR8: Personal timeline data, imported records, reflections, notes, and photo references must be protected in transit and at rest.
- NFR9: Import permissions must be explicit, source-specific, and visible to the user before connection.
- NFR10: Users must be able to disconnect import sources without losing manually created timeline content.
- NFR11: Users must be able to delete imported data associated with a source.
- NFR12: The product must not use private user data for public sharing, training, analytics resale, or secondary purposes without explicit user consent.
- NFR13: Logs, analytics, and diagnostics must avoid storing sensitive timeline content, note content, imported activity details, or reflection text unless explicitly required and disclosed.
- NFR14: Product language must avoid clinical, diagnostic, or treatment claims in the MVP.

### Reliability & Data Integrity

- NFR15: Manual timeline events, reflections, future intentions, and importance values must not be lost during normal save, edit, refresh, reconnect, or sign-in flows.
- NFR16: Offline drafts must preserve mandatory event fields locally until they are synced, resolved, or explicitly discarded by the user.
- NFR17: Sync states for offline drafts must be visible as unsynced, syncing, synced, conflict, or failed.
- NFR18: If an offline draft conflicts with a server-side version, the user must be able to review and choose how to resolve the conflict.
- NFR19: Import failures must preserve successfully imported records and clearly identify failed or partially synced records.
- NFR20: Source metadata and timestamps must remain associated with imported records after staging, promotion, attachment, export, or deletion.
- NFR21: The system should support recoverability for user-created timeline data through routine backups or equivalent data-protection mechanisms.

### Integration Quality

- NFR22: RescueTime import should preserve enough timestamp and activity metadata for users to place activity context within life periods.
- NFR23: Notes imports should preserve enough source, title/content, and timestamp context for users to understand where each note came from.
- NFR24: Imported records must remain staged until the user explicitly promotes, attaches, hides, or discards them.
- NFR25: Disconnecting an import source must stop future sync attempts for that source.
- NFR26: Reconnect and retry flows must communicate whether authorization, network, source availability, or source-data problems caused the issue when known.
- NFR27: Re-importing the same source data should avoid creating duplicate suggested-context records where records can be matched reliably.

### Accessibility

- NFR28: Core navigation and forms should be usable with keyboard input where practical.
- NFR29: Form fields must have clear labels and validation messages.
- NFR30: Color must not be the only indicator of importance, source, sync status, or error state.
- NFR31: Timeline text and controls must remain readable and usable on supported desktop and mobile browsers.
- NFR32: The app should support basic screen-reader semantics for core forms, settings, and timeline item content.

### Data Portability

- NFR33: Users must be able to export their timeline data in a usable structured format.
- NFR34: Exports should include manual events, reflections, future intentions, importance values, source references, and imported context metadata.
- NFR35: Exported data should distinguish manually created content from imported context.
- NFR36: Deletion controls should make clear whether the user is deleting a single item, imported data from a source, or broader timeline content.
- NFR37: Export and deletion flows should provide clear confirmation when the requested action has completed or failed.
