-- Hatchling — initial schema.
-- Run this once in Supabase Studio (SQL editor) for your project.

-- Profile / progress per user. One row per auth.users row.
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,

  -- Chapter progress
  completed jsonb default '[]'::jsonb,           -- number[]
  xp int default 0,
  stars jsonb default '{}'::jsonb,                -- { [chapterId]: 1..3 }
  attempts jsonb default '{}'::jsonb,             -- { [chapterId]: int }
  streak int default 0,
  best_streak int default 0,
  last_chapter int,
  started_at bigint,

  -- Daily challenge state
  daily_history jsonb default '{}'::jsonb,        -- { [dateKey]: { correct, total, perfect } }
  daily_streak int default 0,
  daily_best_streak int default 0,
  daily_last_perfect text,

  -- Boss rush state
  boss_runs jsonb default '[]'::jsonb,            -- last 10 runs
  boss_best jsonb,                                -- single best run

  updated_at timestamptz default now()
);

-- Trigger: keep updated_at fresh
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists profiles_touch on public.profiles;
create trigger profiles_touch
  before update on public.profiles
  for each row execute function public.touch_updated_at();

-- Auto-create empty profile on user signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (user_id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name', null))
  on conflict (user_id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Row-level security: each user only ever sees their own profile
alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = user_id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = user_id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = user_id);

drop policy if exists "profiles_delete_own" on public.profiles;
create policy "profiles_delete_own"
  on public.profiles for delete
  using (auth.uid() = user_id);
