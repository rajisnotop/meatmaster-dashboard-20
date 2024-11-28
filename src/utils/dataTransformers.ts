import { DatabaseOrder, DatabaseExpense } from '@/types/supabase';
import { Order, Expense } from '@/types/types';

export const transformDatabaseOrder = (order: DatabaseOrder): Order => ({
  id: order.id,
  customerName: order.customername,
  productId: order.productid,
  quantity: order.quantity,
  total: order.total,
  date: new Date(order.date),
  isPaid: order.ispaid,
  wasUnpaid: order.wasunpaid,
  paidWithQR: order.paidwithqr
});

export const transformDatabaseExpense = (expense: DatabaseExpense): Expense => ({
  id: expense.id,
  category: expense.category,
  amount: expense.amount,
  description: expense.description,
  date: new Date(expense.date),
  paymentMethod: expense.payment_method as 'cash' | 'online'
});