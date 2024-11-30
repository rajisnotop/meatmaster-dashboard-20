-- Drop existing orders table and related objects
DROP TABLE IF EXISTS public.orders CASCADE;

-- Create new orders table with public access
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customername TEXT,
    productid UUID,
    quantity DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    ispaid BOOLEAN DEFAULT false,
    wasunpaid BOOLEAN DEFAULT true,
    paidwithqr BOOLEAN DEFAULT false
);

-- Enable RLS but make it public
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for everyone
CREATE POLICY "Allow public access" ON public.orders
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Grant access to authenticated and anonymous users
GRANT ALL ON public.orders TO anon;
GRANT ALL ON public.orders TO authenticated;