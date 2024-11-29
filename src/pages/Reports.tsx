import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TopSellingProducts from "@/components/reports/TopSellingProducts";
import LoyalCustomers from "@/components/reports/LoyalCustomers";
import RevenueMetrics from "@/components/reports/RevenueMetrics";
import ProductPerformance from "@/components/reports/ProductPerformance";
import ProfitTrendsChart from "@/components/reports/ProfitTrendsChart";
import RecentCustomers from "@/components/reports/RecentCustomers";
import TopProducts from "@/components/reports/TopProducts";
import { useStore } from "@/store/store";
import { useExpenseStore } from "@/store/expenseStore";

const Reports = () => {
  const { orders } = useStore();
  const { expenses } = useExpenseStore();

  // Calculate metrics
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const netProfit = totalRevenue - totalExpenses;
  const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

  // Sample data for charts and tables
  const loyalCustomersData = [
    { name: "Regular Customers", value: 60 },
    { name: "New Customers", value: 40 },
  ];

  const productPerformanceData = orders.map(order => ({
    name: order.productId,
    sold: order.quantity,
    revenue: order.total,
    averagePrice: order.total / order.quantity,
    trend: 0
  }));

  const profitTrendsData = [
    { month: "Jan", revenue: 1000, expenses: 800, profit: 200 },
    { month: "Feb", revenue: 1200, expenses: 900, profit: 300 },
    // Add more months as needed
  ];

  const recentCustomersData = orders.map(order => ({
    customerName: order.customerName || "Anonymous",
    date: order.date,
    total: order.total,
    previousTotal: 0
  }));

  const topProductsData = orders.map(order => ({
    name: order.productId,
    value: order.quantity
  }));

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Reports</h1>
        <Tabs defaultValue="top-selling" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="top-selling">Top Selling Products</TabsTrigger>
            <TabsTrigger value="loyal-customers">Loyal Customers</TabsTrigger>
          </TabsList>

          <TabsContent value="top-selling">
            <TopSellingProducts />
          </TabsContent>

          <TabsContent value="loyal-customers">
            <LoyalCustomers 
              data={loyalCustomersData}
              colors={["#4CAF50", "#2196F3"]}
            />
          </TabsContent>
        </Tabs>

        <RevenueMetrics
          totalRevenue={totalRevenue}
          totalExpenses={totalExpenses}
          netProfit={netProfit}
          averageOrderValue={averageOrderValue}
        />
        <ProductPerformance data={productPerformanceData} />
        <ProfitTrendsChart data={profitTrendsData} />
        <RecentCustomers customers={recentCustomersData} />
        <TopProducts data={topProductsData} />
      </div>
    </div>
  );
};

export default Reports;
