alter table public.timeline_events
  add column if not exists photo_reference_url text,
  add column if not exists photo_alt_text text;

alter table public.timeline_events
  add constraint timeline_events_photo_reference_url_length
  check (
    photo_reference_url is null
    or char_length(photo_reference_url) <= 2048
  );

alter table public.timeline_events
  add constraint timeline_events_photo_alt_text_length
  check (
    photo_alt_text is null
    or char_length(photo_alt_text) <= 240
  );
