-- Run this in Supabase SQL Editor for a fresh project.
-- It creates the tables used by favorites and property inquiries.

create extension if not exists pgcrypto;

create table if not exists public.saved_properties (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  property_id integer not null,
  property_title text not null,
  property_location text not null,
  property_price bigint not null,
  property_type text not null,
  property_image text not null,
  property_bedrooms integer not null default 0,
  property_bathrooms integer not null default 0,
  property_sqft integer not null default 0,
  created_at timestamptz not null default now(),
  unique (user_id, property_id)
);

create index if not exists saved_properties_user_id_idx on public.saved_properties (user_id);
create index if not exists saved_properties_property_id_idx on public.saved_properties (property_id);

alter table public.saved_properties enable row level security;

drop policy if exists "Saved properties are viewable by owner" on public.saved_properties;
create policy "Saved properties are viewable by owner"
on public.saved_properties
for select
using (auth.uid() = user_id);

drop policy if exists "Saved properties are insertable by owner" on public.saved_properties;
create policy "Saved properties are insertable by owner"
on public.saved_properties
for insert
with check (auth.uid() = user_id);

drop policy if exists "Saved properties are deletable by owner" on public.saved_properties;
create policy "Saved properties are deletable by owner"
on public.saved_properties
for delete
using (auth.uid() = user_id);

create table if not exists public.property_inquiries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  property_id integer not null,
  property_title text not null,
  property_location text not null,
  agent_id integer,
  agent_name text,
  inquirer_name text not null,
  inquirer_email text not null,
  inquirer_phone text,
  message text,
  status text not null default 'pending' check (status in ('pending', 'contacted', 'resolved', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists property_inquiries_user_id_idx on public.property_inquiries (user_id);
create index if not exists property_inquiries_property_id_idx on public.property_inquiries (property_id);

alter table public.property_inquiries enable row level security;

drop policy if exists "Inquiries are viewable by owner" on public.property_inquiries;
create policy "Inquiries are viewable by owner"
on public.property_inquiries
for select
using (auth.uid() = user_id);

drop policy if exists "Inquiries are insertable by anyone" on public.property_inquiries;
create policy "Inquiries are insertable by anyone"
on public.property_inquiries
for insert
with check (user_id is null or auth.uid() = user_id);

-- Optional: keep updated_at current when rows are updated.
create or replace function public.set_property_inquiries_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_property_inquiries_updated_at on public.property_inquiries;
create trigger trg_property_inquiries_updated_at
before update on public.property_inquiries
for each row
execute function public.set_property_inquiries_updated_at();

create table if not exists public.contact_leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  full_name text not null,
  email text not null,
  phone text not null,
  purpose text not null check (purpose in ('buy', 'rent', 'invest')),
  preferred_locations text,
  property_type text,
  budget_min bigint,
  budget_max bigint,
  bedrooms integer,
  timeline text,
  preferred_contact_method text check (preferred_contact_method in ('phone', 'email', 'whatsapp')),
  message text,
  source text not null default 'website_contact_form',
  status text not null default 'new' check (status in ('new', 'assigned', 'contacted', 'qualified', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists contact_leads_created_at_idx on public.contact_leads (created_at desc);
create index if not exists contact_leads_status_idx on public.contact_leads (status);
create index if not exists contact_leads_user_id_idx on public.contact_leads (user_id);

alter table public.contact_leads enable row level security;

drop policy if exists "Contact leads are insertable by anyone" on public.contact_leads;
drop policy if exists "Contact leads insert anon" on public.contact_leads;
drop policy if exists "Contact leads insert authenticated" on public.contact_leads;
create policy "Contact leads insert anon"
on public.contact_leads
for insert
to anon
with check (user_id is null);

create policy "Contact leads insert authenticated"
on public.contact_leads
for insert
to authenticated
with check (user_id is null or auth.uid() = user_id);

drop policy if exists "Contact leads are viewable by owner" on public.contact_leads;
create policy "Contact leads are viewable by owner"
on public.contact_leads
for select
to authenticated
using (auth.uid() = user_id);

create or replace function public.set_contact_leads_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_contact_leads_updated_at on public.contact_leads;
create trigger trg_contact_leads_updated_at
before update on public.contact_leads
for each row
execute function public.set_contact_leads_updated_at();

grant usage on schema public to anon, authenticated;
grant insert on table public.contact_leads to anon, authenticated;
grant select on table public.contact_leads to authenticated;

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  status text not null default 'active' check (status in ('active', 'unsubscribed')),
  source text not null default 'website_footer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists newsletter_subscribers_status_idx on public.newsletter_subscribers (status);
create index if not exists newsletter_subscribers_created_at_idx on public.newsletter_subscribers (created_at desc);

alter table public.newsletter_subscribers enable row level security;

drop policy if exists "Newsletter subscribe insert anon" on public.newsletter_subscribers;
drop policy if exists "Newsletter subscribe insert authenticated" on public.newsletter_subscribers;
create policy "Newsletter subscribe insert anon"
on public.newsletter_subscribers
for insert
to anon
with check (true);

create policy "Newsletter subscribe insert authenticated"
on public.newsletter_subscribers
for insert
to authenticated
with check (true);

create or replace function public.set_newsletter_subscribers_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_newsletter_subscribers_updated_at on public.newsletter_subscribers;
create trigger trg_newsletter_subscribers_updated_at
before update on public.newsletter_subscribers
for each row
execute function public.set_newsletter_subscribers_updated_at();

grant insert on table public.newsletter_subscribers to anon, authenticated;
