-- Run in Supabase SQL Editor after schema.sql

create table if not exists public.saved_addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  label text not null default 'Home',
  is_default boolean not null default false,
  full_name text not null,
  email text not null,
  phone text not null,
  address_line1 text not null,
  address_line2 text default '',
  city text not null,
  state text not null,
  pincode text not null,
  country text not null default 'India',
  created_at timestamptz not null default now()
);

create index if not exists saved_addresses_user_id_idx on public.saved_addresses (user_id);

alter table public.saved_addresses enable row level security;

create policy "Users manage own addresses"
  on public.saved_addresses for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
