import Header from "@/components/Header";
import { useStore } from "@/store/store";
import { FileText, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import TopSellingProducts from "@/components/reports/TopSellingProducts";
import LoyalCustomers from "@/components/reports/LoyalCustomers";
import RecentCustomers from "@/components/reports/RecentCustomers";
import MetricCard from "@/components/reports/MetricCard";
import ProfitTrendsChart from "@/components/reports/ProfitTrendsChart";
import ProductPerformance from "@/components/reports/ProductPerformance";
import { calculateMonthlyTrends, calculateProductPerformance } from "@/utils/analyticsCalculations";

const Reports = () => {
  const { orders, products, expenses } = useStore();

  const totalRevenue = orders.reduce((total, order) => total + order.total, 0);
  const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);
  const netProfit = totalRevenue - totalExpenses;
  const averageOrderValue = orders.length ? Math.round(totalRevenue / orders.length) : 0;

  const monthlyTrends = calculateMonthlyTrends(orders, expenses);
  const productPerformance = calculateProductPerformance(products, orders);

  const handlePrintReport = () => {
    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast({
          title: "Error",
          description: "Please allow pop-ups to print the report",
          variant: "destructive",
        });
        return;
      }

      printWindow.document.write(`
        <html>
          <head>
            <title>Financial Report</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .section { margin-bottom: 20px; }
              .metric { margin: 10px 0; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Financial Report</h1>
              <p>Generated on ${new Date().toLocaleDateString()}</p>
            </div>
            <div class="section">
              <h2>Financial Summary</h2>
              <div class="metric">Total Revenue: NPR ${totalRevenue.toLocaleString()}</div>
              <div class="metric">Total Expenses: NPR ${totalExpenses.toLocaleString()}</div>
              <div class="metric">Net Profit: NPR ${netProfit.toLocaleString()}</div>
            </div>
          </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.print();
      
      toast({
        title: "Success",
        description: "Report sent to printer",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8 space-y-8 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Financial Reports</h1>
            <p className="text-muted-foreground mt-1">
              Generated on {format(new Date(), "MMMM dd, yyyy")}
            </p>
          </div>
          <Button 
            variant="outline" 
            className="hover:bg-primary/20"
            onClick={handlePrintReport}
          >
            <Printer className="w-4 h-4 mr-2" />
            Print Report
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            icon={DollarSign}
            title="Total Revenue"
            value={`NPR ${totalRevenue.toLocaleString()}`}
          />
          <MetricCard
            icon={Receipt}
            title="Total Expenses"
            value={`NPR ${totalExpenses.toLocaleString()}`}
          />
          <MetricCard
            icon={TrendingUp}
            title="Net Amount"
            value={`NPR ${netProfit.toLocaleString()}`}
          />
          <MetricCard
            icon={CreditCard}
            title="Average Order"
            value={`NPR ${averageOrderValue.toLocaleString()}`}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProfitTrendsChart data={monthlyTrends} />
          <ProductPerformance data={productPerformance} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentCustomers customers={recentCustomers} />
          <TopSellingProducts />
        </div>
      </main>
    </div>
  );
};

export default Reports;
