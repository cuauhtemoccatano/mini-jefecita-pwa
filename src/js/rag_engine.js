/**
 * src/js/rag_engine.js - Retrieval Augmented Generation
 * Memoria semántica para conversaciones personalizadas
 */

import { supabase } from './supabase.js';
import { isSupabaseConfigured } from '../lib/env.js';
import { embed } from './embedder.js';
import { encrypt, decrypt } from './crypto_engine.js';
import { useStore } from './store/useStore.js';

export { isSupabaseConfigured };

// device_id único y persistente por dispositivo
function getDeviceId() {
    let id = localStorage.getItem('mqa_device_id');
    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem('mqa_device_id', id);
    }
    return id;
}

// ---------------------------------------------------------
// Guardar memoria (journal, chat, health, insight)
// ---------------------------------------------------------
export async function saveMemory({ type, content, metadata = {} }) {
    if (!isSupabaseConfigured() || !content?.trim()) return;

    try {
        const deviceId  = getDeviceId();
        const embedding = await embed(content);
        const encrypted = await encrypt(content);

        await supabase.from('memories').insert({
            device_id:       deviceId,
            type,
            content:         encrypted,
            embedding,
            metadata: {
                ...metadata,
                timestamp: new Date().toISOString(),
                brain: useStore.getState().userData?.brain
            }
        });
    } catch (e) {
        console.warn('⚠️ RAG saveMemory:', e.message);
    }
}

// ---------------------------------------------------------
// Recuperar memorias relevantes por similitud semántica
// ---------------------------------------------------------
export async function retrieveMemories(query, { type = null, limit = 5, threshold = 0.65 } = {}) {
    if (!isSupabaseConfigured()) return [];

    try {
        const deviceId      = getDeviceId();
        const queryEmbedding = await embed(query);
        if (!queryEmbedding) return [];

        const { data: results, error } = await supabase.rpc('match_memories', {
            p_device_id:      deviceId,
            query_embedding:  queryEmbedding,
            match_threshold:  threshold,
            match_count:      limit,
            filter_type:      type
        });

        if (error || !Array.isArray(results)) return [];

        const decrypted = await Promise.all(
            results.map(async (r) => {
                const text = await decrypt(r.content);
                return text ? { ...r, content: text } : null;
            })
        );

        return decrypted.filter(Boolean);
    } catch (e) {
        console.warn('⚠️ RAG retrieveMemories:', e.message);
        return [];
    }
}

// ---------------------------------------------------------
// Construir contexto RAG para inyectar en el prompt
// ---------------------------------------------------------
export async function buildRAGContext(userMessage) {
    if (!isSupabaseConfigured()) return '';

    try {
        const memories = await retrieveMemories(userMessage, { limit: 5, threshold: 0.65 });
        if (!memories.length) return '';

        const formatted = memories.map(m => {
            const date  = new Date(m.created_at).toLocaleDateString('es-MX', {
                weekday: 'short', month: 'short', day: 'numeric'
            });
            const label = { journal: '📓 Diario', chat: '💬 Conversación', health: '💚 Salud', insight: '✨ Insight' }[m.type] || m.type;
            return `[${label} — ${date}]: ${m.content}`;
        }).join('\n');

        return `\nMEMORIA RELEVANTE:\n${formatted}\n`;
    } catch (e) {
        return '';
    }
}

// ---------------------------------------------------------
// Guardar perfil de usuario en Supabase
// ---------------------------------------------------------
export async function syncProfile() {
    const { userData } = useStore.getState();
    if (!isSupabaseConfigured() || !userData) return;

    try {
        await supabase.from('profiles').upsert({
            device_id:  getDeviceId(),
            name:       userData.name,
            jade_name:  userData.jadeName,
            aura_color: userData.auraColor,
            aura_preset: userData.auraPreset,
            brain_level: userData.brain,
            streak:     userData.streak,
            onboarded:  userData.onboarded,
            updated_at: new Date().toISOString()
        });
    } catch (e) {
        console.warn('⚠️ RAG syncProfile:', e.message);
    }
}

// ---------------------------------------------------------
// Restaurar perfil desde Supabase (si localStorage fue borrado)
// ---------------------------------------------------------
export async function restoreProfile() {
    if (!isSupabaseConfigured()) return null;

    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('device_id', getDeviceId());

        if (error || !Array.isArray(data) || !data.length) return null;

        const p = data[0];
        return {
            name:           p.name,
            jadeName:       p.jade_name,
            auraColor:      p.aura_color,
            auraPreset:     p.aura_preset,
            brain:          p.brain_level,
            streak:         p.streak,
            onboarded:      p.onboarded,
            chatHistory:    [],
            remindersCount: 0
        };
    } catch (e) {
        return null;
    }
}

// ---------------------------------------------------------
// Guardar recordatorios en Supabase
// ---------------------------------------------------------
export async function syncReminders(reminders) {
    if (!isSupabaseConfigured()) return;

    try {
        const deviceId = getDeviceId();
        await supabase.from('reminders').delete().eq('device_id', deviceId);

        if (reminders.length) {
            await supabase.from('reminders').insert(reminders.map(r => ({
                device_id:    deviceId,
                label:        r.label,
                scheduled_at: r.date,
                completed:    r.completed || false
            })));
        }
    } catch (e) {
        console.warn('⚠️ RAG syncReminders:', e.message);
    }
}

// ---------------------------------------------------------
// Guardar datos de salud en Supabase
// ---------------------------------------------------------
export async function syncHealth(healthData) {
    if (!isSupabaseConfigured() || !healthData) return;

    try {
        await supabase.from('health_data').upsert({
            device_id:   getDeviceId(),
            steps:       healthData.steps,
            energy:      healthData.energy,
            hrv:         healthData.hrv,
            recorded_at: new Date().toISOString().split('T')[0]
        });

        if (healthData.steps > 0 || healthData.hrv > 0) {
            await saveMemory({
                type:    'health',
                content: `Pasos: ${healthData.steps}, HRV: ${healthData.hrv}ms, Energía: ${healthData.energy}kcal`,
                metadata: { steps: healthData.steps, hrv: healthData.hrv, energy: healthData.energy }
            });
        }
    } catch (e) {
        console.warn('⚠️ RAG syncHealth:', e.message);
    }
}
