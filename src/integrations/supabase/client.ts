import { createClient } from '@supabase/supabase-js';

// Lovable Cloud Supabase Configuration
// These are public credentials safe for frontend use
export const SUPABASE_URL = "https://iwhdppjqvrginaebgnmu.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3aGRwcGpxdnJnaW5hZWJnbm11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMzI2OTksImV4cCI6MjA4NTgwODY5OX0.BwO3we0vZzmig6XeRn_3dXNnDdub-6aj09RDaYZ6JCc";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
