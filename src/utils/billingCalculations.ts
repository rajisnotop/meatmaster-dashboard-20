import { Order, Product } from "@/types/types";

export const calculateProductTotals = (
  products: Product[],
  orders: Order[],
  filterDateFn: (date: Date) => boolean
) => {
  // First, get all products that have any orders
  const productsWithOrders = products.filter(product => 
    orders.some(order => order.productId === product.id)
  );

  return productsWithOrders.map((product) => {
    const productOrders = orders.filter((order) => {
      const orderDate = new Date(order.date);
      return order.productId === product.id && 
             filterDateFn(orderDate) && 
             order.isPaid;
    });

    // Calculate total quantity and amount only for orders that were never unpaid
    const totalQuantity = productOrders
      .filter(order => !order.wasUnpaid)
      .reduce((sum, order) => sum + order.quantity, 0);
    
    const totalAmount = productOrders
      .filter(order => !order.wasUnpaid)
      .reduce((sum, order) => sum + order.total, 0);
    
    // Calculate paid with QR amount (direct QR payments)
    const paidWithQRAmount = productOrders
      .filter(order => !order.wasUnpaid && order.paidWithQR)
      .reduce((sum, order) => sum + order.total, 0);

    // Calculate unpaid to paid amount (excluding QR payments)
    const unpaidToPaidAmount = productOrders
      .filter(order => order.wasUnpaid && !order.paidWithQR)
      .reduce((sum, order) => sum + order.total, 0);

    // Calculate unpaid to paid with QR amount
    const unpaidToPaidQRAmount = productOrders
      .filter(order => order.wasUnpaid && order.paidWithQR)
      .reduce((sum, order) => sum + order.total, 0);

    return {
      id: product.id,
      name: product.name,
      quantity: totalQuantity,
      amount: totalAmount,
      paidWithQR: paidWithQRAmount,
      unpaid: unpaidToPaidAmount,
      unpaidToPaidQR: unpaidToPaidQRAmount,
    };
  });
};

export const calculateOverallTotals = (productTotals: any[]) => {
  return {
    quantity: productTotals.reduce((sum, product) => sum + product.quantity, 0),
    sales: productTotals.reduce((sum, product) => sum + product.amount, 0),
    paidWithQR: productTotals.reduce((sum, product) => sum + product.paidWithQR, 0),
    unpaid: productTotals.reduce((sum, product) => sum + product.unpaid, 0),
    unpaidToPaidQR: productTotals.reduce((sum, product) => sum + product.unpaidToPaidQR, 0),
  };
};

export const calculateFinancialSummary = (
  overallTotals: any,
  totalExpenses: number,
  openingBalance: number,
  cashExpenses: number,
  onlineExpenses: number
) => {
  const netAmount = overallTotals.sales + 
                   overallTotals.paidWithQR + 
                   overallTotals.unpaid + 
                   overallTotals.unpaidToPaidQR + 
                   openingBalance - 
                   totalExpenses;

  const cashInCounter = overallTotals.sales + 
                       overallTotals.unpaid - 
                       cashExpenses;

  const cashInBank = overallTotals.paidWithQR - 
                    onlineExpenses;

  return {
    netAmount,
    cashInCounter,
    cashInBank
  };
};
