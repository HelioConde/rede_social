-- Rede Jovem · Fase 5 · decisões atômicas e denúncias preservadas
-- Aplicar somente no projeto Supabase DEDICADO à Rede Jovem.
-- Ordem: rede_jovem_mvp.sql -> rede_jovem_controles_pessoais.sql ->
--        rede_jovem_moderacao.sql -> rede_jovem_auditoria.sql
--
-- Não executa em projetos de terceiros. Não cria funções SECURITY DEFINER.

begin;

-- Quando um autor apaga um post, a denúncia continua registrada com data e motivo,
-- mas perde o vínculo com o conteúdo excluído. Não retemos texto nem imagem do post.
-- A exclusão do próprio denunciante continua sujeita ao ON DELETE CASCADE
-- existente em reporter_id, em conformidade com o fluxo de exclusão de conta.
alter table public.rj_reports alter column post_id drop not null;
alter table public.rj_reports drop constraint if exists rj_reports_post_id_fkey;
alter table public.rj_reports add constraint rj_reports_post_id_fkey
  foreign key (post_id) references public.rj_posts(id) on delete set null;

-- Uma única chamada RPC executa ocultação e registro da decisão no MESMO statement/
-- transação do Postgres. Em caso de falha, nenhuma alteração parcial é confirmada.
-- A função roda com privilégios do solicitante e respeita RLS + GRANTs.
create or replace function public.rj_review_report(
  p_report_id uuid,
  p_decision text
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_actor uuid;
  v_post_id uuid;
begin
  v_actor := (select auth.uid());

  if v_actor is null or not exists (
    select 1 from public.rj_moderators m where m.user_id = v_actor
  ) then
    raise exception 'Permissão insuficiente para moderar.'
      using errcode = '42501';
  end if;

  if p_decision is null or p_decision not in ('hidden', 'dismissed') then
    raise exception 'Decisão inválida.' using errcode = '22023';
  end if;

  -- RLS de denúncias já permite leitura pela equipe de moderação.
  select r.post_id into v_post_id
    from public.rj_reports r where r.id = p_report_id;
  if not found then
    raise exception 'Denúncia não encontrada.' using errcode = 'P0002';
  end if;

  if p_decision = 'hidden' then
    if v_post_id is null then
      raise exception 'A publicação já foi excluída; registre apenas descarte.'
        using errcode = '22023';
    end if;

    insert into public.rj_post_moderation (post_id, moderator_id)
      values (v_post_id, v_actor)
      on conflict (post_id) do nothing;
  end if;

  -- Uma segunda revisão da mesma denúncia falha pela PK e desfaz a ocultação
  -- anterior feita nesta chamada, se houver.
  insert into public.rj_report_reviews (report_id, moderator_id, decision)
    values (p_report_id, v_actor, p_decision);
end;
$$;

revoke all on function public.rj_review_report(uuid,text) from public, anon;
grant execute on function public.rj_review_report(uuid,text) to authenticated;

comment on function public.rj_review_report(uuid,text)
  is 'Moderacao atomica por usuario autenticado autorizado via RLS.';

commit;

-- Verificações antes de abrir a comunidade:
-- select conname, confdeltype from pg_constraint
--   where conrelid = 'public.rj_reports'::regclass and contype = 'f';
-- select proname, prosecdef from pg_proc where proname = 'rj_review_report';
-- A aplicação deve testar com duas contas comuns + uma conta moderadora.
