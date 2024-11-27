import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hfgsxjhujejgfnrcswxy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmZ3N4amh1amVqZ2ZucmNzd3h5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI3MTQzOTcsImV4cCI6MjA0ODI5MDM5N30.ExMiGCWbvJjEDg_ikHSMEpEZue95e3mMmVD6ClG6Pjg';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Log successful initialization
console.log('Supabase client initialized successfully');

// Create a channel for connection status
const statusChannel = supabase.channel('connection_status');

// Subscribe to connection status events
statusChannel
  .subscribe((status) => {
    if (status === 'SUBSCRIBED') {
      console.log('Realtime connection established');
    }
    if (status === 'CLOSED') {
      console.log('Realtime connection closed');
    }
    if (status === 'CHANNEL_ERROR') {
      console.error('Realtime connection error');
    }
  });