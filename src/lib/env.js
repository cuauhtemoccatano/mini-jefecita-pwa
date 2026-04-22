/**
 * src/lib/env.js
 * Centralizador de variables de entorno para Mini Jefecita.
 */

export const ENV = {
    SUPABASE_URL:  import.meta.env?.VITE_SUPABASE_URL || '',
    SUPABASE_KEY:  import.meta.env?.VITE_SUPABASE_ANON_KEY || '',
};

let _warned = false;

export const isSupabaseConfigured = () => {
    const isOk = !!ENV.SUPABASE_URL && !!ENV.SUPABASE_KEY;
    if (!isOk && !_warned) {
        console.warn('⚠️ MQA: Central Intelligence (Supabase) not configured. Cloud sync and persistent RAG will be unavailable.');
        _warned = true;
    }
    return isOk;
};
