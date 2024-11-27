import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TopSellingProducts from "@/components/reports/TopSellingProducts";
import LoyalCustomers from "@/components/reports/LoyalCustomers";
import RevenueMetrics from "@/components/reports/RevenueMetrics";
import ProductPerformance from "@/components/reports/ProductPerformance";
import ProfitTrendsChart from "@/components/reports/ProfitTrendsChart";
import RecentCustomers from "@/components/reports/RecentCustomers";
import TopProducts from "@/components/reports/TopProducts";
import Header from "@/components/Header";

const Reports = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
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
            <LoyalCustomers />
          </TabsContent>
        </Tabs>

        <RevenueMetrics />
        <ProductPerformance />
        <ProfitTrendsChart />
        <RecentCustomers />
        <TopProducts />
      </div>
    </div>
  );
};

export default Reports;
