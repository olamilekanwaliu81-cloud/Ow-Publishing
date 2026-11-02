-- ============================================================
-- OW Publishing House — CMS database schema
-- Run this ONCE in Supabase → SQL Editor → New query → Run.
-- Safe to re-run (uses IF NOT EXISTS / ON CONFLICT where possible).
-- ============================================================

-- ---------- Tables ----------
create table if not exists public.books (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz default now(),
  title        text not null,
  author       text,
  cover_url    text,
  category     text,
  description  text,
  status       text default 'published',   -- 'published' | 'coming_soon'
  buy_amazon   text,
  buy_ingram   text,
  buy_bookshop text,
  sort_order   int default 0
);

create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz default now(),
  name        text not null,
  book_title  text,
  quote       text not null,
  rating      numeric default 5,           -- 0..5
  source      text default 'fiverr',       -- 'fiverr' | 'google'
  link        text,
  sort_order  int default 0
);

create table if not exists public.posts (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz default now(),
  title          text not null,
  slug           text,
  excerpt        text,
  body           text,
  cover_url      text,
  published      boolean default true,
  published_date date default current_date,
  sort_order     int default 0
);

create table if not exists public.team (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz default now(),
  name        text not null,
  role        text,
  photo_url   text,
  bio         text,
  linkedin    text,
  sort_order  int default 0
);

-- ---------- Row Level Security ----------
-- Public can READ everything (so the website can display it).
-- Only a logged-in admin can INSERT / UPDATE / DELETE.
do $$
declare t text;
begin
  foreach t in array array['books','reviews','posts','team'] loop
    execute format('alter table public.%I enable row level security;', t);
    execute format('drop policy if exists "%s_read"   on public.%I;', t, t);
    execute format('drop policy if exists "%s_insert" on public.%I;', t, t);
    execute format('drop policy if exists "%s_update" on public.%I;', t, t);
    execute format('drop policy if exists "%s_delete" on public.%I;', t, t);
    execute format('create policy "%s_read"   on public.%I for select using (true);', t, t);
    execute format('create policy "%s_insert" on public.%I for insert to authenticated with check (true);', t, t);
    execute format('create policy "%s_update" on public.%I for update to authenticated using (true) with check (true);', t, t);
    execute format('create policy "%s_delete" on public.%I for delete to authenticated using (true);', t, t);
  end loop;
end $$;

-- ---------- Storage bucket for images (covers, photos, blog art) ----------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media_read"   on storage.objects;
drop policy if exists "media_insert" on storage.objects;
drop policy if exists "media_update" on storage.objects;
drop policy if exists "media_delete" on storage.objects;
create policy "media_read"   on storage.objects for select using (bucket_id = 'media');
create policy "media_insert" on storage.objects for insert to authenticated with check (bucket_id = 'media');
create policy "media_update" on storage.objects for update to authenticated using (bucket_id = 'media');
create policy "media_delete" on storage.objects for delete to authenticated using (bucket_id = 'media');

-- Done. Next: create your admin user in Authentication → Users (see CMS-SETUP.md).
