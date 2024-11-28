-- Drop existing permissions to clean up
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

-- Grant necessary permissions on the expenses table
GRANT SELECT, INSERT, UPDATE, DELETE ON expenses TO authenticated;

-- Grant permissions on materialized views
GRANT SELECT ON overall_metrics TO authenticated;

-- Grant permissions on views
GRANT SELECT ON financial_metrics TO authenticated;
GRANT SELECT ON consolidated_data TO authenticated;

-- Grant permissions on sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION refresh_metrics() TO authenticated;