import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Product, Order, Expense } from '@/types/types';

interface StoreState {
  products: Product[];
  orders: Order[];
  expenses: Expense[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  deleteProduct: (id: string) => void;
  addOrder: (order: Order) => void;
  updateOrder: (order: Order) => void;
  updateOrderStatus: (id: string, isPaid: boolean, paidWithQR?: boolean) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
}

export const useStore = create<StoreState>()(
  devtools(
    persist(
      (set) => ({
        products: [],
        orders: [],
        expenses: [],
        addProduct: (product) =>
          set((state) => ({
            products: [...state.products, { ...product, id: crypto.randomUUID() }],
          })),
        deleteProduct: (id) =>
          set((state) => ({
            products: state.products.filter((product) => product.id !== id),
          })),
        addOrder: (order) => {
          set((state) => ({
            orders: [
              ...state.orders,
              { 
                ...order,
                id: order.id || crypto.randomUUID(),
                wasUnpaid: !order.isPaid,
                paidWithQR: order.paidWithQR || false,
                date: order.date || new Date()
              },
            ],
          }));
        },
        updateOrder: (updatedOrder) => {
          set((state) => ({
            orders: state.orders.map((order) =>
              order.id === updatedOrder.id ? updatedOrder : order
            ),
          }));
        },
        updateOrderStatus: (id, isPaid, paidWithQR = false) =>
          set((state) => ({
            orders: state.orders.map((order) =>
              order.id === id 
                ? { 
                    ...order, 
                    isPaid, 
                    wasUnpaid: !order.isPaid,
                    paidWithQR: paidWithQR 
                  } 
                : order
            ),
          })),
        addExpense: (expense) =>
          set((state) => ({
            expenses: [
              ...state.expenses,
              { ...expense, id: crypto.randomUUID() },
            ],
          })),
        deleteExpense: (id) =>
          set((state) => ({
            expenses: state.expenses.filter((expense) => expense.id !== id),
          })),
      }),
      {
        name: 'meat-shop-storage',
      }
    )
  )
);