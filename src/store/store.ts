import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Product, Order } from '@/types/types';
import { supabase } from '@/lib/supabase';

export interface StoreState {
  products: Product[];
  orders: Order[];
  openingBalance: number;
  cashInCounter: number;
  netProfit: number;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addOrder: (order: Order) => Promise<void>;
  updateOrder: (order: Order) => Promise<void>;
  updateOrderStatus: (id: string, isPaid: boolean, paidWithQR?: boolean) => Promise<void>;
  setOrders: (orders: Order[]) => void;
  initializeData: () => Promise<void>;
}

export const useStore = create<StoreState>()(
  devtools(
    persist(
      (set, get) => ({
        products: [],
        orders: [],
        openingBalance: 0,
        cashInCounter: 0,
        netProfit: 0,
        
        initializeData: async () => {
          try {
            console.log('Initializing data...');
            const { data: ordersData, error: ordersError } = await supabase
              .from('orders')
              .select('*')
              .order('date', { ascending: false });

            if (ordersError) {
              console.error('Error fetching orders:', ordersError);
              throw ordersError;
            }

            const { data: productsData, error: productsError } = await supabase
              .from('products')
              .select('*');

            if (productsError) {
              console.error('Error fetching products:', productsError);
              throw productsError;
            }

            const transformedOrders = ordersData.map(order => ({
              id: order.id,
              customerName: order.customername,
              productId: order.productid,
              quantity: order.quantity,
              total: order.total,
              date: new Date(order.date),
              isPaid: order.ispaid,
              wasUnpaid: order.wasunpaid,
              paidWithQR: order.paidwithqr
            }));

            set({ 
              orders: transformedOrders,
              products: productsData
            });
          } catch (error) {
            console.error('Error initializing data:', error);
          }
        },

        addOrder: async (order) => {
          try {
            console.log('Adding order:', order);
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
            
            console.log('Order added successfully:', data);
            set(state => ({
              orders: [order, ...state.orders]
            }));
          } catch (error) {
            console.error('Error adding order:', error);
            throw error;
          }
        },

        updateOrder: async (order) => {
          try {
            console.log('Updating order:', order);
            const { error } = await supabase
              .from('orders')
              .update({
                customername: order.customerName,
                productid: order.productId,
                quantity: order.quantity,
                total: order.total,
                date: order.date.toISOString(),
                ispaid: order.isPaid,
                wasunpaid: order.wasUnpaid,
                paidwithqr: order.paidWithQR
              })
              .eq('id', order.id);

            if (error) throw error;
            
            set(state => ({
              orders: state.orders.map(o => o.id === order.id ? order : o)
            }));
          } catch (error) {
            console.error('Error updating order:', error);
            throw error;
          }
        },

        updateOrderStatus: async (id, isPaid, paidWithQR = false) => {
          try {
            console.log('Updating order status:', { id, isPaid, paidWithQR });
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

        setOrders: (orders) => set({ orders }),
      }),
      {
        name: 'meat-shop-storage',
      }
    )
  )
);

// Initialize data when the store is created
useStore.getState().initializeData();
