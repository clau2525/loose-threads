-- Loose Threads — run this once in your Supabase project (SQL Editor → New query → Run).
-- Only needed if you want your phone and laptop to share one pile.

create table if not exists public.threads (
  id      text primary key,
  owner   uuid not null default auth.uid() references auth.users (id) on delete cascade,
  body    text not null,
  created timestamptz not null,
  updated timestamptz not null,
  status  text not null default 'open',
  bucket  text
);

alter table public.threads enable row level security;

-- Each person can only ever see or touch their own rows, even though the
-- anon key in the app is public.
drop policy if exists "own threads" on public.threads;
create policy "own threads" on public.threads
  for all
  to authenticated
  using (owner = auth.uid())
  with check (owner = auth.uid());

create index if not exists threads_owner_updated
  on public.threads (owner, updated);
