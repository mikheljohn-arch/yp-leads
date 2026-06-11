create table if not exists leads (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete cascade not null,
  managing_director text default '',
  title         text default '',
  company_name  text default '',
  address       text default '',
  phone         text default '',
  email         text default '',
  category      text default '',
  status        text default 'new' check (status in ('new','contacted','qualified','closed')),
  notes         text default '',
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

alter table leads enable row level security;

create policy "Users manage their own leads"
  on leads for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);