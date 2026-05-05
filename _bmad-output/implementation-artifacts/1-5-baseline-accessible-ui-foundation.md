# Story 1.5: Baseline Accessible UI Foundation

Status: done

<!-- Validation note: Story context created from epics, UX spec, architecture, previous stories, and current UI primitive inventory. -->

## Story

As a Lifeline user,  
I want the app's basic interface to be readable, calm, and accessible,  
so that every later feature starts from a trustworthy and usable foundation.

## Acceptance Criteria

1. Given the app shell exists, when Lifeline design tokens are implemented, then the app includes the approved core color tokens, semantic state tokens, typography scale, spacing scale, radius rules, and focus state styling, and token usage supports the warm, minimal, reflective visual direction.
2. Given shared UI primitives are added, when buttons, links, inputs, labels, alerts, badges, toasts, dialogs, and sheets are used, then they follow the chosen Tailwind plus shadcn/ui-style foundation and are themed consistently with Lifeline tokens.
3. Given a user navigates with keyboard input, when they move through the sign-in screen and private app shell, then all interactive controls have visible focus states and tab order is logical.
4. Given the app renders text, controls, and status states, when colors are used, then WCAG 2.2 AA contrast is met for normal text and controls, and color is not the only indicator of active route, source state, error, or status.
5. Given the app shell is viewed at mobile, tablet, desktop, and wide desktop widths, when layout is tested at 320px, 375px, 430px, 768px, 1024px, and 1280px+, then navigation and visible text do not overlap or overflow incoherently, and the app remains usable without viewport-based font scaling.

## Tasks / Subtasks

- [x] Implement Lifeline design tokens. (AC: 1, 4)
  - [x] Replace starter grayscale CSS variables with approved warm Lifeline color tokens.
  - [x] Add semantic state tokens for timeline, memory, reflection, future, import, warning, error, and focus.
  - [x] Add typography, spacing, radius, and elevation tokens without viewport-scaled font sizing.
  - [x] Keep dark mode usable with calm, high-contrast equivalents.

- [x] Extend Tailwind token mapping. (AC: 1, 2, 4)
  - [x] Map Lifeline semantic tokens in `tailwind.config.ts` so later stories can use token classes.
  - [x] Keep existing shadcn/ui-compatible names (`background`, `foreground`, `primary`, `muted`, etc.) working.
  - [x] Add token names for timeline, memory, reflection, future, imported context, warning, and focus.

- [x] Add missing shared UI primitives. (AC: 2, 3, 4)
  - [x] Add alert, dialog, sheet, and toast/sonner primitives following existing component patterns.
  - [x] Update button, badge, card, input, checkbox, and label focus/contrast/radius treatment where needed.
  - [x] Add the toast provider to the root layout.

- [x] Apply the foundation to current surfaces. (AC: 1-5)
  - [x] Update login, shell, navigation, and placeholders to use tokenized warm styling.
  - [x] Keep active route states non-color-only using icon/text/shape/weight.
  - [x] Ensure mobile touch targets remain at least 44px where practical.

- [x] Extend validation coverage. (AC: 1-5)
  - [x] Update `scripts/validate-foundation.mjs` to verify Lifeline tokens, semantic Tailwind mappings, primitive files, toast provider, focus classes, and absence of viewport font scaling.
  - [x] Run `npm run typecheck`, `npm run lint`, `npm test`, `npm audit --omit=dev`, `npm run build`, and route smoke checks.

## Dev Notes

### Current Code State

- Story 1.4 is done and pushed to `origin/main` at commit `a395645`.
- The private workspace shell lives in `src/components/layout/workspace-shell.tsx`.
- Route-aware navigation lives in `src/components/layout/workspace-navigation.tsx`.
- Existing primitives include button, badge, card, checkbox, dropdown menu, input, and label.
- Missing primitives for this story are alert, dialog, sheet, and toast.

### UX Guardrails

- Approved color tokens: background `#FAF7F2`, surface `#FFFFFF`, surface muted `#F1ECE4`, text primary `#1F2522`, text secondary `#5F6862`, border `#D8D0C4`, timeline line `#B8AA98`, primary accent `#2F6F68`, memory accent `#B86B4B`, reflection accent `#6E5E93`, future accent `#3B6E8F`, import accent `#667085`, warning `#B7791F`, and error `#B42318`. [Source: UX Design Requirements]
- The system should be minimal and clean structurally, with warmth through color, spacing, typography, motion, empty states, memory presentation, and reflection surfaces. [Source: UX Design Specification]
- Cards should be used carefully for actual items, modals, or focused tools; avoid nested card-heavy layouts. [Source: UX Design Specification]
- Color must not be the only indicator of meaning; active routes, states, and errors need text/icon/shape/focus support. [Source: UX Design Specification]
- Touch targets should be at least 44px where practical; focus states must be visible. [Source: UX Design Specification]

