import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hfgsxjhujejgfnrcswxy.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmZ3N4amh1amVqZ2ZucmNzd3h5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMjcxNDM5NywiZXhwIjoyMDQ4MjkwMzk3fQ.R_5YV8Rv8xhmloOEkg2xJQ9WMetTZkgL8-kRYzkdbnU';

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  },
  global: {
    headers: {
      'apikey': supabaseServiceKey,
      'Authorization': `Bearer ${supabaseServiceKey}`
    }
  }
});

export const fetchExpenses = async () => {
  try {
    console.log('Fetching expenses...');
    const { data, error } = await supabase
      .from('expenses')
      .select('category, amount, description, date, paymentmethod');

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