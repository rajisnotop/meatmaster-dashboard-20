import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Product, Order, Expense } from '@/types/types';
import { supabase } from '@/lib/supabase';
import { initializeStore } from './storeInitializer';

export interface StoreState {
  products: Product[];
  orders: Order[];
  expenses: Expense[];
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addOrder: (order: Order) => Promise<void>;
  updateOrder: (order: Order) => Promise<void>;
  updateOrderStatus: (id: string, isPaid: boolean, paidWithQR?: boolean) => Promise<void>;
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  getSuppliesExpenses: () => number;
  getCashExpenses: () => number;
  getOnlineExpenses: () => number;
  setOrders: (orders: Order[]) => void;
  setExpenses: (expenses: Expense[]) => void;
  initializeData: () => Promise<void>;
}

export const useStore = create<StoreState>()(
  devtools(
    persist(
      (set, get) => ({
        products: [],
        orders: [],
        expenses: [],
        
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
          const { data, error } = await supabase
            .from('orders')
            .insert([{ ...order }])
            .select()
            .single();

          if (error) throw error;
          set(state => ({ orders: [...state.orders, data] }));
        },

        updateOrder: async (updatedOrder) => {
          const { error } = await supabase
            .from('orders')
            .update(updatedOrder)
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
              isPaid, 
              paidWithQR,
              wasUnpaid: true 
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

        addExpense: async (expense) => {
          const { data, error } = await supabase
            .from('expenses')
            .insert([{ ...expense }])
            .select()
            .single();

          if (error) throw error;
          set(state => ({ expenses: [...state.expenses, data] }));
        },

        deleteExpense: async (id) => {
          const { error } = await supabase
            .from('expenses')
            .delete()
            .eq('id', id);

          if (error) throw error;
          set(state => ({
            expenses: state.expenses.filter(expense => expense.id !== id)
          }));
        },

        getSuppliesExpenses: () => {
          const expenses = get().expenses;
          return expenses
            .filter(expense => expense.category === "Supplies")
            .reduce((sum, expense) => sum + expense.amount, 0);
        },

        getCashExpenses: () => {
          const expenses = get().expenses;
          return expenses
            .filter(expense => expense.paymentMethod === "cash")
            .reduce((sum, expense) => sum + expense.amount, 0);
        },

        getOnlineExpenses: () => {
          const expenses = get().expenses;
          return expenses
            .filter(expense => expense.paymentMethod === "online")
            .reduce((sum, expense) => sum + expense.amount, 0);
        },

        setOrders: (orders) => set({ orders }),
        setExpenses: (expenses) => set({ expenses }),

      }),
      {
        name: 'meat-shop-storage',
      }
    )
  )
);

// Initialize data when the app starts
useStore.getState().initializeData();
