-- Create a view that consolidates all financial data
CREATE OR REPLACE VIEW financial_metrics AS
SELECT 
    p.name as product_name,
    COUNT(o.id) as total_orders,
    SUM(o.total) as total_sales,
    SUM(CASE WHEN o.paidwithqr THEN o.total ELSE 0 END) as qr_payments,
    SUM(CASE WHEN o.wasunpaid AND NOT o.paidwithqr THEN o.total ELSE 0 END) as unpaid_to_paid,
    SUM(CASE WHEN o.wasunpaid AND o.paidwithqr THEN o.total ELSE 0 END) as unpaid_to_paid_qr,
    SUM(o.quantity) as quantity_sold
FROM products p
LEFT JOIN orders o ON p.id = o.productid
GROUP BY p.name;

-- Create a materialized view for overall metrics
CREATE MATERIALIZED VIEW overall_metrics AS
SELECT
    COUNT(DISTINCT o.id) as total_orders,
    SUM(o.total) as total_sales,
    SUM(CASE WHEN o.paidwithqr THEN o.total ELSE 0 END) as qr_payments,
    SUM(CASE WHEN o.wasunpaid AND o.paidwithqr THEN o.total ELSE 0 END) as unpaid_to_qr,
    SUM(CASE WHEN o.paidwithqr OR (o.wasunpaid AND o.paidwithqr) THEN o.total ELSE 0 END) as total_digital_pay,
    (SELECT SUM(amount) FROM expenses WHERE paymentmethod = 'cash') as cash_expenses,
    (SELECT SUM(amount) FROM expenses WHERE paymentmethod = 'online') as online_expenses,
    (SELECT SUM(amount) FROM expenses) as total_expenses
FROM orders o;

-- Create a refresh function
CREATE OR REPLACE FUNCTION refresh_metrics()
RETURNS TRIGGER AS $$
BEGIN
    REFRESH MATERIALIZED VIEW overall_metrics;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to refresh the materialized view
CREATE TRIGGER refresh_metrics_orders
AFTER INSERT OR UPDATE OR DELETE ON orders
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_metrics();

CREATE TRIGGER refresh_metrics_expenses
AFTER INSERT OR UPDATE OR DELETE ON expenses
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_metrics();