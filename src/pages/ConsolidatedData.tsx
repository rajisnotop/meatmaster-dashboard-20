import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

interface FinancialMetric {
  product_name: string;
  total_orders: number;
  total_sales: number;
  qr_payments: number;
  unpaid_to_paid: number;
  unpaid_to_paid_qr: number;
  quantity_sold: number;
}

interface OverallMetrics {
  total_orders: number;
  total_sales: number;
  qr_payments: number;
  unpaid_to_qr: number;
  total_digital_pay: number;
  cash_expenses: number;
  online_expenses: number;
  total_expenses: number;
}

const ConsolidatedData = () => {
  const [financialMetrics, setFinancialMetrics] = useState<FinancialMetric[]>([]);
  const [overallMetrics, setOverallMetrics] = useState<OverallMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [financialRes, overallRes] = await Promise.all([
          supabase.from('financial_metrics').select('*'),
          supabase.from('overall_metrics').select('*').single()
        ]);

        if (financialRes.error) throw financialRes.error;
        if (overallRes.error) throw overallRes.error;

        setFinancialMetrics(financialRes.data);
        setOverallMetrics(overallRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const cashInCounter = overallMetrics ? 
    (overallMetrics.total_sales - overallMetrics.cash_expenses) : 0;
  
  const cashInBank = overallMetrics ? 
    (overallMetrics.total_digital_pay - overallMetrics.online_expenses) : 0;

  const netAmount = overallMetrics ? 
    (overallMetrics.total_sales + overallMetrics.total_digital_pay - overallMetrics.total_expenses) : 0;

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Consolidated Financial Data</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Sales Overview</h3>
          <div className="space-y-2">
            <p>Total Sales: NPR {overallMetrics?.total_sales.toLocaleString()}</p>
            <p>Total Orders: {overallMetrics?.total_orders}</p>
            <p>QR Payments: NPR {overallMetrics?.qr_payments.toLocaleString()}</p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-2">Expenses</h3>
          <div className="space-y-2">
            <p>Total Expenses: NPR {overallMetrics?.total_expenses.toLocaleString()}</p>
            <p>Cash Expenses: NPR {overallMetrics?.cash_expenses.toLocaleString()}</p>
            <p>Online Expenses: NPR {overallMetrics?.online_expenses.toLocaleString()}</p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-2">Financial Summary</h3>
          <div className="space-y-2">
            <p>Cash in Counter: NPR {cashInCounter.toLocaleString()}</p>
            <p>Cash in Bank: NPR {cashInBank.toLocaleString()}</p>
            <p>Net Amount: NPR {netAmount.toLocaleString()}</p>
          </div>
        </Card>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Total Sales</TableHead>
              <TableHead className="text-right">QR Payments</TableHead>
              <TableHead className="text-right">Unpaid to Paid</TableHead>
              <TableHead className="text-right">Unpaid to QR</TableHead>
              <TableHead className="text-right">Quantity Sold</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {financialMetrics.map((metric) => (
              <TableRow key={metric.product_name}>
                <TableCell>{metric.product_name}</TableCell>
                <TableCell className="text-right">
                  {metric.total_sales.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {metric.qr_payments.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {metric.unpaid_to_paid.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {metric.unpaid_to_paid_qr.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {metric.quantity_sold}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ConsolidatedData;