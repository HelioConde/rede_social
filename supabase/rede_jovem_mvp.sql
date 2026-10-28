-- Rede Jovem · MVP online · Execute apenas em projeto dedicado
-- Controle de acesso: todas as tabelas têm RLS e operações de escrita vinculadas ao auth.uid().
create extension if not exists pgcrypto;

create table if not exists public.rj_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  handle text not null unique check (handle ~ '^[a-z0-9_]{3,24}$'),
  name text not null check (char_length(btrim(name)) between 2 and 60),
  bio text not null default '' check (char_length(bio) <= 240),
  created_at timestamptz not null default now()
);
create table if not exists public.rj_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.rj_profiles(id) on delete cascade,
  content text not null check (char_length(btrim(content)) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index if not exists rj_posts_created_idx on public.rj_posts(created_at desc);
create index if not exists rj_posts_author_idx on public.rj_posts(author_id);
create table if not exists public.rj_likes (
  post_id uuid not null references public.rj_posts(id) on delete cascade,
  user_id uuid not null references public.rj_profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);
create table if not exists public.rj_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.rj_posts(id) on delete cascade,
  author_id uuid not null references public.rj_profiles(id) on delete cascade,
  content text not null check (char_length(btrim(content)) between 1 and 500),
  created_at timestamptz not null default now()
);
create index if not exists rj_comments_post_idx on public.rj_comments(post_id, created_at);
create table if not exists public.rj_reports (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.rj_posts(id) on delete cascade,
  reporter_id uuid not null references public.rj_profiles(id) on delete cascade,
  reason text not null check (reason in ('spam', 'abuso', 'outro')),
  created_at timestamptz not null default now(),
  unique (post_id, reporter_id)
);
create index if not exists rj_reports_created_idx on public.rj_reports(created_at desc);

alter table public.rj_profiles enable row level security;
alter table public.rj_posts enable row level security;
alter table public.rj_likes enable row level security;
alter table public.rj_comments enable row level security;
alter table public.rj_reports enable row level security;

create policy "rj profiles visible to signed in" on public.rj_profiles for select to authenticated using (true);
create policy "rj profile self insert" on public.rj_profiles for insert to authenticated with check ((select auth.uid()) = id);
create policy "rj profile self update" on public.rj_profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy "rj posts visible to signed in" on public.rj_posts for select to authenticated using (true);
create policy "rj post self insert" on public.rj_posts for insert to authenticated with check ((select auth.uid()) = author_id);
create policy "rj post self update" on public.rj_posts for update to authenticated using ((select auth.uid()) = author_id) with check ((select auth.uid()) = author_id);
create policy "rj post self delete" on public.rj_posts for delete to authenticated using ((select auth.uid()) = author_id);

create policy "rj likes visible to signed in" on public.rj_likes for select to authenticated using (true);
create policy "rj like self insert" on public.rj_likes for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "rj like self delete" on public.rj_likes for delete to authenticated using ((select auth.uid()) = user_id);

create policy "rj comments visible to signed in" on public.rj_comments for select to authenticated using (true);
create policy "rj comment self insert" on public.rj_comments for insert to authenticated with check ((select auth.uid()) = author_id);
create policy "rj comment self delete" on public.rj_comments for delete to authenticated using ((select auth.uid()) = author_id);

create policy "rj reports self read" on public.rj_reports for select to authenticated using ((select auth.uid()) = reporter_id);
create policy "rj reports self insert" on public.rj_reports for insert to authenticated with check ((select auth.uid()) = reporter_id);

-- API grants: RLS restringe quais registros cada usuário pode ler/escrever.
revoke all on public.rj_profiles, public.rj_posts, public.rj_likes, public.rj_comments, public.rj_reports from anon;
grant select, insert, update on public.rj_profiles to authenticated;
grant select, insert, update, delete on public.rj_posts to authenticated;
grant select, insert, delete on public.rj_likes, public.rj_comments to authenticated;
grant select, insert on public.rj_reports to authenticated;

-- Conferência:
-- select tablename, rowsecurity from pg_tables where schemaname = 'public' and tablename like 'rj_%';
-- select tablename, policyname, cmd from pg_policies where schemaname = 'public' and tablename like 'rj_%';
