create table if not exists public.import_sources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source_type text not null check (source_type in ('rescuetime', 'notes')),
  display_name text not null check (char_length(display_name) between 1 and 120),
  connection_status text not null default 'not_connected' check (
    connection_status in ('not_connected', 'connected', 'needs_reconnect', 'disconnected', 'failed')
  ),
  last_synced_at timestamptz,
  source_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists import_sources_user_source_type_idx
  on public.import_sources (user_id, source_type);

drop trigger if exists set_import_sources_updated_at on public.import_sources;

create trigger set_import_sources_updated_at
before update on public.import_sources
for each row
execute function public.set_updated_at();

alter table public.import_sources enable row level security;

create policy "import_sources_select_own"
on public.import_sources
for select
using (auth.uid() = user_id);

create policy "import_sources_insert_own"
on public.import_sources
for insert
with check (auth.uid() = user_id);

create policy "import_sources_update_own"
on public.import_sources
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "import_sources_delete_own"
on public.import_sources
for delete
using (auth.uid() = user_id);

create table if not exists public.import_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source_id uuid references public.import_sources(id) on delete set null,
  source_type text not null check (source_type in ('rescuetime', 'notes')),
  source_record_id text,
  source_label text not null check (char_length(source_label) between 1 and 120),
  content_summary text not null check (char_length(content_summary) between 1 and 500),
  source_metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz,
  period_started_at timestamptz,
  period_ended_at timestamptz,
  imported_at timestamptz not null default now(),
  lifecycle_state text not null default 'staged' check (
    lifecycle_state in ('staged', 'attached', 'promoted', 'hidden', 'discarded', 'deleted')
  ),
  sync_status text not null default 'succeeded' check (
    sync_status in ('pending', 'succeeded', 'partial', 'failed', 'duplicate')
  ),
  suggested_date_label text,
  suggested_timeline_event_id uuid references public.timeline_events(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    period_started_at is null
    or period_ended_at is null
    or period_started_at <= period_ended_at
  )
);

create index if not exists import_records_user_lifecycle_idx
  on public.import_records (user_id, lifecycle_state, imported_at desc);

create index if not exists import_records_user_source_idx
  on public.import_records (user_id, source_type, imported_at desc);

create index if not exists import_records_user_occurred_idx
  on public.import_records (user_id, occurred_at);

drop trigger if exists set_import_records_updated_at on public.import_records;

create trigger set_import_records_updated_at
before update on public.import_records
for each row
execute function public.set_updated_at();

alter table public.import_records enable row level security;

create policy "import_records_select_own"
on public.import_records
for select
using (auth.uid() = user_id);

create policy "import_records_insert_own"
on public.import_records
for insert
with check (auth.uid() = user_id);

create policy "import_records_update_own"
on public.import_records
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "import_records_delete_own"
on public.import_records
for delete
using (auth.uid() = user_id);
