/**
 * src/js/supabase.js
 * Cliente oficial de Supabase integrado con el sistema de Mini Jefecita.
 */
import { createClient } from '@supabase/supabase-js';
import { ENV } from '../lib/env.js';

const deviceId = localStorage.getItem('mqa_device_id') || 'unknown';

export const supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_KEY, {
    global: {
        headers: { 'x-device-id': deviceId }
    }
});
