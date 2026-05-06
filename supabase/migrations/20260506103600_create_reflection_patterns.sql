create table if not exists public.reflection_patterns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  review_session_id uuid references public.review_sessions(id) on delete set null,
  period_started_on date,
  period_ended_on date,
  title text not null check (char_length(title) between 1 and 180),
  description text not null default '' check (char_length(description) <= 4000),
  author_state text not null default 'user_authored' check (
    author_state in ('user_authored', 'user_confirmed')
  ),
  status text not null default 'active' check (
    status in ('active', 'dismissed')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (period_started_on is not null or period_ended_on is not null)
);

create table if not exists public.reflection_pattern_timeline_events (
  pattern_id uuid not null references public.reflection_patterns(id) on delete cascade,
  timeline_event_id uuid not null references public.timeline_events(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (pattern_id, timeline_event_id)
);

create index if not exists reflection_patterns_user_period_idx
  on public.reflection_patterns (user_id, period_started_on, period_ended_on);

create index if not exists reflection_patterns_user_status_idx
  on public.reflection_patterns (user_id, status);

create index if not exists reflection_pattern_events_event_idx
  on public.reflection_pattern_timeline_events (timeline_event_id);

drop trigger if exists set_reflection_patterns_updated_at on public.reflection_patterns;

create trigger set_reflection_patterns_updated_at
before update on public.reflection_patterns
for each row
execute function public.set_updated_at();

alter table public.reflection_patterns enable row level security;
alter table public.reflection_pattern_timeline_events enable row level security;

create policy "reflection_patterns_select_own"
on public.reflection_patterns
for select
using (auth.uid() = user_id);

create policy "reflection_patterns_insert_own"
on public.reflection_patterns
for insert
with check (auth.uid() = user_id);

create policy "reflection_patterns_update_own"
on public.reflection_patterns
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "reflection_patterns_delete_own"
on public.reflection_patterns
for delete
using (auth.uid() = user_id);

create policy "reflection_pattern_events_select_own"
on public.reflection_pattern_timeline_events
for select
using (
  exists (
    select 1
    from public.reflection_patterns pattern
    where pattern.id = pattern_id
      and pattern.user_id = auth.uid()
  )
);

create policy "reflection_pattern_events_insert_own"
on public.reflection_pattern_timeline_events
for insert
with check (
  exists (
    select 1
    from public.reflection_patterns pattern
    where pattern.id = pattern_id
      and pattern.user_id = auth.uid()
  )
  and exists (
    select 1
    from public.timeline_events event
    where event.id = timeline_event_id
      and event.user_id = auth.uid()
  )
);

create policy "reflection_pattern_events_delete_own"
on public.reflection_pattern_timeline_events
for delete
using (
  exists (
    select 1
    from public.reflection_patterns pattern
    where pattern.id = pattern_id
      and pattern.user_id = auth.uid()
  )
);
