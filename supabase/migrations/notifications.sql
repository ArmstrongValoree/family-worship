create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  household_id uuid references public.households(id)
    on delete cascade not null,
  message text not null,
  created_by uuid references public.profiles(id)
    on delete cascade not null,
  read_by uuid[] default '{}',
  created_at timestamptz default now()
);

alter table public.notifications enable row level security;

create policy "Household members can view their notifications"
  on public.notifications for select
  using (
    household_id in (
      select household_id from public.profiles
      where user_id = auth.uid()
    )
  );

create policy "HH can insert notifications"
  on public.notifications for insert
  with check (
    created_by in (
      select id from public.profiles
      where user_id = auth.uid()
      and role = 'head_of_household'
    )
  );

create policy "Household members can update read_by"
  on public.notifications for update
  using (
    household_id in (
      select household_id from public.profiles
      where user_id = auth.uid()
    )
  )
  with check (
    household_id in (
      select household_id from public.profiles
      where user_id = auth.uid()
    )
  );
