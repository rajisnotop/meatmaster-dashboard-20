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