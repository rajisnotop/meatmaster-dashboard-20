import { DollarSign, ShoppingCart, Package, TrendingUp, ArrowUp, ArrowDown } from "lucide-react";
import { useStore } from "@/store/store";
import { startOfDay, subDays } from "date-fns";
import { motion } from "framer-motion";

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
      color: "moss"
    },
    {
      title: "Orders",
      value: orders.length.toString(),
      change: ordersChange,
      icon: ShoppingCart,
      color: "earth"
    },
    {
      title: "Products",
      value: products.length.toString(),
      icon: Package,
      color: "tiger"
    },
    {
      title: "Total Revenue",
      value: `NPR ${orders.reduce((total, order) => total + order.total, 0).toLocaleString()}`,
      icon: TrendingUp,
      color: "forest"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className={`
            relative p-6 rounded-xl border border-${stat.color}/10
            bg-gradient-to-br from-${stat.color}/10 via-${stat.color}/5 to-transparent
            hover:shadow-lg transition-all duration-300 group
          `}
        >
          <div className="flex items-center gap-4">
            <div className={`
              p-3 rounded-lg bg-${stat.color}/10 
              group-hover:bg-${stat.color}/20 transition-colors duration-300
            `}>
              <stat.icon className={`h-6 w-6 text-${stat.color}`} />
            </div>
            
            <div className="space-y-1">
              <p className={`text-sm text-${stat.color}/70`}>{stat.title}</p>
              <h3 className={`text-2xl font-bold text-${stat.color}`}>
                {stat.value}
              </h3>
              {typeof stat.change === 'number' && (
                <div className="flex items-center gap-1.5">
                  {stat.change > 0 ? (
                    <ArrowUp className="h-4 w-4 text-moss" />
                  ) : (
                    <ArrowDown className="h-4 w-4 text-tiger" />
                  )}
                  <span className={`text-sm font-medium ${
                    stat.change > 0 ? 'text-moss' : 'text-tiger'
                  }`}>
                    {Math.abs(stat.change).toFixed(1)}% from yesterday
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats;