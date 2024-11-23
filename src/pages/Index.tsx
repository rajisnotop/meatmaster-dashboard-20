import Header from "@/components/Header";
import DashboardStats from "@/components/DashboardStats";
import RevenueChart from "@/components/RevenueChart";
import ProductsTable from "@/components/ProductsTable";
import OrderForm from "@/components/OrderForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="page-container">
        <h1 className="section-title">Dashboard Overview</h1>
        
        <DashboardStats />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 card-modern p-6">
            <h2 className="text-xl font-semibold mb-6 gradient-text">Revenue Overview</h2>
            <RevenueChart />
          </div>
          
          <div className="card-modern p-6">
            <h2 className="text-xl font-semibold mb-6 gradient-text">New Order</h2>
            <OrderForm />
          </div>
        </div>
        
        <div className="card-modern p-6">
          <h2 className="text-xl font-semibold mb-6 gradient-text">Products Management</h2>
          <ProductsTable />
        </div>
      </main>
    </div>
  );
};

export default Index;