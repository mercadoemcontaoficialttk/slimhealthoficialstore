import { createClient } from '@supabase/supabase-js';

// Lovable Cloud Supabase Configuration
// These are public credentials safe for frontend use
export const SUPABASE_URL = "https://bnqilgvlvxfhpfasqhtk.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJucWlsZ3ZsdnhmaHBmYXNxaHRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0NTk1NjgsImV4cCI6MjA1NDAzNTU2OH0.TKvIOF6E3K-uC4K7-728g3Nrv1XwA-bvqFdRWI9PLWQ";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
