import { DatabaseOrder } from '@/types/supabase';
import { Order } from '@/types/types';

export const transformDatabaseOrder = (order: DatabaseOrder): Order => ({
  id: order.id,
  customerName: order.customername,
  productId: order.product_id,
  quantity: order.quantity,
  total: order.total,
  date: new Date(order.date),
  isPaid: order.is_paid,
  wasUnpaid: order.was_unpaid,
  paidWithQR: order.paid_with_qr
});