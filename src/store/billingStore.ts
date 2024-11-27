import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Order, Product } from '@/types/types';
import { supabase } from '@/lib/supabase';

interface BillingStore {
  orders: Order[];
  products: Product[];
  setOrders: (orders: Order[]) => void;
  setProducts: (products: Product[]) => void;
  addOrder: (order: Omit<Order, 'id'>) => Promise<void>;
  updateOrderStatus: (id: string, isPaid: boolean, paidWithQR?: boolean) => Promise<void>;
}

export const useBillingStore = create<BillingStore>()(
  devtools(
    persist(
      (set) => ({
        orders: [],
        products: [],
        
        setOrders: (orders) => set({ orders }),
        setProducts: (products) => set({ products }),

        addOrder: async (order) => {
          const { data, error } = await supabase
            .from('orders')
            .insert([{
              customername: order.customerName,
              productid: order.productId,
              quantity: order.quantity,
              total: order.total,
              date: order.date.toISOString(),
              ispaid: order.isPaid,
              wasunpaid: order.wasUnpaid,
              paidwithqr: order.paidWithQR
            }])
            .select()
            .single();

          if (error) throw error;
          set(state => ({
            orders: [...state.orders, { ...order, id: data.id }]
          }));
        },

        updateOrderStatus: async (id, isPaid, paidWithQR = false) => {
          const { error } = await supabase
            .from('orders')
            .update({
              ispaid: isPaid,
              paidwithqr: paidWithQR,
              wasunpaid: true
            })
            .eq('id', id);

          if (error) throw error;
          set(state => ({
            orders: state.orders.map(order =>
              order.id === id
                ? {
                    ...order,
                    isPaid,
                    wasUnpaid: true,
                    paidWithQR
                  }
                : order
            )
          }));
        },
      }),
      {
        name: 'billing-storage',
      }
    )
  )
);