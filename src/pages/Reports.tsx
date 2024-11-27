import Header from "@/components/Header";
import { useStore } from "@/store/store";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import TopSellingProducts from "@/components/reports/TopSellingProducts";
import LoyalCustomers from "@/components/reports/LoyalCustomers";
import RecentCustomers from "@/components/reports/RecentCustomers";
import RevenueMetrics from "@/components/reports/RevenueMetrics";
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
              
              @page {
                size: A4;
                margin: 20px;
              }
              
              body {
                font-family: 'Inter', sans-serif;
                padding: 20px;
                color: #1a1a1a;
                line-height: 1.4;
                max-width: 100%;
                margin: 0;
              }
              
              .header {
                text-align: center;
                margin: -20px -20px 20px -20px;
                padding: 20px;
                background: linear-gradient(to right, #4f46e5, #7c3aed);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 20px;
              }
              
              .logo-container {
                display: flex;
                align-items: center;
                gap: 15px;
              }
              
              .logo {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                object-fit: contain;
                background: white;
                padding: 5px;
              }
              
              .title-container {
                text-align: left;
              }
              
              .company-name {
                font-size: 24px;
                font-weight: 700;
                margin: 0;
              }
              
              .report-type {
                font-size: 16px;
                opacity: 0.9;
                margin: 5px 0;
              }
              
              .date {
                font-size: 14px;
                opacity: 0.8;
              }
              
              .section {
                margin-bottom: 20px;
                padding: 15px;
                background: #f8fafc;
                border-radius: 8px;
                box-shadow: 0 1px 2px rgba(0,0,0,0.05);
              }
              
              .section-title {
                font-size: 16px;
                font-weight: 600;
                color: #111827;
                margin-bottom: 15px;
                padding-bottom: 8px;
                border-bottom: 1px solid #e2e8f0;
              }
              
              .metric-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                gap: 15px;
                margin-bottom: 15px;
              }
              
              .metric-card {
                background: white;
                padding: 12px;
                border-radius: 6px;
                box-shadow: 0 1px 2px rgba(0,0,0,0.05);
              }
              
              .metric-title {
                font-size: 12px;
                color: #6b7280;
                margin-bottom: 5px;
              }
              
              .metric-value {
                font-size: 16px;
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
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
              }
              
              .product-card {
                background: white;
                padding: 12px;
                border-radius: 6px;
                box-shadow: 0 1px 2px rgba(0,0,0,0.05);
              }
              
              table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 15px;
                background: white;
                border-radius: 6px;
                overflow: hidden;
                font-size: 12px;
              }
              
              th, td {
                padding: 8px 12px;
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
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
                
                .section {
                  break-inside: avoid;
                  page-break-inside: avoid;
                }
                
                button {
                  display: none;
                }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="logo-container">
                <img src="https://i.imgur.com/F4KFQkf.png" alt="Logo" class="logo">
                <div class="title-container">
                  <h1 class="company-name">Neelkantha Meat Shop</h1>
                  <p class="report-type">Financial Report</p>
                  <p class="date">${format(new Date(), "MMMM dd, yyyy")}</p>
                </div>
              </div>
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
            
            <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
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
            <h1 className="text-3xl font-bold text-forest">Financial Reports</h1>
            <p className="text-forest/80 mt-1">
              Generated on {format(new Date(), "MMMM dd, yyyy")}
            </p>
          </div>
          <Button 
            variant="outline" 
            className="hover:bg-primary/20 text-forest"
            onClick={handlePrintReport}
          >
            <Printer className="w-4 h-4 mr-2" />
            Print Report
          </Button>
        </div>

        <RevenueMetrics 
          totalRevenue={totalRevenue}
          totalExpenses={totalExpenses}
          netProfit={netProfit}
          averageOrderValue={averageOrderValue}
        />

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
