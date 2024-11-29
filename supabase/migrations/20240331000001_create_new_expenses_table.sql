CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    description TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    category TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    payment_method TEXT CHECK (payment_method IN ('cash', 'online')) NOT NULL
);

-- Grant access to public
ALTER TABLE public.expenses DISABLE ROW LEVEL SECURITY;
GRANT ALL ON public.expenses TO anon;
GRANT ALL ON public.expenses TO authenticated;