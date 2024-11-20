import Header from "@/components/Header";
import DashboardStats from "@/components/DashboardStats";
import RevenueChart from "@/components/RevenueChart";
import ProductsTable from "@/components/ProductsTable";
import OrderForm from "@/components/OrderForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-accent">
      <Header />
      <main className="container py-8 space-y-8">
        <DashboardStats />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <RevenueChart />
          </div>
          <div>
            <OrderForm />
          </div>
        </div>
        
        <div className="p-6 rounded-lg bg-background/95 border border-border/50 backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-4">Products Management</h2>
          <ProductsTable />
        </div>
      </main>
    </div>
  );
};

export default Index;