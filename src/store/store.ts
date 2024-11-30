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
          try {
            console.log('Adding product:', product);
            const { data, error } = await supabase
              .from('products')
              .insert([product])
              .select()
              .single();

            if (error) throw error;
            
            set(state => ({
              products: [...state.products, data]
            }));
          } catch (error) {
            console.error('Error adding product:', error);
            throw error;
          }
        },

        deleteProduct: async (id) => {
          try {
            console.log('Deleting product:', id);
            const { error } = await supabase
              .from('products')
              .delete()
              .eq('id', id);

            if (error) throw error;
            
            set(state => ({
              products: state.products.filter(product => product.id !== id)
            }));
          } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
          }
        },

        addOrder: async (order) => {
          try {
            console.log('Adding order to Supabase:', order);
            const { data, error } = await supabase
              .from('orders')
              .insert([{
                id: order.id,
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