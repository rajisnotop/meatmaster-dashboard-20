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

-- Grant permissions on views
GRANT SELECT ON financial_metrics TO authenticated;
GRANT SELECT ON financial_metrics TO anon;