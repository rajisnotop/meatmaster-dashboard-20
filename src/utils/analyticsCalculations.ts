import { Order, Product, Expense } from "@/types/types";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval } from "date-fns";

export const calculateDailyRevenue = (orders: Order[]) => {
  return orders.reduce((acc: { [key: string]: number }, order) => {
    const date = new Date(order.date);
    const dayKey = format(date, 'MMM d');
    acc[dayKey] = (acc[dayKey] || 0) + order.total;
    return acc;
  }, {});
};

export const calculateProductPerformance = (products: Product[], orders: Order[]) => {
  return products.map(product => {
    const productOrders = orders.filter(order => order.productId === product.id);
    const totalSold = productOrders.reduce((sum, order) => sum + order.quantity, 0);
    const totalRevenue = productOrders.reduce((sum, order) => sum + order.total, 0);
    
    return {
      name: product.name,
      sold: totalSold,
      revenue: totalRevenue,
      averagePrice: totalSold > 0 ? totalRevenue / totalSold : 0
    };
  }).sort((a, b) => b.revenue - a.revenue);
};

export const calculateMonthlyTrends = (orders: Order[], expenses: Expense[]) => {
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return {
      start: startOfMonth(date),
      end: endOfMonth(date),
      month: format(date, 'MMM yyyy')
    };
  }).reverse();

  return last6Months.map(({ start, end, month }) => {
    const monthOrders = orders.filter(order => 
      isWithinInterval(new Date(order.date), { start, end })
    );
    const monthExpenses = expenses.filter(expense => 
      isWithinInterval(new Date(expense.date), { start, end })
    );

    const revenue = monthOrders.reduce((sum, order) => sum + order.total, 0);
    const costs = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    return {
      month,
      revenue,
      expenses: costs,
      profit: revenue - costs
    };
  });
};