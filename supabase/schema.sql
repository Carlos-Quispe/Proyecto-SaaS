-- Stock Manager SaaS - Supabase schema
-- Ejecuta este archivo en el SQL Editor de Supabase.

create extension if not exists pgcrypto;

create table if not exists public.tenants (
  id text primary key,
  name text not null,
  tagline text,
  color text,
  gradient text,
  avatar text,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  tenant_id text not null references public.tenants(id) on delete restrict,
  username text unique,
  name text not null,
  email text not null,
  role text not null check (role in ('admin', 'seller')),
  avatar text,
  status text not null default 'active' check (status in ('active', 'inactive')),
  last_login timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  tenant_id text not null references public.tenants(id) on delete cascade,
  name text not null,
  sku text not null,
  description text,
  category text not null,
  price numeric(12,2) not null default 0,
  cost numeric(12,2) not null default 0,
  stock integer not null default 0,
  min_stock integer not null default 0,
  image_url text,
  brand text,
  is_active boolean not null default true,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, sku)
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  tenant_id text not null references public.tenants(id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  type text not null default 'Individual',
  status text not null default 'active' check (status in ('active', 'inactive')),
  total_purchases numeric(12,2) not null default 0,
  last_purchase date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sales (
  id uuid primary key default gen_random_uuid(),
  tenant_id text not null references public.tenants(id) on delete cascade,
  seller_id uuid references public.profiles(id) on delete set null,
  seller_name text not null,
  total_amount numeric(12,2) not null default 0,
  payment_method text not null default 'cash',
  status text not null default 'pending' check (status in ('completed', 'pending', 'cancelled', 'refunded')),
  notes text,
  sale_date timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.sale_items (
  id uuid primary key default gen_random_uuid(),
  sale_id uuid not null references public.sales(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  quantity integer not null default 1,
  unit_price numeric(12,2) not null default 0,
  subtotal numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_profiles_tenant on public.profiles(tenant_id);
create index if not exists idx_products_tenant on public.products(tenant_id);
create index if not exists idx_clients_tenant on public.clients(tenant_id);
create index if not exists idx_sales_tenant_date on public.sales(tenant_id, sale_date desc);
create index if not exists idx_sale_items_sale on public.sale_items(sale_id);

insert into public.tenants (id, name, tagline, color, gradient, avatar)
values
  (
    'tenant_techstore_alpha',
    'TechStore Alpha',
    'Premium Consumer Electronics',
    '#6366f1',
    'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)',
    'A'
  ),
  (
    'tenant_techstore_beta',
    'TechStore Beta',
    'Enterprise & Gaming Solutions',
    '#06b6d4',
    'linear-gradient(135deg, #06b6d4 0%, #0891b2 50%, #0e7490 100%)',
    'B'
  )
on conflict (id) do update set
  name = excluded.name,
  tagline = excluded.tagline,
  color = excluded.color,
  gradient = excluded.gradient,
  avatar = excluded.avatar;

alter table public.tenants enable row level security;
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.clients enable row level security;
alter table public.sales enable row level security;
alter table public.sale_items enable row level security;

create schema if not exists private;

create or replace function private.current_user_tenant_id()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select tenant_id from public.profiles where id = auth.uid() and status = 'active'
$$;

create or replace function private.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid() and status = 'active'
$$;

grant usage on schema private to authenticated;
grant execute on function private.current_user_tenant_id() to authenticated;
grant execute on function private.current_user_role() to authenticated;

drop policy if exists "tenants read own tenant" on public.tenants;
create policy "tenants read own tenant"
on public.tenants for select
to authenticated
using (id = private.current_user_tenant_id());

drop policy if exists "profiles read own tenant" on public.profiles;
create policy "profiles read own tenant"
on public.profiles for select
to authenticated
using (tenant_id = private.current_user_tenant_id());

drop policy if exists "profiles admin update own tenant" on public.profiles;
create policy "profiles admin update own tenant"
on public.profiles for update
to authenticated
using (tenant_id = private.current_user_tenant_id() and private.current_user_role() = 'admin')
with check (tenant_id = private.current_user_tenant_id() and private.current_user_role() = 'admin');

drop policy if exists "products read own tenant" on public.products;
create policy "products read own tenant"
on public.products for select
to authenticated
using (tenant_id = private.current_user_tenant_id());

drop policy if exists "products admin insert own tenant" on public.products;
create policy "products admin insert own tenant"
on public.products for insert
to authenticated
with check (tenant_id = private.current_user_tenant_id() and private.current_user_role() = 'admin');

drop policy if exists "products admin update own tenant" on public.products;
create policy "products admin update own tenant"
on public.products for update
to authenticated
using (tenant_id = private.current_user_tenant_id() and private.current_user_role() = 'admin')
with check (tenant_id = private.current_user_tenant_id() and private.current_user_role() = 'admin');

drop policy if exists "products admin delete own tenant" on public.products;
create policy "products admin delete own tenant"
on public.products for delete
to authenticated
using (tenant_id = private.current_user_tenant_id() and private.current_user_role() = 'admin');

drop policy if exists "clients read own tenant" on public.clients;
create policy "clients read own tenant"
on public.clients for select
to authenticated
using (tenant_id = private.current_user_tenant_id());

drop policy if exists "clients admin write own tenant" on public.clients;
create policy "clients admin write own tenant"
on public.clients for all
to authenticated
using (tenant_id = private.current_user_tenant_id() and private.current_user_role() = 'admin')
with check (tenant_id = private.current_user_tenant_id() and private.current_user_role() = 'admin');

drop policy if exists "sales read own tenant" on public.sales;
create policy "sales read own tenant"
on public.sales for select
to authenticated
using (tenant_id = private.current_user_tenant_id());

drop policy if exists "sales insert own tenant" on public.sales;
create policy "sales insert own tenant"
on public.sales for insert
to authenticated
with check (tenant_id = private.current_user_tenant_id());

drop policy if exists "sales admin delete own tenant" on public.sales;
create policy "sales admin delete own tenant"
on public.sales for delete
to authenticated
using (tenant_id = private.current_user_tenant_id() and private.current_user_role() = 'admin');

drop policy if exists "sale items read own tenant" on public.sale_items;
create policy "sale items read own tenant"
on public.sale_items for select
to authenticated
using (
  exists (
    select 1 from public.sales
    where sales.id = sale_items.sale_id
      and sales.tenant_id = private.current_user_tenant_id()
  )
);

drop policy if exists "sale items insert own tenant" on public.sale_items;
create policy "sale items insert own tenant"
on public.sale_items for insert
to authenticated
with check (
  exists (
    select 1 from public.sales
    where sales.id = sale_items.sale_id
      and sales.tenant_id = private.current_user_tenant_id()
  )
);

drop policy if exists "sale items admin delete own tenant" on public.sale_items;
create policy "sale items admin delete own tenant"
on public.sale_items for delete
to authenticated
using (
  private.current_user_role() = 'admin'
  and exists (
    select 1 from public.sales
    where sales.id = sale_items.sale_id
      and sales.tenant_id = private.current_user_tenant_id()
  )
);
