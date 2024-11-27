-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    stock INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customerName TEXT,
    productId UUID REFERENCES public.products(id),
    quantity NUMERIC NOT NULL,
    total NUMERIC NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    isPaid BOOLEAN DEFAULT false,
    paidWithQR BOOLEAN DEFAULT false,
    wasUnpaid BOOLEAN DEFAULT false
);

-- Create expenses table
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    description TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    category TEXT NOT NULL,
    paymentMethod TEXT NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Create policies that allow all operations (for development)
CREATE POLICY "Enable all operations for products" ON public.products
    FOR ALL USING (true);

CREATE POLICY "Enable all operations for orders" ON public.orders
    FOR ALL USING (true);

CREATE POLICY "Enable all operations for expenses" ON public.expenses
    FOR ALL USING (true);

-- Grant access to authenticated and anonymous users
GRANT ALL ON public.products TO anon, authenticated;
GRANT ALL ON public.orders TO anon, authenticated;
GRANT ALL ON public.expenses TO anon, authenticated;