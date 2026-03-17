import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lskavzevxnkcmxsfqvls.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxza2F2emV2eG5rY214c2ZxdmxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2NjE4MzQsImV4cCI6MjA4OTIzNzgzNH0.8EX5wMS7T7-T1BL_rKzzJE6ZMm3-XUJKAOvwPN0Pd7U';

let client: SupabaseClient | null = null;

export const getSupabase = () => {
  if (!client) {
    client = createClient(SUPABASE_URL, SUPABASE_KEY);
  }
  return client;
};
