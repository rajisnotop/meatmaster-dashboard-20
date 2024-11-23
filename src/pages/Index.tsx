import Header from "@/components/Header";
import DashboardStats from "@/components/DashboardStats";
import ProductsTable from "@/components/ProductsTable";
import OrderForm from "@/components/OrderForm";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8 px-4 space-y-8">
        <div className="space-y-8 animate-fade-up">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome back! Here's an overview of your shop's performance.
            </p>
          </div>

          <DashboardStats />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 bg-background/80 border border-border/50 backdrop-blur-sm">
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">New Order</h2>
                  <OrderForm />
                </div>
              </ScrollArea>
            </Card>
            
            <Card className="p-6 bg-background/80 border border-border/50 backdrop-blur-sm">
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Products Management</h2>
                  <ProductsTable />
                </div>
              </ScrollArea>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;