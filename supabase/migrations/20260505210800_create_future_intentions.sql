create table if not exists public.future_intentions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 180),
  target_on date,
  target_label text,
  status text not null default 'active' check (
    status in ('active', 'completed', 'deferred', 'archived')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists future_intentions_user_target_on_idx
  on public.future_intentions (user_id, target_on);

drop trigger if exists set_future_intentions_updated_at on public.future_intentions;

create trigger set_future_intentions_updated_at
before update on public.future_intentions
for each row
execute function public.set_updated_at();

alter table public.future_intentions enable row level security;

create policy "future_intentions_select_own"
on public.future_intentions
for select
using (auth.uid() = user_id);

create policy "future_intentions_insert_own"
on public.future_intentions
for insert
with check (auth.uid() = user_id);

create policy "future_intentions_update_own"
on public.future_intentions
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "future_intentions_delete_own"
on public.future_intentions
for delete
using (auth.uid() = user_id);
