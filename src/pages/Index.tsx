import Header from "@/components/Header";
import DashboardStats from "@/components/DashboardStats";
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
            <h2 className="text-xl font-semibold mb-4">New Order</h2>
            <OrderForm />
          </Card>
          
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
            <h2 className="text-xl font-semibold mb-4">Products Management</h2>
            <ProductsTable />
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;