-- ============================================================
-- Mini Jefecita — Row Level Security (RLS)
-- Ejecutar en SQL Editor de Supabase DESPUÉS del schema inicial
-- ============================================================

-- Activar RLS en todas las tablas
alter table profiles    enable row level security;
alter table health_data enable row level security;
alter table reminders   enable row level security;
alter table memories    enable row level security;
alter table chat_history enable row level security;

-- ============================================================
-- Políticas: solo el device_id del request puede ver sus datos
-- Usamos un header personalizado x-device-id para identificar
-- ============================================================

-- profiles
create policy "device puede ver su perfil"
    on profiles for select
    using (device_id = current_setting('request.headers', true)::json->>'x-device-id');

create policy "device puede insertar su perfil"
    on profiles for insert
    with check (device_id = current_setting('request.headers', true)::json->>'x-device-id');

create policy "device puede actualizar su perfil"
    on profiles for update
    using (device_id = current_setting('request.headers', true)::json->>'x-device-id');

-- health_data
create policy "device puede ver su salud"
    on health_data for select
    using (device_id = current_setting('request.headers', true)::json->>'x-device-id');

create policy "device puede insertar salud"
    on health_data for insert
    with check (device_id = current_setting('request.headers', true)::json->>'x-device-id');

create policy "device puede actualizar salud"
    on health_data for update
    using (device_id = current_setting('request.headers', true)::json->>'x-device-id');

-- reminders
create policy "device puede ver sus recordatorios"
    on reminders for select
    using (device_id = current_setting('request.headers', true)::json->>'x-device-id');

create policy "device puede insertar recordatorios"
    on reminders for insert
    with check (device_id = current_setting('request.headers', true)::json->>'x-device-id');

create policy "device puede borrar sus recordatorios"
    on reminders for delete
    using (device_id = current_setting('request.headers', true)::json->>'x-device-id');

-- memories
create policy "device puede ver sus memorias"
    on memories for select
    using (device_id = current_setting('request.headers', true)::json->>'x-device-id');

create policy "device puede insertar memorias"
    on memories for insert
    with check (device_id = current_setting('request.headers', true)::json->>'x-device-id');

-- chat_history
create policy "device puede ver su historial"
    on chat_history for select
    using (device_id = current_setting('request.headers', true)::json->>'x-device-id');

create policy "device puede insertar historial"
    on chat_history for insert
    with check (device_id = current_setting('request.headers', true)::json->>'x-device-id');

-- ============================================================
-- FIN RLS
-- ============================================================
