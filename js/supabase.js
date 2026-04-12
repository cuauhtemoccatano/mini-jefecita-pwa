// ---------------------------------------------------------
// js/supabase.js - Cliente REST ligero para PWA vanilla
// Sin dependencia del SDK — fetch directo a la API de Supabase
// ---------------------------------------------------------
import { CONFIG } from './config.js';

const SUPABASE_URL = CONFIG.SUPABASE_URL;
const SUPABASE_KEY = CONFIG.SUPABASE_ANON_KEY;

export const isSupabaseConfigured = () =>
    !!SUPABASE_URL && !!SUPABASE_KEY &&
    !SUPABASE_URL.includes('TU_SUPABASE');

function headers(extra = {}) {
    const deviceId = localStorage.getItem('mqa_device_id') || '';
    return {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=representation',
        'x-device-id': deviceId,
        ...extra
    };
}

// ---------------------------------------------------------
// REST helpers
// ---------------------------------------------------------
async function restFetch(path, options = {}) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
        ...options,
        headers: headers(options.headers || {})
    });
    if (!res.ok && res.status !== 204) {
        const err = await res.json().catch(() => ({}));
        console.warn('⚠️ Supabase error:', err.message || res.status);
        return null;
    }
    if (res.status === 204) return true;
    return res.json().catch(() => null);
}

// ---------------------------------------------------------
// API pública
// ---------------------------------------------------------
export const supabase = {

    // SELECT
    async select(table, { columns = '*', filters = {}, limit = null } = {}) {
        const params = new URLSearchParams({ select: columns });
        Object.entries(filters).forEach(([k, v]) => params.set(k, v));
        if (limit) params.set('limit', limit);
        return restFetch(`/${table}?${params}`);
    },

    // INSERT
    async insert(table, data) {
        return restFetch(`/${table}`, {
            method: 'POST',
            body: JSON.stringify(Array.isArray(data) ? data : [data])
        });
    },

    // UPSERT
    async upsert(table, data, onConflict = 'device_id') {
        return restFetch(`/${table}?on_conflict=${onConflict}`, {
            method: 'POST',
            headers: { 'Prefer': 'resolution=merge-duplicates,return=representation' },
            body: JSON.stringify(Array.isArray(data) ? data : [data])
        });
    },

    // UPDATE
    async update(table, data, filters = {}) {
        const params = new URLSearchParams(filters);
        return restFetch(`/${table}?${params}`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    },

    // DELETE
    async delete(table, filters = {}) {
        const params = new URLSearchParams(filters);
        return restFetch(`/${table}?${params}`, { method: 'DELETE' });
    },

    // RPC (funciones SQL)
    async rpc(fn, params = {}) {
        return restFetch(`/rpc/${fn}`, {
            method: 'POST',
            body: JSON.stringify(params)
        });
    }
};
