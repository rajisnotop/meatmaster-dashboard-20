import { DollarSign, ShoppingCart, Package, TrendingUp, ArrowUp, ArrowDown } from "lucide-react";
import { useStore } from "@/store/store";
import { startOfDay, subDays } from "date-fns";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const DashboardStats = () => {
  const { orders, products } = useStore();
  
  const today = startOfDay(new Date());
  const yesterday = startOfDay(subDays(today, 1));
  
  const todaysSales = orders
    .filter(order => new Date(order.date) >= today)
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
      gradient: "from-blue-500/20 via-blue-400/20 to-blue-300/20",
      iconColor: "text-blue-500"
    },
    {
      title: "Orders",
      value: orders.length.toString(),
      change: ordersChange,
      icon: ShoppingCart,
      gradient: "from-purple-500/20 via-purple-400/20 to-purple-300/20",
      iconColor: "text-purple-500"
    },
    {
      title: "Products",
      value: products.length.toString(),
      icon: Package,
      gradient: "from-green-500/20 via-green-400/20 to-green-300/20",
      iconColor: "text-green-500"
    },
    {
      title: "Total Revenue",
      value: `NPR ${orders.reduce((total, order) => total + order.total, 0).toLocaleString()}`,
      icon: TrendingUp,
      gradient: "from-orange-500/20 via-orange-400/20 to-orange-300/20",
      iconColor: "text-orange-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className={cn(
            "stat-card animate-fade-up",
            "hover:shadow-lg transition-all duration-300",
            "bg-gradient-to-br backdrop-blur-sm border-border/50",
            stat.gradient
          )}
          style={{
            animationDelay: `${index * 100}ms`
          }}
        >
          <div className="flex items-center gap-4">
            <div className={cn(
              "p-3 rounded-xl",
              "glass-card",
              stat.iconColor
            )}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{stat.title}</p>
              <h3 className="text-2xl font-bold tracking-tight">{stat.value}</h3>
              {typeof stat.change === 'number' && (
                <div className="flex items-center gap-1">
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
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;