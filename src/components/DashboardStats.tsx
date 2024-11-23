import { DollarSign, ShoppingCart, Package, TrendingUp } from "lucide-react";
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

  const stats = [
    {
      title: "Today's Sales",
      value: `NPR ${todaysSales.toLocaleString()}`,
      icon: DollarSign,
      color: "from-blue-500/20 to-blue-600/20",
      iconColor: "text-blue-500"
    },
    {
      title: "Orders",
      value: orders.length.toString(),
      icon: ShoppingCart,
      color: "from-purple-500/20 to-purple-600/20",
      iconColor: "text-purple-500"
    },
    {
      title: "Products",
      value: products.length.toString(),
      icon: Package,
      color: "from-green-500/20 to-green-600/20",
      iconColor: "text-green-500"
    },
    {
      title: "Total Revenue",
      value: `NPR ${orders.reduce((total, order) => total + order.total, 0).toLocaleString()}`,
      icon: TrendingUp,
      color: "from-orange-500/20 to-orange-600/20",
      iconColor: "text-orange-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
      {stats.map((stat, index) => (
        <div key={index} className="card-modern hover-scale">
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <h3 className="text-2xl font-bold tracking-tight">{stat.value}</h3>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;