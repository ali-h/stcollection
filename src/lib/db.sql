-- ========== DROP EXISTING TABLES (optional) ==========
drop table if exists orders;
drop table if exists variants;
drop table if exists products;

-- ========== PRODUCTS ==========
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  price numeric(10, 2) not null,
  created_at timestamp with time zone default now()
);

-- ========== VARIANTS ==========
create table variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  size text not null,
  color text not null,
  stock integer not null check (stock >= 0),
  images jsonb not null -- images specific to this color/variant
);

-- ========== ORDERS ==========
create table orders (
  id uuid primary key default gen_random_uuid(),

  -- Customer Info
  full_name text not null,
  email text not null,
  phone text not null,

  -- Address Info
  address_line1 text not null,
  address_line2 text,
  city text not null,
  postal_code text not null,
  province text not null,
  country text not null,

  -- Order Details
  items jsonb not null,  -- array of {product_id, variant_id, name, size, color, quantity, price}
  shipping_cost numeric(10, 2) not null default 0.00,
  notes text,
  created_at timestamp with time zone default now()
);

-- ========== RLS ENABLED ==========
alter table products enable row level security;
alter table variants enable row level security;
alter table orders enable row level security;

-- ========== RLS POLICIES ==========

-- Allow public (anon) to read products
create policy "Public can read products"
on products
for select
to public
using (true);

-- Allow public (anon) to read variants
on variants
for select
to public
using (true);

-- No public access to orders (service key only)
