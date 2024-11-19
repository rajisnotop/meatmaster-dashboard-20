import Header from "@/components/Header";
import { useStore } from "@/store/store";
import { FileText, Printer, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import MetricCard from "@/components/reports/MetricCard";
import TopProducts from "@/components/reports/TopProducts";
import LoyalCustomers from "@/components/reports/LoyalCustomers";
import RecentCustomers from "@/components/reports/RecentCustomers";
import RevenueChart from "@/components/RevenueChart";

const Reports = () => {
  const { orders, products } = useStore();

  const totalRevenue = orders.reduce((total, order) => total + order.total, 0);
  const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

  // Process orders to get product sales data
  const productSales = orders.reduce((acc: { [key: string]: number }, order) => {
    const product = products.find(p => p.id === order.productId);
    if (product) {
      acc[product.name] = (acc[product.name] || 0) + order.quantity;
    }
    return acc;
  }, {});

  const topProducts = Object.entries(productSales)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }));

  // Calculate loyal customers
  const customerOrders = orders.reduce((acc: { [key: string]: number }, order) => {
    acc[order.customerName] = (acc[order.customerName] || 0) + 1;
    return acc;
  }, {});

  const loyalCustomers = Object.entries(customerOrders)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }));

  // Get recent customers
  const recentCustomers = [...orders]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  const COLORS = ['#A239CA', '#4717F6', '#F64C72', '#6B7280', '#9CA3AF'];

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
            <title>Meat Shop Report</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .section { margin-bottom: 20px; }
              .metric { margin: 10px 0; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Meat Shop Report</h1>
              <p>Generated on ${new Date().toLocaleDateString()}</p>
            </div>
            <div class="section">
              <h2>Key Metrics</h2>
              <div class="metric">Total Revenue: NPR ${totalRevenue.toLocaleString()}</div>
              <div class="metric">Average Order Value: NPR ${averageOrderValue.toLocaleString()}</div>
              <div class="metric">Total Products: ${products.length}</div>
            </div>
            <div class="section">
              <h2>Top Selling Products</h2>
              ${Object.entries(productSales)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([name, value]) => `<div class="metric">${name}: ${value} units</div>`)
                .join('')}
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
      <main className="container py-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Reports</h1>
          <Button 
            variant="outline" 
            className="hover:bg-primary/20"
            onClick={handlePrintReport}
          >
            <Printer className="w-4 h-4 mr-2" />
            Print Report
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            icon={FileText}
            title="Total Revenue"
            value={`NPR ${totalRevenue.toLocaleString()}`}
          />
          <MetricCard
            icon={FileText}
            title="Average Order Value"
            value={`NPR ${averageOrderValue.toLocaleString()}`}
          />
          <MetricCard
            icon={ShoppingBag}
            title="Total Products"
            value={products.length.toString()}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopProducts data={topProducts} />
          <LoyalCustomers data={loyalCustomers} colors={COLORS} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart />
          <RecentCustomers customers={recentCustomers} />
        </div>
      </main>
    </div>
  );
};

export default Reports;
