import { supabase } from '@/lib/supabase';
import { transformDatabaseOrder, transformDatabaseExpense } from '@/utils/dataTransformers';
import { DatabaseOrder, DatabaseProduct, DatabaseExpense, SupabasePayload } from '@/types/supabase';
import { StoreState } from './store';

export const initializeStore = async (set: (state: Partial<StoreState>) => void, get: () => StoreState) => {
  try {
    console.log('Initializing data from Supabase...');
    
    const productsRes = await supabase.from('products').select('*');
    if (productsRes.error) {
      console.error('Error fetching products:', productsRes.error);
    }

    const ordersRes = await supabase.from('orders').select(`
      id,
      customername,
      productid,
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

    const transformedOrders = ordersRes.data?.map(transformDatabaseOrder) || [];
    const transformedExpenses = expensesRes.data?.map(transformDatabaseExpense) || [];

    set({
      products: (productsRes.data || []) as DatabaseProduct[],
      orders: transformedOrders,
      expenses: transformedExpenses
    });

    // Set up real-time subscriptions
    const channel = supabase
      .channel('table-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, 
        (payload: SupabasePayload<DatabaseProduct>) => {
          console.log('Product change received:', payload);
          const currentProducts = get().products;
          switch (payload.eventType) {
            case 'INSERT':
              if (payload.new) {
                set({ products: [...currentProducts, payload.new] });
              }
              break;
            case 'DELETE':
              if (payload.old) {
                set({ products: currentProducts.filter(p => p.id !== payload.old?.id) });
              }
              break;
            case 'UPDATE':
              if (payload.new) {
                set({ products: currentProducts.map(p => p.id === payload.new?.id ? payload.new : p) });
              }
              break;
          }
        })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' },
        (payload: SupabasePayload<DatabaseOrder>) => {
          console.log('Order change received:', payload);
          const currentOrders = get().orders;
          const transformedOrder = payload.new ? transformDatabaseOrder(payload.new) : null;

          switch (payload.eventType) {
            case 'INSERT':
              if (transformedOrder) {
                set({ orders: [...currentOrders, transformedOrder] });
              }
              break;
            case 'DELETE':
              if (payload.old) {
                set({ orders: currentOrders.filter(o => o.id !== payload.old?.id) });
              }
              break;
            case 'UPDATE':
              if (transformedOrder) {
                set({ orders: currentOrders.map(o => o.id === transformedOrder.id ? transformedOrder : o) });
              }
              break;
          }
        })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'expenses' },
        (payload: SupabasePayload<DatabaseExpense>) => {
          console.log('Expense change received:', payload);
          const currentExpenses = get().expenses;
          const transformedExpense = payload.new ? transformDatabaseExpense(payload.new) : null;

          switch (payload.eventType) {
            case 'INSERT':
              if (transformedExpense) {
                set({ expenses: [...currentExpenses, transformedExpense] });
              }
              break;
            case 'DELETE':
              if (payload.old) {
                set({ expenses: currentExpenses.filter(e => e.id !== payload.old?.id) });
              }
              break;
            case 'UPDATE':
              if (transformedExpense) {
                set({ expenses: currentExpenses.map(e => e.id === transformedExpense.id ? transformedExpense : e) });
              }
              break;
          }
        });

    channel.subscribe(status => {
      console.log('Realtime subscription status:', status);
    });
  } catch (error) {
    console.error('Error initializing store:', error);
  }
};