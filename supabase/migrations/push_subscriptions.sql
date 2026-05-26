create table public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id)
    on delete cascade not null unique,
  subscription jsonb not null,
  created_at timestamptz default now()
);

alter table public.push_subscriptions enable row level security;

create policy "Users can manage their own subscription"
  on public.push_subscriptions for all
  using (
    profile_id in (
      select id from public.profiles where user_id = auth.uid()
    )
  );
