import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Order, Product } from '@/types/types';
import { supabase } from '@/lib/supabase';
import { transformDatabaseOrder } from '@/utils/dataTransformers';

interface BillingStore {
  orders: Order[];
  products: Product[];
  isLoading: boolean;
  error: string | null;
  setOrders: (orders: Order[]) => void;
  setProducts: (products: Product[]) => void;
  addOrder: (order: Omit<Order, 'id'>) => Promise<void>;
  updateOrderStatus: (id: string, isPaid: boolean, paidWithQR?: boolean) => Promise<void>;
  initializeBillingData: () => Promise<void>;
}

export const useBillingStore = create<BillingStore>()(
  devtools(
    persist(
      (set) => ({
        orders: [],
        products: [],
        isLoading: false,
        error: null,
        
        initializeBillingData: async () => {
          set({ isLoading: true, error: null });
          try {
            const [ordersRes, productsRes] = await Promise.all([
              supabase.from('orders').select('*').order('date', { ascending: false }),
              supabase.from('products').select('*')
            ]);

            if (ordersRes.error) throw ordersRes.error;
            if (productsRes.error) throw productsRes.error;

            const transformedOrders = ordersRes.data.map(transformDatabaseOrder);
            
            set({ 
              orders: transformedOrders,
              products: productsRes.data
            });
          } catch (error) {
            console.error('Error initializing billing data:', error);
            set({ error: 'Failed to load billing data' });
          } finally {
            set({ isLoading: false });
          }
        },
        
        setOrders: (orders) => set({ orders }),
        setProducts: (products) => set({ products }),

        addOrder: async (order) => {
          try {
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
            
            const newOrder = transformDatabaseOrder(data);
            set(state => ({
              orders: [newOrder, ...state.orders]
            }));
          } catch (error) {
            console.error('Error adding order:', error);
            throw error;
          }
        },

        updateOrderStatus: async (id, isPaid, paidWithQR = false) => {
          try {
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
          } catch (error) {
            console.error('Error updating order status:', error);
            throw error;
          }
        },
      }),
      {
        name: 'billing-storage',
      }
    )
  )
);

// Initialize billing data when the store is created
useBillingStore.getState().initializeBillingData();