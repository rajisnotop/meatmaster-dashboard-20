import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Provide meaningful error messages for missing configuration
if (!supabaseUrl) {
  console.error('VITE_SUPABASE_URL is not configured in environment variables');
}
if (!supabaseKey) {
  console.error('VITE_SUPABASE_ANON_KEY is not configured in environment variables');
}

// Use fallback values for development to prevent crashes
const url = supabaseUrl || 'https://your-project-url.supabase.co';
const key = supabaseKey || 'your-anon-key';

export const supabase = createClient(url, key);

// Log initialization status
console.log('Supabase Client initialized with URL:', url);