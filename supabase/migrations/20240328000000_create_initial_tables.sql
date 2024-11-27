-- Create products table
create table public.products (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    price numeric not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create orders table
create table public.orders (
    id uuid default gen_random_uuid() primary key,
    customerName text,
    productId uuid references public.products(id),
    quantity numeric not null,
    total numeric not null,
    date timestamp with time zone default timezone('utc'::text, now()) not null,
    isPaid boolean default false,
    paidWithQR boolean default false,
    wasUnpaid boolean default false
);

-- Create expenses table
create table public.expenses (
    id uuid default gen_random_uuid() primary key,
    description text not null,
    amount numeric not null,
    date timestamp with time zone default timezone('utc'::text, now()) not null,
    category text not null,
    paymentMethod text not null
);

-- Enable Row Level Security (RLS)
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.expenses enable row level security;

-- Create policies that allow all operations (for development)
create policy "Enable all operations for products" on public.products
    for all using (true);

create policy "Enable all operations for orders" on public.orders
    for all using (true);

create policy "Enable all operations for expenses" on public.expenses
    for all using (true);