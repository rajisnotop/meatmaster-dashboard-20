import { Order, Product } from "@/types/types";

export const calculateProductTotals = (
  products: Product[],
  orders: Order[],
  filterDateFn: (date: Date) => boolean
) => {
  return products.map((product) => {
    const productOrders = orders.filter((order) => {
      const orderDate = new Date(order.date);
      return order.productId === product.id && filterDateFn(orderDate);
    });

    const totalQuantity = productOrders.reduce((sum, order) => sum + order.quantity, 0);
    const totalAmount = productOrders.reduce((sum, order) => sum + order.total, 0);
    
    // Calculate unpaid to paid amount by only including orders that are currently paid
    const unpaidToPaidAmount = productOrders
      .filter((order) => order.isPaid)  // Only include paid orders
      .reduce((sum, order) => sum + order.total, 0);

    return {
      id: product.id,
      name: product.name,
      quantity: totalQuantity,
      amount: totalAmount,
      unpaid: unpaidToPaidAmount,
    };
  });
};

export const calculateOverallTotals = (productTotals: any[]) => {
  return {
    quantity: productTotals.reduce((sum, product) => sum + product.quantity, 0),
    sales: productTotals.reduce((sum, product) => sum + product.amount, 0),
    unpaid: productTotals.reduce((sum, product) => sum + product.unpaid, 0),
  };
};