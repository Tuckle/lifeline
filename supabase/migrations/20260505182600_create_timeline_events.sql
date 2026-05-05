create extension if not exists "pgcrypto";

create table if not exists public.timeline_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 180),
  story_text text,
  occurred_on date,
  date_precision text not null default 'unknown' check (
    date_precision in ('exact', 'month', 'year', 'period', 'unknown')
  ),
  approximate_date_label text,
  period_started_on date,
  period_ended_on date,
  importance text not null default 'unset' check (
    importance in ('unset', 'low', 'medium', 'high', 'defining')
  ),
  status text not null default 'active' check (
    status in ('active', 'hidden', 'deleted')
  ),
  source_type text not null default 'manual' check (source_type in ('manual')),
  source_label text not null default 'Manual',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    period_started_on is null
    or period_ended_on is null
    or period_started_on <= period_ended_on
  )
);

create index if not exists timeline_events_user_occurred_on_idx
  on public.timeline_events (user_id, occurred_on);

create index if not exists timeline_events_user_created_at_idx
  on public.timeline_events (user_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_timeline_events_updated_at on public.timeline_events;

create trigger set_timeline_events_updated_at
before update on public.timeline_events
for each row
execute function public.set_updated_at();

alter table public.timeline_events enable row level security;

create policy "timeline_events_select_own"
on public.timeline_events
for select
using (auth.uid() = user_id);

create policy "timeline_events_insert_own"
on public.timeline_events
for insert
with check (auth.uid() = user_id);

create policy "timeline_events_update_own"
on public.timeline_events
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "timeline_events_delete_own"
on public.timeline_events
for delete
using (auth.uid() = user_id);
