-- Rede Jovem - moderação humana (etapa pré-lançamento)
-- Aplicar em projeto DEDICADO, depois de rede_jovem_mvp.sql e rede_jovem_controles_pessoais.sql.
-- Nenhum dado de outro projeto deve ser usado.

-- Moderadores são nomeados exclusivamente via SQL Editor confiável (service role).
-- Usuarios autenticados NÃO recebem INSERT, UPDATE ou DELETE nesta tabela.
create table if not exists public.rj_moderators (
  user_id uuid primary key references auth.users(id) on delete cascade,
  granted_at timestamptz not null default now()
);
alter table public.rj_moderators enable row level security;
drop policy if exists "rj moderators read self" on public.rj_moderators;
create policy "rj moderators read self" on public.rj_moderators
  for select to authenticated using ((select auth.uid()) = user_id);
revoke all on public.rj_moderators from public, anon, authenticated;
grant select(user_id,granted_at) on public.rj_moderators to authenticated;

-- Ocultar preserva posts e denúncias para revisão, em vez de DELETE CASCADE.
create table if not exists public.rj_post_moderation (
  post_id uuid primary key references public.rj_posts(id) on delete cascade,
  moderator_id uuid not null references public.rj_moderators(user_id),
  created_at timestamptz not null default now()
);
alter table public.rj_post_moderation enable row level security;
drop policy if exists "rj moderated post visibility flags" on public.rj_post_moderation;
create policy "rj moderated post visibility flags" on public.rj_post_moderation
  for select to authenticated using (true);
drop policy if exists "rj moderators hide posts" on public.rj_post_moderation;
create policy "rj moderators hide posts" on public.rj_post_moderation
  for insert to authenticated with check (
    (select auth.uid()) = moderator_id and exists (
      select 1 from public.rj_moderators m where m.user_id = (select auth.uid())
    )
  );
revoke all on public.rj_post_moderation from public, anon, authenticated;
grant select, insert(post_id,moderator_id) on public.rj_post_moderation to authenticated;

-- Registro imutável da decisão sobre cada denúncia.
create table if not exists public.rj_report_reviews (
  report_id uuid primary key references public.rj_reports(id) on delete cascade,
  moderator_id uuid not null references public.rj_moderators(user_id),
  decision text not null check (decision in ('dismissed','hidden')),
  reviewed_at timestamptz not null default now()
);
alter table public.rj_report_reviews enable row level security;
drop policy if exists "rj moderators read decisions" on public.rj_report_reviews;
create policy "rj moderators read decisions" on public.rj_report_reviews
  for select to authenticated using (
    exists (select 1 from public.rj_moderators m where m.user_id = (select auth.uid()))
  );
drop policy if exists "rj moderators record decisions" on public.rj_report_reviews;
create policy "rj moderators record decisions" on public.rj_report_reviews
  for insert to authenticated with check (
    moderator_id = (select auth.uid()) and
    exists (select 1 from public.rj_moderators m where m.user_id = (select auth.uid()))
  );
revoke all on public.rj_report_reviews from public, anon, authenticated;
grant select, insert(report_id,moderator_id,decision) on public.rj_report_reviews to authenticated;

-- Permitir que moderadores leiam denúncias para revisão.
drop policy if exists "rj moderators read reports" on public.rj_reports;
create policy "rj moderators read reports" on public.rj_reports
  for select to authenticated using (
    exists (select 1 from public.rj_moderators m where m.user_id = (select auth.uid()))
  );

-- Publicações ocultas deixam de ser visíveis para membros comuns.
-- O autor e os moderadores mantêm acesso para revisão/contestação manual.
drop policy if exists "rj posts visible to signed in" on public.rj_posts;
create policy "rj posts visible to signed in" on public.rj_posts
  for select to authenticated using (
    not exists (select 1 from public.rj_post_moderation h where h.post_id = id)
    or author_id = (select auth.uid())
    or exists (select 1 from public.rj_moderators m where m.user_id = (select auth.uid()))
  );

-- Evitar acesso direto a curtidas/comentários de posts ocultos.
-- A visibilidade segue a mesma regra do post pai.
drop policy if exists "rj likes visible to signed in" on public.rj_likes;
create policy "rj likes visible to signed in" on public.rj_likes
  for select to authenticated using (
    exists (select 1 from public.rj_posts p where p.id = post_id)
  );
drop policy if exists "rj comments visible to signed in" on public.rj_comments;
create policy "rj comments visible to signed in" on public.rj_comments
  for select to authenticated using (
    exists (select 1 from public.rj_posts p where p.id = post_id)
  );

-- Moderadores são nomeados SOMENTE após a criação/confirmacão de uma conta real:
-- insert into public.rj_moderators(user_id) values ('UUID_DA_CONTA_CONFIAVEL');
-- Não coloque UUIDs fixos nem privilégios administrativos no frontend.
--
-- Revisões de segurança antes de ativar:
-- select tablename, rowsecurity from pg_tables where schemaname='public' and tablename like 'rj_%';
-- select tablename, policyname, cmd from pg_policies where schemaname='public' and tablename like 'rj_%';
-- execute os advisors do Supabase, faça testes com 2 contas comuns + 1 moderador.
