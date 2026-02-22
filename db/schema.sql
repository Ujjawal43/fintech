create extension if not exists "pgcrypto";

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  income numeric not null,
  cibil integer not null,
  employment text not null,
  city text,
  score integer not null,
  status text not null,
  lender_route text not null,
  stage text not null default 'New',
  created_at timestamptz not null default now()
);

create index if not exists leads_created_at_idx on public.leads(created_at desc);
