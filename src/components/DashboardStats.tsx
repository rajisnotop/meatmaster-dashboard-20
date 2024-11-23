import { DollarSign, ShoppingCart, Package, TrendingUp, ArrowUp, ArrowDown } from "lucide-react";
import { useStore } from "@/store/store";
import { startOfDay, subDays } from "date-fns";

const DashboardStats = () => {
  const { orders, products } = useStore();
  
  const today = startOfDay(new Date());
  const yesterday = startOfDay(subDays(today, 1));
  
  const todaysSales = orders
    .filter(order => {
      const orderDate = new Date(order.date);
      return orderDate >= today;
    })
    .reduce((total, order) => total + order.total, 0);

  const yesterdaySales = orders
    .filter(order => {
      const orderDate = new Date(order.date);
      return orderDate >= yesterday && orderDate < today;
    })
    .reduce((total, order) => total + order.total, 0);

  const todaysOrders = orders.filter(order => new Date(order.date) >= today).length;
  const yesterdaysOrders = orders.filter(order => {
    const orderDate = new Date(order.date);
    return orderDate >= yesterday && orderDate < today;
  }).length;

  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const salesChange = calculatePercentageChange(todaysSales, yesterdaySales);
  const ordersChange = calculatePercentageChange(todaysOrders, yesterdaysOrders);

  const stats = [
    {
      title: "Today's Sales",
      value: `NPR ${todaysSales.toLocaleString()}`,
      change: salesChange,
      icon: DollarSign,
      color: "from-blue-500/20 to-blue-600/20",
      iconColor: "text-blue-500"
    },
    {
      title: "Orders",
      value: orders.length.toString(),
      change: ordersChange,
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
      color: "from-orange-500/20 to-orange-800/20",
      iconColor: "text-orange-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
      {stats.map((stat, index) => (
        <div key={index} className="gradient-border">
          <div className="card-modern p-6 h-full">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <h3 className="text-2xl font-bold tracking-tight">{stat.value}</h3>
                {typeof stat.change === 'number' && (
                  <div className="flex items-center mt-1">
                    {stat.change > 0 ? (
                      <ArrowUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-sm ${stat.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {Math.abs(stat.change).toFixed(1)}% from yesterday
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;