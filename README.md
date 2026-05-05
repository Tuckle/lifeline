# Lifeline

Lifeline is a private life-visualization web app for building a personal timeline, importing staged context, and reflecting on life periods. This repository starts from the Supabase Next.js starter and is organized for the BMad implementation plan.

## Foundation

- Next.js App Router with TypeScript
- Tailwind CSS with shadcn/ui-style primitives
- Supabase Auth, SSR clients, Postgres, RLS, and Storage-ready structure
- Feature domains under `src/features/`
- Shared runtime utilities under `src/lib/`
- CI validation through GitHub Actions

## Environment

Create `.env.local` from `.env.example` and fill in the public Supabase project values:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-or-anon-key
```

Never store service-role keys, import tokens, source secrets, or private user data in `NEXT_PUBLIC_*` variables.

## Development

```bash
npm install
npm run dev
```

Validation commands:

```bash
npm run typecheck
npm run lint
npm test
```

## Project Structure

- `src/app/` - Next.js App Router routes
- `src/components/ui/` - shared UI primitives
- `src/components/layout/` - shared layout and shell components
- `src/features/timeline/` - timeline domain
- `src/features/imports/` - imports and staged context domain
- `src/features/reviews/` - reflection and review-session domain
- `src/features/settings/` - privacy, source management, export, and delete domain
- `src/features/auth/` - auth-domain helpers
- `src/features/offline/` - offline draft and sync domain
- `src/lib/supabase/` - runtime-specific Supabase clients
- `supabase/migrations/` - future schema and RLS migrations

## Architecture Conventions

- MVP route segments should stay kebab-case and are expected to grow around `/timeline`, `/add`, `/imports`, `/reflect`, `/search`, and `/settings`.
- The `/reflect` route maps to the `src/features/reviews/` implementation domain.
- Use PascalCase for components and exported types, camelCase for TypeScript values/functions, and snake_case for Supabase database objects.
- Keep shared server/client Supabase code split by runtime under `src/lib/supabase/`.
- Keep tests near the behavior they protect when feature stories add them, and keep shared foundation checks under `scripts/` until a broader test runner is introduced.
- Deploy through the Next.js/Vercel-compatible path unless a later architecture decision replaces it.
- Prefer local component state for isolated UI interactions, and introduce shared state only when cross-route coordination or cached server data makes it necessary.

## Data Recoverability

User-created timeline data must be recoverable through Supabase backups or an equivalent data-protection mechanism before real beta use. Future schema stories must preserve this expectation when adding user-owned tables, RLS policies, exports, and deletion flows.

## BMad Artifacts

Planning and workflow artifacts live in `.agents/`, `_bmad/`, `_bmad-output/`, and `docs/`. Keep those folders intact when scaffolding, refactoring, or moving application code.
