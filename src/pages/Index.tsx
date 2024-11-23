import Header from "@/components/Header";
import DashboardStats from "@/components/DashboardStats";
import RevenueChart from "@/components/RevenueChart";
import ProductsTable from "@/components/ProductsTable";
import OrderForm from "@/components/OrderForm";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 space-y-6 animate-fade-in">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your shop's performance.
          </p>
        </div>

        <DashboardStats />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-6 bg-card/50 backdrop-blur-sm border-border/50">
            <h2 className="text-xl font-semibold mb-4">Revenue Overview</h2>
            <RevenueChart />
          </Card>
          
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
            <Tabs defaultValue="new-order" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="new-order">New Order</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
              </TabsList>
              <TabsContent value="new-order" className="flex-grow">
                <OrderForm />
              </TabsContent>
              <TabsContent value="products" className="flex-grow">
                <ProductsTable />
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;