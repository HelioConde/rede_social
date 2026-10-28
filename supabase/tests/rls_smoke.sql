\set ON_ERROR_STOP on

-- Fixtures isoladas. IDs fictícios fixos só são usados neste banco efêmero.
insert into auth.users(id) values
('00000000-0000-0000-0000-00000000000a'),
('00000000-0000-0000-0000-00000000000b'),
('00000000-0000-0000-0000-00000000000c');

insert into public.rj_profiles(id,handle,name) values
('00000000-0000-0000-0000-00000000000a','alice','Alice'),
('00000000-0000-0000-0000-00000000000b','bruno','Bruno'),
('00000000-0000-0000-0000-00000000000c','moderador','Moderador');

insert into public.rj_posts(id,author_id,content) values
('10000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-00000000000a','Conteúdo para revisão 1'),
('10000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-00000000000a','Conteúdo para revisão 2');

insert into public.rj_reports(id,post_id,reporter_id,reason) values
('20000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-00000000000b','abuso'),
('20000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-00000000000b','spam');

insert into public.rj_moderators(user_id) values ('00000000-0000-0000-0000-00000000000c');

-- Usuário comum: vê denúncias próprias, NÃO lê revisões de moderadores.
set role authenticated;
set request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000b';
select tests.assert_true(
  (select count(*) from public.rj_reports)=2,
  'Denunciante nao consegue ler suas denuncias'
);
select tests.assert_true(
  (select count(*) from public.rj_moderators)=0,
  'Usuario comum enxerga moderadores alheios'
);
select tests.expect_denied(
  'select public.rj_review_report(''20000000-0000-0000-0000-000000000001''::uuid, ''hidden'')'
);
select tests.expect_denied(
  'insert into public.rj_moderators(user_id) values (''00000000-0000-0000-0000-00000000000b'')'
);
reset role;

-- Moderador: decisão e ocultação em uma única chamada.
set role authenticated;
set request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000c';
select tests.assert_true(
  (select count(*) from public.rj_moderators)=1,
  'Moderador nao leu propria permissao'
);
select public.rj_review_report(
  '20000000-0000-0000-0000-000000000001'::uuid,'hidden'
);
select tests.assert_true(
  (select count(*) from public.rj_post_moderation
    where post_id='10000000-0000-0000-0000-000000000001')=1,
  'Moderacao nao ocultou o post'
);
select tests.assert_true(
  (select count(*) from public.rj_report_reviews
    where report_id='20000000-0000-0000-0000-000000000001'
      and decision='hidden')=1,
  'Decisao de ocultacao nao foi registrada'
);

-- Primeira revisão descarta; segunda falha, sem deixar ocultação parcial.
select public.rj_review_report(
  '20000000-0000-0000-0000-000000000002'::uuid,'dismissed'
);
do $$
declare caught boolean:=false;
begin
  begin
    perform public.rj_review_report(
      '20000000-0000-0000-0000-000000000002'::uuid,'hidden'
    );
  exception when unique_violation then caught:=true;
  end;
  if not caught then raise exception 'TEST FAILURE: revisao duplicada aceita'; end if;
end $$;
select tests.assert_true(
  (select count(*) from public.rj_post_moderation
    where post_id='10000000-0000-0000-0000-000000000002')=0,
  'Falha de decisao nao reverteu ocultacao parcial'
);
reset role;

-- Denunciante comum não acessa publicação oculta ou registros de revisão.
set role authenticated;
set request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000b';
select tests.assert_true(
  (select count(*) from public.rj_posts
    where id='10000000-0000-0000-0000-000000000001')=0,
  'Post oculto continua visivel a usuario comum'
);
select tests.assert_true(
  (select count(*) from public.rj_posts
    where id='10000000-0000-0000-0000-000000000002')=1,
  'Post nao oculto desapareceu'
);
select tests.assert_true(
  (select count(*) from public.rj_report_reviews)=0,
  'Usuario comum leu decisoes administrativas'
);
reset role;

-- Autor preserva direito de visualizar o próprio post para contestar.
set role authenticated;
set request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000a';
select tests.assert_true(
  (select count(*) from public.rj_posts
    where id='10000000-0000-0000-0000-000000000001')=1,
  'Autor nao pode visualizar post ocultado'
);
select tests.expect_denied(
  'update public.rj_posts set author_id=''00000000-0000-0000-0000-00000000000b'' where id=''10000000-0000-0000-0000-000000000001'''
);
delete from public.rj_posts
 where id='10000000-0000-0000-0000-000000000001';
reset role;

-- A remoção do post preserva data/motivo/denúncia/decisão sem texto original.
set role authenticated;
set request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000b';
select tests.assert_true(
  (select count(*) from public.rj_reports
    where id='20000000-0000-0000-0000-000000000001'
      and post_id is null and reason='abuso')=1,
  'Denuncia desapareceu apos exclusao do post'
);
reset role;

set role authenticated;
set request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000c';
select tests.assert_true(
  (select count(*) from public.rj_report_reviews
    where report_id='20000000-0000-0000-0000-000000000001')=1,
  'Decisao de moderacao desapareceu apos exclusao do post'
);
reset role;

\echo 'Rede Jovem: verificacoes reais de RLS e revisao atomica aprovadas.'
