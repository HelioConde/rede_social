-- PostgreSQL descartável em GitHub Actions. Simula apenas papéis e auth.uid().
-- NÃO usa projetos, senhas ou dados de produção do Supabase.
create role anon nologin;
create role authenticated nologin;
create schema auth;
create table auth.users (id uuid primary key);
create function auth.uid() returns uuid language sql stable
  as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
grant usage on schema auth,public to authenticated,anon;
grant execute on function auth.uid() to authenticated,anon;

create schema tests;
create function tests.assert_true(ok boolean, msg text)
returns void language plpgsql security invoker as $$
begin
  if ok is distinct from true then
    raise exception 'TEST FAILURE: %', msg;
  end if;
end;
$$;
create function tests.expect_denied(statement text)
returns void language plpgsql security invoker as $$
begin
  begin
    execute statement;
  exception when insufficient_privilege then return;
  end;
  raise exception 'TEST FAILURE: operacao indevida foi autorizada: %',statement;
end;
$$;
grant usage on schema tests to authenticated;
grant execute on all functions in schema tests to authenticated;
