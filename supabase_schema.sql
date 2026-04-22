-- ============================================================
-- Mini Jefecita — Supabase Schema
-- Ejecutar en SQL Editor de Supabase en este orden
-- ============================================================

-- 1. Activar extensión pgvector
create extension if not exists vector;

-- ============================================================
-- 2. Tabla de usuarios
-- ============================================================
create table if not exists profiles (
    id uuid primary key default gen_random_uuid(),
    device_id text unique not null,        -- fingerprint del dispositivo
    name text,
    jade_name text default 'Jade',
    aura_color text default '#00C4B4',
    aura_preset text default 'jade',
    brain_level text default 'AUTO',
    streak integer default 0,
    onboarded boolean default false,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- ============================================================
-- 3. Tabla de salud
-- ============================================================
create table if not exists health_data (
    id uuid primary key default gen_random_uuid(),
    device_id text not null references profiles(device_id) on delete cascade,
    steps integer default 0,
    energy integer default 0,
    hrv integer default 50,
    recorded_at date default current_date,
    created_at timestamptz default now(),
    unique(device_id, recorded_at)
);

-- ============================================================
-- 4. Tabla de recordatorios
-- ============================================================
create table if not exists reminders (
    id uuid primary key default gen_random_uuid(),
    device_id text not null references profiles(device_id) on delete cascade,
    label text not null,
    scheduled_at timestamptz not null,
    completed boolean default false,
    created_at timestamptz default now()
);

-- ============================================================
-- 5. Tabla de memorias (journal + chat + health trends)
--    Columna embedding para RAG con pgvector
-- ============================================================
create table if not exists memories (
    id uuid primary key default gen_random_uuid(),
    device_id text not null references profiles(device_id) on delete cascade,
    type text not null check (type in ('journal', 'chat', 'health', 'insight')),
    content text not null,                 -- texto encriptado (AES-GCM)
    content_preview text,                  -- primeras palabras sin encriptar para debug
    embedding vector(384),                 -- all-MiniLM-L6-v2 produce 384 dims
    metadata jsonb default '{}',           -- fecha, sentimiento, tags, etc.
    created_at timestamptz default now()
);

-- Índice para búsqueda vectorial rápida (HNSW)
create index if not exists memories_embedding_idx
    on memories using hnsw (embedding vector_cosine_ops)
    with (m = 16, ef_construction = 64);

-- Índice por device_id + tipo
create index if not exists memories_device_type_idx
    on memories(device_id, type, created_at desc);

-- ============================================================
-- 6. Tabla de historial de chat (backup encriptado)
-- ============================================================
create table if not exists chat_history (
    id uuid primary key default gen_random_uuid(),
    device_id text not null references profiles(device_id) on delete cascade,
    role text not null check (role in ('user', 'assistant')),
    content text not null,                 -- encriptado
    model_used text,
    created_at timestamptz default now()
);

create index if not exists chat_history_device_idx
    on chat_history(device_id, created_at desc);

-- ============================================================
-- 7. Función RAG: búsqueda por similitud coseno
-- ============================================================
create or replace function match_memories(
    p_device_id text,
    query_embedding vector(384),
    match_threshold float default 0.7,
    match_count int default 5,
    filter_type text default null          -- null = todos los tipos
)
returns table (
    id uuid,
    type text,
    content text,
    metadata jsonb,
    similarity float,
    created_at timestamptz
)
language plpgsql
as $$
begin
    return query
    select
        m.id,
        m.type,
        m.content,
        m.metadata,
        1 - (m.embedding <=> query_embedding) as similarity,
        m.created_at
    from memories m
    where
        m.device_id = p_device_id
        and m.embedding is not null
        and (filter_type is null or m.type = filter_type)
        and 1 - (m.embedding <=> query_embedding) > match_threshold
    order by m.embedding <=> query_embedding
    limit match_count;
end;
$$;

-- ============================================================
-- 8. Función para obtener tendencias de salud recientes
-- ============================================================
create or replace function get_health_trends(
    p_device_id text,
    days_back int default 7
)
returns table (
    avg_steps numeric,
    avg_hrv numeric,
    avg_energy numeric,
    total_days bigint
)
language plpgsql
as $$
begin
    return query
    select
        round(avg(steps), 0) as avg_steps,
        round(avg(hrv), 1) as avg_hrv,
        round(avg(energy), 0) as avg_energy,
        count(*) as total_days
    from health_data
    where
        device_id = p_device_id
        and recorded_at >= current_date - days_back;
end;
$$;

-- ============================================================
-- 9. Row Level Security (RLS)
-- Desactivado intencionalmente — acceso controlado por device_id
-- desde el cliente. Activar si se agrega Supabase Auth en el futuro.
-- ============================================================
alter table profiles disable row level security;
alter table health_data disable row level security;
alter table reminders disable row level security;
alter table memories disable row level security;
alter table chat_history disable row level security;

-- ============================================================
-- FIN DEL SCHEMA
-- ============================================================
