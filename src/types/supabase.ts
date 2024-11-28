export interface SupabasePayload<T> {
  commit_timestamp: string;
  errors: null | any[];
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: T | null;
  old: T | null;
  schema: string;
  table: string;
}

export interface DatabaseOrder {
  id: string;
  customername: string;
  productid: string;
  quantity: number;
  total: number;
  date: string;
  ispaid: boolean;
  wasunpaid: boolean;
  paidwithqr: boolean;
}

export interface DatabaseProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export interface DatabaseExpense {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: string;
  payment_method: string;
}