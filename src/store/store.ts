import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface Order {
  id: string;
  customerName?: string;  // Made optional
  productId: string;
  quantity: number;
  total: number;
  date: Date;
  isPaid: boolean;  // New field
  description?: string;  // New field
}

interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: Date;
}

interface StoreState {
  products: Product[];
  orders: Order[];
  expenses: Expense[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  deleteProduct: (id: string) => void;
  addOrder: (order: Omit<Order, 'id' | 'date'>) => void;
  updateOrderStatus: (id: string, isPaid: boolean) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
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
        addOrder: (order) =>
          set((state) => ({
            orders: [
              ...state.orders,
              { ...order, id: crypto.randomUUID(), date: new Date(), isPaid: false },
            ],
          })),
        updateOrderStatus: (id, isPaid) =>
          set((state) => ({
            orders: state.orders.map((order) =>
              order.id === id ? { ...order, isPaid } : order
            ),
          })),
        addExpense: (expense) =>
          set((state) => ({
            expenses: [
              ...state.expenses,
              { ...expense, id: crypto.randomUUID() },
            ],
          })),
      }),
      {
        name: 'meat-shop-storage',
      }
    )
  )
);