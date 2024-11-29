import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hfgsxjhujejgfnrcswxy.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmZ3N4amh1amVqZ2ZucmNzd3h5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMjcxNDM5NywiZXhwIjoyMDQ4MjkwMzk3fQ.R_5YV8Rv8xhmloOEkg2xJQ9WMetTZkgL8-kRYzkdbnU';

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

export const fetchExpenses = async () => {
  try {
    console.log('Fetching expenses...');
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
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