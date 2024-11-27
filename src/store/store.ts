import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Product, Order, Expense } from '@/types/types';
import { supabase } from '@/lib/supabase';
import { initializeStore } from './storeInitializer';

export interface StoreState {
  products: Product[];
  orders: Order[];
  expenses: Expense[];
  totalExpenses: number;
  openingBalance: number;
  cashInCounter: number;
  netProfit: number;
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
        totalExpenses: 0,
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
          // Format the order data to match Supabase column names
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
          // Format the order data to match Supabase column names
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

        addExpense: async (expense) => {
          // Format the expense data to match Supabase column names
          const supabaseExpense = {
            category: expense.category,
            amount: expense.amount,
            description: expense.description,
            date: expense.date.toISOString(),
            payment_method: expense.paymentMethod
          };

          const { data, error } = await supabase
            .from('expenses')
            .insert([supabaseExpense])
            .select()
            .single();

          if (error) throw error;
          set(state => ({ expenses: [...state.expenses, { ...expense, id: data.id }] }));
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