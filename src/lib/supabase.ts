import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hfgsxjhujejgfnrcswxy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmZ3N4amh1amVqZ2ZucmNzd3h5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI3MTQzOTcsImV4cCI6MjA0ODI5MDM5N30.ExMiGCWbvJjEDg_ikHSMEpEZue95e3mMmVD6ClG6Pjg';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  },
  db: {
    schema: 'public'
  },
  headers: {
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${supabaseAnonKey}`
  }
});

export const fetchExpenses = async () => {
  try {
    console.log('Fetching expenses...');
    const { data, error } = await supabase
      .from('expenses')
      .select('category, amount, description, date, paymentmethod')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching expenses:', error);
      throw new Error(`Failed to fetch expenses: ${error.message}`);
    }

    console.log('Fetched expenses:', data);
    return data || [];
  } catch (error) {
    console.error('Error in fetchExpenses:', error);
    throw error instanceof Error ? error : new Error('Unknown error in fetchExpenses');
  }
};

// Initialize auth state listener
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    console.log('User signed out');
  } else if (event === 'SIGNED_IN') {
    console.log('User signed in');
  }
});