import Header from "@/components/Header";
import { useStore } from "@/store/store";
import { FileText, Printer, DollarSign, Receipt, TrendingUp, CreditCard } from "lucide-react";
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
  const productPerformance = calculateProductPerformance(products, orders).map(product => ({
    ...product,
    trend: Math.random() * 100 - 50 // This is temporary, replace with actual trend calculation
  }));

  // Calculate recent customers from orders
  const recentCustomers = orders
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
    .map(order => ({
      customerName: order.customerName,
      date: new Date(order.date),
      total: order.total
    }));

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

      const topProducts = productPerformance.slice(0, 5);
      
      printWindow.document.write(`
        <html>
          <head>
            <title>Financial Report - ${format(new Date(), "MMMM yyyy")}</title>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
              
              body {
                font-family: 'Inter', sans-serif;
                padding: 40px;
                color: #1a1a1a;
                line-height: 1.6;
              }
              
              .header {
                text-align: center;
                margin-bottom: 40px;
                padding-bottom: 20px;
                border-bottom: 2px solid #e5e7eb;
              }
              
              .logo {
                font-size: 24px;
                font-weight: 700;
                color: #4f46e5;
                margin-bottom: 10px;
              }
              
              .date {
                color: #6b7280;
                font-size: 14px;
              }
              
              .section {
                margin-bottom: 30px;
                padding: 20px;
                background: #f9fafb;
                border-radius: 8px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
              }
              
              .section-title {
                font-size: 18px;
                font-weight: 600;
                color: #111827;
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                gap: 8px;
              }
              
              .metric-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                margin-bottom: 20px;
              }
              
              .metric-card {
                background: white;
                padding: 15px;
                border-radius: 6px;
                box-shadow: 0 1px 2px rgba(0,0,0,0.05);
              }
              
              .metric-title {
                font-size: 14px;
                color: #6b7280;
                margin-bottom: 5px;
              }
              
              .metric-value {
                font-size: 24px;
                font-weight: 600;
                color: #111827;
              }
              
              .metric-trend {
                font-size: 12px;
                margin-top: 5px;
              }
              
              .trend-up {
                color: #10b981;
              }
              
              .trend-down {
                color: #ef4444;
              }
              
              .product-list {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 15px;
              }
              
              .product-card {
                background: white;
                padding: 15px;
                border-radius: 6px;
                box-shadow: 0 1px 2px rgba(0,0,0,0.05);
              }
              
              table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
                background: white;
                border-radius: 6px;
                overflow: hidden;
              }
              
              th, td {
                padding: 12px 15px;
                text-align: left;
                border-bottom: 1px solid #e5e7eb;
              }
              
              th {
                background: #f3f4f6;
                font-weight: 600;
                color: #374151;
              }
              
              tr:last-child td {
                border-bottom: none;
              }
              
              @media print {
                body {
                  padding: 20px;
                }
                
                .section {
                  break-inside: avoid;
                }
                
                button {
                  display: none;
                }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="logo">Financial Report</div>
              <div class="date">${format(new Date(), "MMMM dd, yyyy")}</div>
            </div>
            
            <div class="section">
              <div class="section-title">📊 Financial Overview</div>
              <div class="metric-grid">
                <div class="metric-card">
                  <div class="metric-title">Total Revenue</div>
                  <div class="metric-value">NPR ${totalRevenue.toLocaleString()}</div>
                </div>
                <div class="metric-card">
                  <div class="metric-title">Total Expenses</div>
                  <div class="metric-value">NPR ${totalExpenses.toLocaleString()}</div>
                </div>
                <div class="metric-card">
                  <div class="metric-title">Net Profit</div>
                  <div class="metric-value ${netProfit >= 0 ? 'trend-up' : 'trend-down'}">
                    NPR ${netProfit.toLocaleString()}
                  </div>
                </div>
                <div class="metric-card">
                  <div class="metric-title">Average Order Value</div>
                  <div class="metric-value">NPR ${averageOrderValue.toLocaleString()}</div>
                </div>
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">🏆 Top Performing Products</div>
              <div class="product-list">
                ${topProducts.map((product, index) => `
                  <div class="product-card">
                    <div class="metric-title">#${index + 1} ${product.name}</div>
                    <div class="metric-value">NPR ${product.revenue.toLocaleString()}</div>
                    <div class="metric-trend ${product.trend >= 0 ? 'trend-up' : 'trend-down'}">
                      ${product.trend >= 0 ? '↑' : '↓'} ${Math.abs(product.trend).toFixed(1)}%
                    </div>
                    <div style="color: #6b7280; font-size: 12px;">
                      ${product.sold} units sold
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">📈 Monthly Trends</div>
              <table>
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Revenue</th>
                    <th>Expenses</th>
                    <th>Profit</th>
                  </tr>
                </thead>
                <tbody>
                  ${monthlyTrends.map(trend => `
                    <tr>
                      <td>${trend.month}</td>
                      <td>NPR ${trend.revenue.toLocaleString()}</td>
                      <td>NPR ${trend.expenses.toLocaleString()}</td>
                      <td class="${trend.profit >= 0 ? 'trend-up' : 'trend-down'}">
                        NPR ${trend.profit.toLocaleString()}
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
            
            <div style="text-align: center; margin-top: 40px; color: #6b7280; font-size: 12px;">
              Generated on ${format(new Date(), "PPP")} at ${format(new Date(), "pp")}
            </div>
            
            <button onclick="window.print()" style="
              position: fixed;
              bottom: 20px;
              right: 20px;
              padding: 10px 20px;
              background: #4f46e5;
              color: white;
              border: none;
              border-radius: 6px;
              cursor: pointer;
              font-weight: 500;
            ">
              Print Report
            </button>
          </body>
        </html>
      `);
      
      printWindow.document.close();
      
      toast({
        title: "Success",
        description: "Report generated successfully",
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