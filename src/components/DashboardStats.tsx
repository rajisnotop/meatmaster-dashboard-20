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
      gradient: "from-moss/20 via-moss/10 to-transparent",
      iconColor: "text-moss"
    },
    {
      title: "Orders",
      value: orders.length.toString(),
      change: ordersChange,
      icon: ShoppingCart,
      gradient: "from-earth/20 via-earth/10 to-transparent",
      iconColor: "text-earth"
    },
    {
      title: "Products",
      value: products.length.toString(),
      icon: Package,
      gradient: "from-tiger/20 via-tiger/10 to-transparent",
      iconColor: "text-tiger"
    },
    {
      title: "Total Revenue",
      value: `NPR ${orders.reduce((total, order) => total + order.total, 0).toLocaleString()}`,
      icon: TrendingUp,
      gradient: "from-forest/20 via-forest/10 to-transparent",
      iconColor: "text-forest"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className={cn(
            "relative overflow-hidden transition-all duration-300",
            "hover:shadow-lg hover:-translate-y-1",
            "bg-gradient-to-r backdrop-blur-sm border-moss/10",
            stat.gradient
          )}
        >
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className={cn(
                "p-3 rounded-xl",
                "bg-background/40 backdrop-blur-sm",
                stat.iconColor
              )}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="space-y-1.5">
                <p className="text-sm text-forest/70">{stat.title}</p>
                <h3 className="text-2xl font-bold tracking-tight text-forest">{stat.value}</h3>
                {typeof stat.change === 'number' && (
                  <div className="flex items-center gap-1.5">
                    {stat.change > 0 ? (
                      <ArrowUp className="h-4 w-4 text-moss" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-tiger" />
                    )}
                    <span className={cn(
                      "text-sm font-medium",
                      stat.change > 0 ? "text-moss" : "text-tiger"
                    )}>
                      {Math.abs(stat.change).toFixed(1)}% from yesterday
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;