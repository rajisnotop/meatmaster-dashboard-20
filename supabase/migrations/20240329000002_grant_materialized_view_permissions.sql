-- Grant access to authenticated users for the materialized views
GRANT SELECT ON materialized view overall_metrics TO authenticated;
GRANT SELECT ON materialized view consolidated_metrics TO authenticated;

-- Grant access to the refresh functions
GRANT EXECUTE ON FUNCTION refresh_metrics() TO authenticated;
GRANT EXECUTE ON FUNCTION refresh_consolidated_metrics() TO authenticated;

-- Grant access to the views
GRANT SELECT ON consolidated_data TO authenticated;
GRANT SELECT ON financial_metrics TO authenticated;

-- Ensure authenticated users can select from the base tables
GRANT SELECT ON orders TO authenticated;
GRANT SELECT ON expenses TO authenticated;
GRANT SELECT ON products TO authenticated;