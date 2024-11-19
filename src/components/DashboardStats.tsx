import { DollarSign, ShoppingCart, Package, TrendingUp } from "lucide-react";
import { Card } from "./ui/card";
import { useStore } from "@/store/store";

const DashboardStats = () => {
  const { orders, products } = useStore();
  
  const todaysSales = orders
    .filter(order => {
      const today = new Date();
      const orderDate = new Date(order.date);
      return orderDate.toDateString() === today.toDateString();
    })
    .reduce((total, order) => total + order.total, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
      <Card className="p-6 card-glow hover:scale-105 transition-transform duration-300">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <DollarSign className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Today's Sales</p>
            <h3 className="text-2xl font-bold">NPR {todaysSales.toLocaleString()}</h3>
          </div>
        </div>
      </Card>
      
      <Card className="p-6 card-glow hover:scale-105 transition-transform duration-300">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <ShoppingCart className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Orders</p>
            <h3 className="text-2xl font-bold">{orders.length}</h3>
          </div>
        </div>
      </Card>
      
      <Card className="p-6 card-glow hover:scale-105 transition-transform duration-300">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Package className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Products</p>
            <h3 className="text-2xl font-bold">{products.length}</h3>
          </div>
        </div>
      </Card>
      
      <Card className="p-6 card-glow hover:scale-105 transition-transform duration-300">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <h3 className="text-2xl font-bold">
              NPR {orders.reduce((total, order) => total + order.total, 0).toLocaleString()}
            </h3>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DashboardStats;