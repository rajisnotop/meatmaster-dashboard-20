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
          try {
            console.log('Initializing data from Supabase...');
            
            const productsRes = await supabase.from('products').select('*');
            if (productsRes.error) {
              console.error('Error fetching products:', productsRes.error);
            }

            // Update the select query to use snake_case column names
            const ordersRes = await supabase.from('orders').select(`
              id,
              customer_name,
              product_id,
              quantity,
              total,
              date,
              is_paid,
              was_unpaid,
              paid_with_qr
            `);
            if (ordersRes.error) {
              console.error('Error fetching orders:', ordersRes.error);
            }

            const expensesRes = await supabase.from('expenses').select('*');
            if (expensesRes.error) {
              console.error('Error fetching expenses:', expensesRes.error);
            }

            // Transform the data to match our frontend camelCase format
            const transformedOrders = ordersRes.data?.map(order => ({
              id: order.id,
              customerName: order.customer_name,
              productId: order.product_id,
              quantity: order.quantity,
              total: order.total,
              date: order.date,
              isPaid: order.is_paid,
              wasUnpaid: order.was_unpaid,
              paidWithQR: order.paid_with_qr
            })) || [];

            set({
              products: productsRes.data || [],
              orders: transformedOrders,
              expenses: expensesRes.data || []
            });

            console.log('Data initialization completed');

            // Set up real-time subscriptions
            const channel = supabase
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
                  const transformedOrder = payload.new ? {
                    id: payload.new.id,
                    customerName: payload.new.customer_name,
                    productId: payload.new.product_id,
                    quantity: payload.new.quantity,
                    total: payload.new.total,
                    date: payload.new.date,
                    isPaid: payload.new.is_paid,
                    wasUnpaid: payload.new.was_unpaid,
                    paidWithQR: payload.new.paid_with_qr
                  } : null;

                  switch (payload.eventType) {
                    case 'INSERT':
                      if (transformedOrder) {
                        set({ orders: [...currentOrders, transformedOrder] });
                      }
                      break;
                    case 'DELETE':
                      set({ orders: currentOrders.filter(o => o.id !== payload.old.id) });
                      break;
                    case 'UPDATE':
                      if (transformedOrder) {
                        set({ orders: currentOrders.map(o => o.id === transformedOrder.id ? transformedOrder : o) });
                      }
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
                });

            channel.subscribe(status => {
              console.log('Realtime subscription status:', status);
            });
          } catch (error) {
            console.error('Error initializing data:', error);
          }
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