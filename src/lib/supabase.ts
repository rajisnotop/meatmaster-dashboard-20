import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hfgsxjhujejgfnrcswxy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmZ3N4amh1amVqZ2ZucmNzd3h5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI3MTQzOTcsImV4cCI6MjA0ODI5MDM5N30.ExMiGCWbvJjEDg_ikHSMEpEZue95e3mMmVD6ClG6Pjg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const fetchExpenses = async () => {
  try {
    console.log('Fetching expenses...');
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching expenses:', error);
      if (error.code === '42P01') {
        throw new Error('Expenses table does not exist. Please run the migrations first.');
      }
      throw new Error(`Failed to fetch expenses: ${error.message}`);
    }

    console.log('Fetched expenses:', data);
    return data?.map(expense => ({
      ...expense,
      date: new Date(expense.date),
      paymentMethod: expense.payment_method
    })) || [];
  } catch (error) {
    console.error('Error in fetchExpenses:', error);
    throw error instanceof Error ? error : new Error('Unknown error in fetchExpenses');
  }
};