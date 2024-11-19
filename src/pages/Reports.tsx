import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import RevenueChart from "@/components/RevenueChart";
import { useStore } from "@/store/store";
import { ChartPie, FileText, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

const Reports = () => {
  const { orders, products } = useStore();

  const totalRevenue = orders.reduce((total, order) => total + order.total, 0);
  const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

  return (
    <div className="min-h-screen bg-accent">
      <Header />
      <main className="container py-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Reports</h1>
          <Button variant="outline" className="glow">
            <Printer className="w-4 h-4 mr-2" />
            Print Report
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 card-glow">
            <div className="flex items-center gap-4">
              <ChartPie className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <h3 className="text-2xl font-bold">NPR {totalRevenue.toLocaleString()}</h3>
              </div>
            </div>
          </Card>

          <Card className="p-6 card-glow">
            <div className="flex items-center gap-4">
              <FileText className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Average Order Value</p>
                <h3 className="text-2xl font-bold">NPR {averageOrderValue.toLocaleString()}</h3>
              </div>
            </div>
          </Card>

          <Card className="p-6 card-glow">
            <div className="flex items-center gap-4">
              <ChartPie className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <h3 className="text-2xl font-bold">{products.length}</h3>
              </div>
            </div>
          </Card>
        </div>

        <RevenueChart />
      </main>
    </div>
  );
};

export default Reports;