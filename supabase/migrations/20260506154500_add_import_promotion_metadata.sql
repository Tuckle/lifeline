alter table public.timeline_events
  drop constraint if exists timeline_events_source_type_check;

alter table public.timeline_events
  add constraint timeline_events_source_type_check
  check (source_type in ('manual', 'imported'));

alter table public.timeline_events
  add column if not exists source_import_record_id uuid references public.import_records(id) on delete set null,
  add column if not exists source_metadata jsonb not null default '{}'::jsonb;

create index if not exists timeline_events_source_import_record_idx
  on public.timeline_events (source_import_record_id);
