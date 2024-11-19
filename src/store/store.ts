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
  customerName: string;
  productId: string;
  quantity: number;
  total: number;
  date: Date;
}

interface StoreState {
  products: Product[];
  orders: Order[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  deleteProduct: (id: string) => void;
  addOrder: (order: Omit<Order, 'id' | 'date'>) => void;
}

export const useStore = create<StoreState>()(
  devtools(
    persist(
      (set) => ({
        products: [],
        orders: [],
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
              { ...order, id: crypto.randomUUID(), date: new Date() },
            ],
          })),
      }),
      {
        name: 'meat-shop-storage',
      }
    )
  )
);