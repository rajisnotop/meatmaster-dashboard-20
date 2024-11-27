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
  customer_name: string;
  product_id: string;
  quantity: number;
  total: number;
  date: string;
  is_paid: boolean;
  was_unpaid: boolean;
  paid_with_qr: boolean;
}