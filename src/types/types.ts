export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export interface Order {
  id: string;
  customerName?: string;
  productId: string;
  quantity: number;
  total: number;
  date: Date;
  isPaid: boolean;
  wasUnpaid: boolean;
  paidWithQR: boolean;
  description?: string;
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: Date;
  paymentMethod: 'cash' | 'online';
}

export interface GridData {
  [key: string]: {
    value: string;
    id: string;
    style?: {
      bold?: boolean;
      italic?: boolean;
      underline?: boolean;
      color?: string;
      backgroundColor?: string;
      align?: 'left' | 'center' | 'right';
    };
    formula?: string;
  };
}