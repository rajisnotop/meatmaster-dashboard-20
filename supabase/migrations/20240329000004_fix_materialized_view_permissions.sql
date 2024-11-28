-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON expenses;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON expenses;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON expenses;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON expenses;

-- Enable RLS
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Create policies for expenses table
CREATE POLICY "Enable read access for authenticated users"
ON expenses FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert access for authenticated users"
ON expenses FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
ON expenses FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete access for authenticated users"
ON expenses FOR DELETE
TO authenticated
USING (true);

-- Grant ALL permissions
GRANT ALL ON expenses TO authenticated;
GRANT ALL ON overall_metrics TO authenticated;
GRANT ALL ON overall_metrics TO postgres;

-- Grant SELECT permissions on views
GRANT SELECT ON financial_metrics TO authenticated;
GRANT SELECT ON consolidated_data TO authenticated;

-- Grant permissions on sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION refresh_metrics() TO authenticated;

-- Ensure postgres user has all necessary permissions
ALTER MATERIALIZED VIEW overall_metrics OWNER TO postgres;