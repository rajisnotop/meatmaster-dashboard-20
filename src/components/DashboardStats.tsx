import { DollarSign, ShoppingCart, Package, TrendingUp } from "lucide-react";
import { Card } from "./ui/card";

const DashboardStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-secondary/10 rounded-full">
            <DollarSign className="h-6 w-6 text-secondary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Today's Sales</p>
            <h3 className="text-2xl font-bold">$1,234</h3>
          </div>
        </div>
      </Card>
      
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-secondary/10 rounded-full">
            <ShoppingCart className="h-6 w-6 text-secondary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Orders</p>
            <h3 className="text-2xl font-bold">25</h3>
          </div>
        </div>
      </Card>
      
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-secondary/10 rounded-full">
            <Package className="h-6 w-6 text-secondary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Products</p>
            <h3 className="text-2xl font-bold">48</h3>
          </div>
        </div>
      </Card>
      
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-secondary/10 rounded-full">
            <TrendingUp className="h-6 w-6 text-secondary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Revenue</p>
            <h3 className="text-2xl font-bold">$12,345</h3>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DashboardStats;