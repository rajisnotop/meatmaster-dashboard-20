-- Grant access to the expenses table for authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON expenses TO authenticated;

-- Grant access to the materialized views and related functions
GRANT SELECT ON materialized view overall_metrics TO authenticated;
GRANT SELECT ON financial_metrics TO authenticated;
GRANT SELECT ON consolidated_data TO authenticated;

-- Grant usage on the sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION refresh_metrics() TO authenticated;