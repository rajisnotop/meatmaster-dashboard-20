import Header from "@/components/Header";
import DashboardStats from "@/components/DashboardStats";
import RevenueChart from "@/components/RevenueChart";
import ProductsTable from "@/components/ProductsTable";
import OrderForm from "@/components/OrderForm";
import { Card } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <main className="flex-1 p-8 space-y-8 animate-fade-in">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold gradient-text">Dashboard Overview</h1>
            <div className="flex gap-4">
              <OrderForm />
            </div>
          </div>
          
          <DashboardStats />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 dashboard-card">
              <h2 className="text-xl font-semibold mb-6 gradient-text">Revenue Overview</h2>
              <RevenueChart />
            </Card>
            
            <Card className="dashboard-card">
              <h2 className="text-xl font-semibold mb-6 gradient-text">Quick Actions</h2>
              <div className="space-y-4">
                <button className="action-button w-full flex items-center justify-between">
                  <span>New Order</span>
                  <span>+</span>
                </button>
                <button className="action-button w-full flex items-center justify-between">
                  <span>Add Product</span>
                  <span>+</span>
                </button>
                <button className="action-button w-full flex items-center justify-between">
                  <span>View Reports</span>
                  <span>→</span>
                </button>
              </div>
            </Card>
          </div>
          
          <Card className="dashboard-card">
            <h2 className="text-xl font-semibold mb-6 gradient-text">Products Management</h2>
            <ProductsTable />
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Index;