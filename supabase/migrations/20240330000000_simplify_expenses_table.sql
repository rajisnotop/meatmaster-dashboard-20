-- Drop the existing materialized view if it exists
DROP MATERIALIZED VIEW IF EXISTS consolidated_expenses;

-- Recreate the expenses table with proper permissions
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    paymentmethod TEXT CHECK (paymentmethod IN ('cash', 'online')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (administrators)
CREATE POLICY "Enable all access for authenticated users" ON public.expenses
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Allow public read-only access
CREATE POLICY "Enable read access for all users" ON public.expenses
    FOR SELECT
    TO anon
    USING (true);

-- Create an updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER expenses_updated_at
    BEFORE UPDATE ON public.expenses
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Grant necessary permissions
GRANT ALL ON public.expenses TO authenticated;
GRANT SELECT ON public.expenses TO anon;