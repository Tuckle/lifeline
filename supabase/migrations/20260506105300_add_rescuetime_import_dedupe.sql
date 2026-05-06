create unique index if not exists import_records_user_source_record_unique_idx
  on public.import_records (user_id, source_type, source_record_id);
