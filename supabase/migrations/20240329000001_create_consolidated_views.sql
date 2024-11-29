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

-- Create a simple table for overall metrics instead of a materialized view
DROP TABLE IF EXISTS overall_metrics;
CREATE TABLE overall_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    total_orders INTEGER DEFAULT 0,
    total_sales DECIMAL(10,2) DEFAULT 0,
    qr_payments DECIMAL(10,2) DEFAULT 0,
    unpaid_to_qr DECIMAL(10,2) DEFAULT 0,
    total_digital_pay DECIMAL(10,2) DEFAULT 0,
    cash_expenses DECIMAL(10,2) DEFAULT 0,
    online_expenses DECIMAL(10,2) DEFAULT 0,
    total_expenses DECIMAL(10,2) DEFAULT 0
);

-- Disable RLS for overall_metrics
ALTER TABLE overall_metrics DISABLE ROW LEVEL SECURITY;

-- Grant all permissions to both authenticated and anonymous users
GRANT ALL ON overall_metrics TO authenticated;
GRANT ALL ON overall_metrics TO anon;

-- Grant permissions on views
GRANT SELECT ON financial_metrics TO authenticated;
GRANT SELECT ON financial_metrics TO anon;
GRANT SELECT ON consolidated_data TO authenticated;
GRANT SELECT ON consolidated_data TO anon;

-- Insert initial row if needed
INSERT INTO overall_metrics (
    total_orders, total_sales, qr_payments, 
    unpaid_to_qr, total_digital_pay, cash_expenses, 
    online_expenses, total_expenses
) VALUES (0, 0, 0, 0, 0, 0, 0, 0)
ON CONFLICT DO NOTHING;