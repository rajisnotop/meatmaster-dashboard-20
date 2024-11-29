import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Product, Order } from '@/types/types';
import { supabase } from '@/lib/supabase';
import { initializeStore } from './storeInitializer';

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
        
        initializeData: () => initializeStore(set, get),

        addProduct: async (product) => {
          const { data, error } = await supabase
            .from('products')
            .insert([{ ...product }])
            .select()
            .single();

          if (error) throw error;
          set(state => ({ products: [...state.products, data] }));
        },

        deleteProduct: async (id) => {
          const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

          if (error) throw error;
          set(state => ({
            products: state.products.filter(product => product.id !== id)
          }));
        },

        addOrder: async (order) => {
          const supabaseOrder = {
            customername: order.customerName,
            productid: order.productId,
            quantity: order.quantity,
            total: order.total,
            date: order.date.toISOString(),
            ispaid: order.isPaid,
            wasunpaid: order.wasUnpaid,
            paidwithqr: order.paidWithQR
          };

          const { data, error } = await supabase
            .from('orders')
            .insert([supabaseOrder])
            .select()
            .single();

          if (error) throw error;
          set(state => ({ orders: [...state.orders, { ...order, id: data.id }] }));
        },

        updateOrder: async (updatedOrder) => {
          const supabaseOrder = {
            customername: updatedOrder.customerName,
            productid: updatedOrder.productId,
            quantity: updatedOrder.quantity,
            total: updatedOrder.total,
            date: updatedOrder.date.toISOString(),
            ispaid: updatedOrder.isPaid,
            wasunpaid: updatedOrder.wasUnpaid,
            paidwithqr: updatedOrder.paidWithQR
          };

          const { error } = await supabase
            .from('orders')
            .update(supabaseOrder)
            .eq('id', updatedOrder.id);

          if (error) throw error;
          set(state => ({
            orders: state.orders.map(order =>
              order.id === updatedOrder.id ? updatedOrder : order
            )
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
        name: 'meat-shop-storage',
      }
    )
  )
);

// Initialize data when the app starts
useStore.getState().initializeData();
