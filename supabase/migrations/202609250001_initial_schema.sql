create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null default '',
  last_name text not null default '',
  language text not null default 'en'
    check (language in ('en', 'zu', 'af', 'st')),
  updated_at timestamptz not null default now()
);

create table public.journey_stamps (
  user_id uuid not null references auth.users(id) on delete cascade,
  station_id text not null,
  stamped_at timestamptz not null default now(),
  primary key (user_id, station_id)
);

alter table public.profiles enable row level security;
alter table public.journey_stamps enable row level security;

create policy "Users can read their own profile"
  on public.profiles for select
  using ((select auth.uid()) = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check ((select auth.uid()) = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "Users can read their own journey stamps"
  on public.journey_stamps for select
  using ((select auth.uid()) = user_id);

create policy "Users can add their own journey stamps"
  on public.journey_stamps for insert
  with check ((select auth.uid()) = user_id);

create function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, first_name, last_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.create_profile_for_new_user();