create table if not exists public.review_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  period_started_on date,
  period_ended_on date,
  summary_text text not null default '' check (char_length(summary_text) <= 12000),
  status text not null default 'draft' check (
    status in ('draft', 'paused', 'completed')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (period_started_on is not null or period_ended_on is not null)
);

create index if not exists review_sessions_user_period_idx
  on public.review_sessions (user_id, period_started_on, period_ended_on);

create index if not exists review_sessions_user_status_idx
  on public.review_sessions (user_id, status);

drop trigger if exists set_review_sessions_updated_at on public.review_sessions;

create trigger set_review_sessions_updated_at
before update on public.review_sessions
for each row
execute function public.set_updated_at();

alter table public.review_sessions enable row level security;

create policy "review_sessions_select_own"
on public.review_sessions
for select
using (auth.uid() = user_id);

create policy "review_sessions_insert_own"
on public.review_sessions
for insert
with check (auth.uid() = user_id);

create policy "review_sessions_update_own"
on public.review_sessions
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "review_sessions_delete_own"
on public.review_sessions
for delete
using (auth.uid() = user_id);
