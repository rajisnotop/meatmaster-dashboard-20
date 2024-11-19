import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import RevenueChart from "@/components/RevenueChart";
import { useStore } from "@/store/store";
import { ChartPie, FileText, Printer, Users, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Reports = () => {
  const { orders, products } = useStore();

  const totalRevenue = orders.reduce((total, order) => total + order.total, 0);
  const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

  // Calculate top selling products
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

  const COLORS = ['#A239CA', '#4717F6', '#F64C72', '#6B7280', '#9CA3AF'];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Reports</h1>
          <Button variant="outline" className="hover:bg-primary/20">
            <Printer className="w-4 h-4 mr-2" />
            Print Report
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-background/80 border border-border/50 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <ChartPie className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <h3 className="text-2xl font-bold">NPR {totalRevenue.toLocaleString()}</h3>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-background/80 border border-border/50 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <FileText className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Average Order Value</p>
                <h3 className="text-2xl font-bold">NPR {averageOrderValue.toLocaleString()}</h3>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-background/80 border border-border/50 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <ShoppingBag className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <h3 className="text-2xl font-bold">{products.length}</h3>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 bg-background/80 border border-border/50 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.1} />
                  <XAxis 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-md">
                            <p className="text-sm font-medium">{payload[0].payload.name}</p>
                            <p className="text-sm text-primary">
                              Quantity: {payload[0].value}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6 bg-background/80 border border-border/50 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-4">Loyal Customers</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={loyalCustomers}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {loyalCustomers.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <RevenueChart />
      </main>
    </div>
  );
};

export default Reports;