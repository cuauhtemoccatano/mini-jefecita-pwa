/**
 * src/lib/env.js
 * Centralizador de variables de entorno para Mini Jefecita.
 */

export const ENV = {
    SUPABASE_URL:  import.meta.env.VITE_SUPABASE_URL,
    SUPABASE_KEY:  import.meta.env.VITE_SUPABASE_ANON_KEY,
};

export const isSupabaseConfigured = () =>
    !!ENV.SUPABASE_URL && !!ENV.SUPABASE_KEY;
