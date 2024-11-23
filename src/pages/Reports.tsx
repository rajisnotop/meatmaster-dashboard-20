import Header from "@/components/Header";
import { useStore } from "@/store/store";
import { FileText, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import RevenueChart from "@/components/RevenueChart";
import TopSellingProducts from "@/components/reports/TopSellingProducts";
import LoyalCustomers from "@/components/reports/LoyalCustomers";
import RecentCustomers from "@/components/reports/RecentCustomers";
import MetricCard from "@/components/reports/MetricCard";
import { DollarSign, TrendingUp, CreditCard, Receipt } from "lucide-react";

const Reports = () => {
  const { orders, expenses } = useStore();

  const totalRevenue = orders.reduce((total, order) => total + order.total, 0);
  const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  // Calculate recent customers
  const recentCustomers = orders
    .filter(order => order.customerName)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
    .map(order => ({
      customerName: order.customerName || "Anonymous",
      date: new Date(order.date),
      total: order.total
    }));

  // Calculate loyal customers data
  const customerFrequency = orders.reduce((acc: Record<string, number>, order) => {
    if (order.customerName) {
      acc[order.customerName] = (acc[order.customerName] || 0) + 1;
    }
    return acc;
  }, {});

  const loyalCustomersData = Object.entries(customerFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }));

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
          <h1 className="text-3xl font-bold text-foreground">Financial Reports</h1>
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
            title="Net Profit"
            value={`NPR ${netProfit.toLocaleString()}`}
          />
          <MetricCard
            icon={CreditCard}
            title="Average Order Value"
            value={`NPR ${orders.length ? Math.round(totalRevenue / orders.length).toLocaleString() : 0}`}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-8">
            <h2 className="text-xl font-bold mb-6">Revenue Trend</h2>
            <RevenueChart />
          </Card>
          <TopSellingProducts />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LoyalCustomers 
            data={loyalCustomersData} 
            colors={['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#10B981']} 
          />
          <RecentCustomers customers={recentCustomers} />
        </div>
      </main>
    </div>
  );
};

export default Reports;