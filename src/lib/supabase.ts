import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hfgsxjhujejgfnrcswxy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmZ3N4amh1amVqZ2ZucmNzd3h5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI3MTQzOTcsImV4cCI6MjA0ODI5MDM5N30.ExMiGCWbvJjEDg_ikHSMEpEZue95e3mMmVD6ClG6Pjg';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Log successful initialization
console.log('Supabase client initialized successfully');