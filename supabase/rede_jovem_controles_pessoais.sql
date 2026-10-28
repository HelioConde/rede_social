-- Rede Jovem: controles pessoais e permissões de coluna
-- Executar SOMENTE no projeto Supabase exclusivo da Rede Jovem,
-- DEPOIS de supabase/rede_jovem_mvp.sql.
-- Esta atualização é aditiva e reexecutável.

create table if not exists public.rj_mutes (
  owner_id uuid not null references public.rj_profiles(id) on delete cascade,
  muted_id uuid not null references public.rj_profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (owner_id, muted_id),
  constraint rj_mutes_not_self check (owner_id <> muted_id)
);
create index if not exists rj_mutes_owner_idx on public.rj_mutes(owner_id);
alter table public.rj_mutes enable row level security;

drop policy if exists "rj mutes select own" on public.rj_mutes;
create policy "rj mutes select own" on public.rj_mutes for select
to authenticated using ((select auth.uid()) = owner_id);
drop policy if exists "rj mutes insert own" on public.rj_mutes;
create policy "rj mutes insert own" on public.rj_mutes for insert
to authenticated with check ((select auth.uid()) = owner_id);
drop policy if exists "rj mutes delete own" on public.rj_mutes;
create policy "rj mutes delete own" on public.rj_mutes for delete
to authenticated using ((select auth.uid()) = owner_id);

revoke all on public.rj_mutes from anon, authenticated;
grant select, insert(owner_id, muted_id), delete on public.rj_mutes to authenticated;

-- Endurecimento das colunas mutáveis. Frontend só pode alterar texto/perfil
-- e não autor, ID ou data de criação. RLS segue obrigatório.
revoke insert, update on public.rj_profiles from authenticated;
grant insert(id, handle, name, bio) on public.rj_profiles to authenticated;
grant update(handle, name, bio) on public.rj_profiles to authenticated;

revoke insert, update on public.rj_posts from authenticated;
grant insert(author_id, content) on public.rj_posts to authenticated;
grant update(content) on public.rj_posts to authenticated;

revoke insert on public.rj_comments from authenticated;
grant insert(post_id, author_id, content) on public.rj_comments to authenticated;

revoke insert on public.rj_likes from authenticated;
grant insert(post_id, user_id) on public.rj_likes to authenticated;

revoke insert on public.rj_reports from authenticated;
grant insert(post_id, reporter_id, reason) on public.rj_reports to authenticated;

-- Conferência: verificar RLS + permissões no projeto dedicado.
-- select * from pg_policies where schemaname='public' and tablename='rj_mutes';
-- select table_name, privilege_type from information_schema.role_table_grants
-- where grantee='authenticated' and table_name like 'rj_%';
