-- Drop the existing materialized view if it exists
DROP MATERIALIZED VIEW IF EXISTS consolidated_expenses;

-- Create a simple expenses table without RLS
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    paymentmethod TEXT CHECK (paymentmethod IN ('cash', 'online')) NOT NULL
);

-- Disable RLS to allow public access
ALTER TABLE public.expenses DISABLE ROW LEVEL SECURITY;

-- Grant all permissions to public access
GRANT ALL ON public.expenses TO anon;
GRANT ALL ON public.expenses TO authenticated;