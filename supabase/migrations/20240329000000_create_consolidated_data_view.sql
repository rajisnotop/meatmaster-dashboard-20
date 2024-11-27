-- Create a view that consolidates all the data
CREATE OR REPLACE VIEW consolidated_data AS
SELECT 
    p.name as product_name,
    COUNT(o.id) as total_orders,
    SUM(o.total) as total_sales,
    SUM(CASE WHEN o.paidwithqr THEN o.total ELSE 0 END) as paid_with_qr,
    SUM(CASE WHEN o.wasunpaid AND NOT o.paidwithqr THEN o.total ELSE 0 END) as unpaid_to_paid,
    SUM(CASE WHEN o.wasunpaid AND o.paidwithqr THEN o.total ELSE 0 END) as unpaid_to_paid_qr,
    SUM(o.quantity) as quantity_sold
FROM products p
LEFT JOIN orders o ON p.id = o.productid
GROUP BY p.name;

-- Create a materialized view for performance
CREATE MATERIALIZED VIEW consolidated_metrics AS
SELECT
    SUM(total) as total_sales,
    COUNT(*) as total_orders,
    SUM(CASE WHEN paidwithqr THEN total ELSE 0 END) as qr_payments,
    SUM(CASE WHEN wasunpaid AND paidwithqr THEN total ELSE 0 END) as unpaid_to_qr,
    SUM(CASE WHEN paidwithqr OR (wasunpaid AND paidwithqr) THEN total ELSE 0 END) as total_digital_pay
FROM orders;

-- Create a function to refresh the materialized view
CREATE OR REPLACE FUNCTION refresh_consolidated_metrics()
RETURNS TRIGGER AS $$
BEGIN
    REFRESH MATERIALIZED VIEW consolidated_metrics;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to refresh the materialized view
CREATE TRIGGER refresh_consolidated_metrics_trigger
AFTER INSERT OR UPDATE OR DELETE ON orders
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_consolidated_metrics();

-- Grant access to the views
GRANT SELECT ON consolidated_data TO authenticated;
GRANT SELECT ON consolidated_metrics TO authenticated;