import Header from "@/components/Header";
import { useStore } from "@/store/store";
import { FileText, Printer, Users, Package, TrendingUp, DollarSign, CreditCard, Receipt, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import TopSellingProducts from "@/components/reports/TopSellingProducts";
import LoyalCustomers from "@/components/reports/LoyalCustomers";
import RecentCustomers from "@/components/reports/RecentCustomers";
import MetricCard from "@/components/reports/MetricCard";

const Reports = () => {
  const { orders, expenses } = useStore();

  const totalRevenue = orders.reduce((total, order) => total + order.total, 0);
  const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);
  const netProfit = totalRevenue - totalExpenses;
  const averageOrderValue = orders.length ? Math.round(totalRevenue / orders.length) : 0;
  const totalOrders = orders.length;
  const totalCustomers = new Set(orders.map(order => order.customerName)).size;

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
      <div className="flex">
        <main className="flex-1 p-8 space-y-8 animate-fade-in">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold gradient-text">Financial Reports</h1>
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="dashboard-card">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Order Statistics</h2>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                  <span className="text-muted-foreground">Total Orders</span>
                  <span className="font-medium">{totalOrders}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                  <span className="text-muted-foreground">Total Customers</span>
                  <span className="font-medium">{totalCustomers}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                  <span className="text-muted-foreground">Average Daily Orders</span>
                  <span className="font-medium">
                    {Math.round(totalOrders / Math.max(1, Math.ceil((Date.now() - new Date(orders[0]?.date || Date.now()).getTime()) / (1000 * 60 * 60 * 24))))}
                  </span>
                </div>
              </div>
            </Card>

            <div className="lg:col-span-2">
              <TopSellingProducts />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentCustomers customers={recentCustomers} />
            <Card className="dashboard-card">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Monthly Summary</h2>
              </div>
              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  {Array.from({ length: 6 }).map((_, index) => {
                    const date = new Date();
                    date.setMonth(date.getMonth() - index);
                    const monthOrders = orders.filter(order => 
                      new Date(order.date).getMonth() === date.getMonth() &&
                      new Date(order.date).getFullYear() === date.getFullYear()
                    );
                    const monthRevenue = monthOrders.reduce((sum, order) => sum + order.total, 0);
                    
                    return (
                      <div key={index} className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                        <span className="text-muted-foreground">{format(date, 'MMMM yyyy')}</span>
                        <div className="text-right">
                          <div className="font-medium">NPR {monthRevenue.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">{monthOrders.length} orders</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reports;