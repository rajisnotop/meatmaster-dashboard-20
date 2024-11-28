-- Grant access to authenticated users for the materialized views
GRANT ALL ON overall_metrics TO authenticated;

-- Grant access to the refresh functions
GRANT EXECUTE ON FUNCTION refresh_metrics() TO authenticated;

-- Grant access to the views
GRANT SELECT ON consolidated_data TO authenticated;
GRANT SELECT ON financial_metrics TO authenticated;

-- Grant access to base tables
GRANT SELECT ON orders TO authenticated;
GRANT SELECT ON expenses TO authenticated;
GRANT SELECT ON products TO authenticated;