### Architecture Guardrails

- Use Tailwind CSS plus shadcn/ui-style primitives.
- Keep shared UI primitives in `src/components/ui/`.
- Use pinned dependencies; do not use `latest`.
- Do not introduce data schemas, domain mutations, or feature-specific mock private content in this story.

### Previous Story Intelligence

- Use `PATH="/opt/homebrew/bin:$PATH" npm ...` for local npm commands.
- The old `/protected` route remains protected by proxy and redirects to `/timeline` once authenticated.
- `scripts/validate-foundation.mjs` is the lightweight validation path wired to `npm test`.

### References

- [Epics Story 1.5](/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/epics.md)
- [UX Design Specification](/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/ux-design-specification.md)
- [Architecture Decision Document](/Users/Tuckle/Projects/lifeline/_bmad-output/planning-artifacts/architecture.md)
- [Previous Story 1.4](/Users/Tuckle/Projects/lifeline/_bmad-output/implementation-artifacts/1-4-responsive-app-shell-navigation.md)

## Dev Agent Record

### Agent Model Used

GPT-5

### Debug Log References

- `PATH="/opt/homebrew/bin:$PATH" npm view @radix-ui/react-dialog version`
- `PATH="/opt/homebrew/bin:$PATH" npm view sonner version`
- `PATH="/opt/homebrew/bin:$PATH" npm install @radix-ui/react-dialog@1.1.15 sonner@2.0.7 --save-exact`
- `PATH="/opt/homebrew/bin:$PATH" npm run typecheck`
- `PATH="/opt/homebrew/bin:$PATH" npm run lint`
- `PATH="/opt/homebrew/bin:$PATH" npm test`
- `PATH="/opt/homebrew/bin:$PATH" npm audit --omit=dev`
- `PATH="/opt/homebrew/bin:$PATH" npm run build`
- Visual-foundation scan: no `tracking-*`, viewport-scaled font-size utilities, or negative letter spacing found in the token/shell/navigation source set.
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
- Replaced starter grayscale globals with approved Lifeline warm neutral and semantic color tokens, plus dark-mode equivalents.
- Added Tailwind mappings for focus, timeline, memory, reflection, future, imported context, warning, success, typography, spacing, radius, and elevation tokens.
- Added alert, dialog, sheet, and sonner toast primitives, and mounted the toast provider in the root layout.
- Updated existing button, badge, card, input, checkbox, label, dropdown shortcut, shell, and placeholder styling to align with the accessible token foundation.
- Added exact pinned dependencies for `@radix-ui/react-dialog` and `sonner`.
- Extended foundation validation to cover tokens, primitives, pinned UI deps, focus classes, toast provider, and visual typography constraints.
- Code review pass completed locally; fixed dependency range pinning and removed custom letter-spacing utility usage before final validation.

### File List

- `/Users/Tuckle/Projects/lifeline/_bmad-output/implementation-artifacts/1-5-baseline-accessible-ui-foundation.md`
- `/Users/Tuckle/Projects/lifeline/_bmad-output/implementation-artifacts/sprint-status.yaml`
- `/Users/Tuckle/Projects/lifeline/package-lock.json`
- `/Users/Tuckle/Projects/lifeline/package.json`
- `/Users/Tuckle/Projects/lifeline/scripts/validate-foundation.mjs`
- `/Users/Tuckle/Projects/lifeline/src/app/globals.css`
- `/Users/Tuckle/Projects/lifeline/src/app/layout.tsx`
- `/Users/Tuckle/Projects/lifeline/src/components/layout/workspace-shell.tsx`
- `/Users/Tuckle/Projects/lifeline/src/components/ui/alert.tsx`
- `/Users/Tuckle/Projects/lifeline/src/components/ui/badge.tsx`
- `/Users/Tuckle/Projects/lifeline/src/components/ui/button.tsx`
- `/Users/Tuckle/Projects/lifeline/src/components/ui/card.tsx`
- `/Users/Tuckle/Projects/lifeline/src/components/ui/checkbox.tsx`
- `/Users/Tuckle/Projects/lifeline/src/components/ui/dialog.tsx`
- `/Users/Tuckle/Projects/lifeline/src/components/ui/dropdown-menu.tsx`
- `/Users/Tuckle/Projects/lifeline/src/components/ui/input.tsx`
- `/Users/Tuckle/Projects/lifeline/src/components/ui/label.tsx`
- `/Users/Tuckle/Projects/lifeline/src/components/ui/sheet.tsx`
- `/Users/Tuckle/Projects/lifeline/src/components/ui/sonner.tsx`
- `/Users/Tuckle/Projects/lifeline/tailwind.config.ts`

## Change Log

| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-05-05 | 1.0 | Implemented Lifeline accessible UI token and primitive foundation. | Amelia (Dev Agent) |
