import Header from "@/components/Header";
import DashboardStats from "@/components/DashboardStats";
import RevenueChart from "@/components/RevenueChart";
import ProductsTable from "@/components/ProductsTable";
import OrderForm from "@/components/OrderForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8 space-y-8">
        <DashboardStats />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 gradient-border">
            <div className="card-modern p-6">
              <h2 className="text-xl font-semibold mb-4">Revenue Overview</h2>
              <RevenueChart />
            </div>
          </div>
          <div className="gradient-border">
            <div className="card-modern p-6">
              <h2 className="text-xl font-semibold mb-4">New Order</h2>
              <OrderForm />
            </div>
          </div>
        </div>
        
        <div className="gradient-border">
          <div className="card-modern p-6">
            <h2 className="text-xl font-semibold mb-4">Products Management</h2>
            <ProductsTable />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;