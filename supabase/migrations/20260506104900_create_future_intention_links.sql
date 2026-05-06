create table if not exists public.future_intention_links (
  id uuid primary key default gen_random_uuid(),
  future_intention_id uuid not null references public.future_intentions(id) on delete cascade,
  review_session_id uuid references public.review_sessions(id) on delete cascade,
  reflection_pattern_id uuid references public.reflection_patterns(id) on delete cascade,
  timeline_event_id uuid references public.timeline_events(id) on delete cascade,
  created_at timestamptz not null default now(),
  check (num_nonnulls(review_session_id, reflection_pattern_id, timeline_event_id) = 1),
  unique (future_intention_id)
);

create index if not exists future_intention_links_future_idx
  on public.future_intention_links (future_intention_id);

alter table public.future_intention_links enable row level security;

create policy "future_intention_links_select_own"
on public.future_intention_links
for select
using (
  exists (
    select 1
    from public.future_intentions intention
    where intention.id = future_intention_id
      and intention.user_id = auth.uid()
  )
);

create policy "future_intention_links_insert_own"
on public.future_intention_links
for insert
with check (
  exists (
    select 1
    from public.future_intentions intention
    where intention.id = future_intention_id
      and intention.user_id = auth.uid()
  )
  and (
    review_session_id is null
    or exists (
      select 1 from public.review_sessions session
      where session.id = review_session_id and session.user_id = auth.uid()
    )
  )
  and (
    reflection_pattern_id is null
    or exists (
      select 1 from public.reflection_patterns pattern
      where pattern.id = reflection_pattern_id and pattern.user_id = auth.uid()
    )
  )
  and (
    timeline_event_id is null
    or exists (
      select 1 from public.timeline_events event
      where event.id = timeline_event_id and event.user_id = auth.uid()
    )
  )
);

create policy "future_intention_links_delete_own"
on public.future_intention_links
for delete
using (
  exists (
    select 1
    from public.future_intentions intention
    where intention.id = future_intention_id
      and intention.user_id = auth.uid()
  )
);
