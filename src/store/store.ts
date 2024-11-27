import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Product, Order, Expense } from '@/types/types';
import { supabase } from '@/lib/supabase';

interface StoreState {
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
        
        initializeData: async () => {
          // Fetch initial data from Supabase
          const [productsRes, ordersRes, expensesRes] = await Promise.all([
            supabase.from('products').select('*'),
            supabase.from('orders').select('*'),
            supabase.from('expenses').select('*')
          ]);

          if (productsRes.error) console.error('Error fetching products:', productsRes.error);
          if (ordersRes.error) console.error('Error fetching orders:', ordersRes.error);
          if (expensesRes.error) console.error('Error fetching expenses:', expensesRes.error);

          set({
            products: productsRes.data || [],
            orders: ordersRes.data || [],
            expenses: expensesRes.data || []
          });

          // Subscribe to real-time changes
          supabase
            .channel('table-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, 
              payload => {
                console.log('Product change received:', payload);
                const currentProducts = get().products;
                switch (payload.eventType) {
                  case 'INSERT':
                    set({ products: [...currentProducts, payload.new as Product] });
                    break;
                  case 'DELETE':
                    set({ products: currentProducts.filter(p => p.id !== payload.old.id) });
                    break;
                  case 'UPDATE':
                    set({ products: currentProducts.map(p => p.id === payload.new.id ? payload.new as Product : p) });
                    break;
                }
              })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' },
              payload => {
                console.log('Order change received:', payload);
                const currentOrders = get().orders;
                switch (payload.eventType) {
                  case 'INSERT':
                    set({ orders: [...currentOrders, payload.new as Order] });
                    break;
                  case 'DELETE':
                    set({ orders: currentOrders.filter(o => o.id !== payload.old.id) });
                    break;
                  case 'UPDATE':
                    set({ orders: currentOrders.map(o => o.id === payload.new.id ? payload.new as Order : o) });
                    break;
                }
              })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'expenses' },
              payload => {
                console.log('Expense change received:', payload);
                const currentExpenses = get().expenses;
                switch (payload.eventType) {
                  case 'INSERT':
                    set({ expenses: [...currentExpenses, payload.new as Expense] });
                    break;
                  case 'DELETE':
                    set({ expenses: currentExpenses.filter(e => e.id !== payload.old.id) });
                    break;
                  case 'UPDATE':
                    set({ expenses: currentExpenses.map(e => e.id === payload.new.id ? payload.new as Expense : e) });
                    break;
                }
              })
            .subscribe();
        },

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

        // Keep existing calculation methods
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
