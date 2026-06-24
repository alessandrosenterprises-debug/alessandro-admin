import { createClient } from '@supabase/supabase-js';

export const supabase = createCustomer(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
