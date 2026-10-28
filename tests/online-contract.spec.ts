import {expect,test} from '@playwright/test';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const code=readFileSync(resolve(process.cwd(),'src/OnlineMVP.tsx'),'utf8');
const policies=readFileSync(resolve(process.cwd(),'supabase/rede_jovem_mvp.sql'),'utf8');

test('comunidade sem backend permanece transparente e navegável',async({page})=>{
  await page.goto('/rede_social/#comunidade');
  await expect(page.getByRole('heading',{name:/Uma comunidade para/})).toBeVisible();
  const setup=page.locator('.online-setup');
  if(await setup.isVisible()){
    await expect(page.getByRole('heading',{name:'Estamos preparando o espaço online'})).toBeVisible();
    await expect(page.getByRole('link',{name:'Como ativar o MVP'})).toBeVisible();
    await expect(page.getByRole('textbox',{name:/Senha/})).toHaveCount(0);
  }
  await page.getByRole('button',{name:/Ver demonstração/}).click();
  await expect(page.getByRole('heading',{name:/Boas-vindas/})).toBeVisible();
});

test('dados sociais são consultados por página e por post selecionado',()=>{
  expect(code).toContain('const PAGE_SIZE = 20');
  expect(code).toContain('.range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)');
  expect(code).toContain(".in('post_id',postIds)");
  expect(code).not.toContain("from('rj_likes').select('post_id,user_id').limit(3000)");
  expect(code).not.toContain("from('rj_comments').select('id,post_id,author_id,content,created_at').order");
  expect(code).toContain('Carregar mais publicações');
});

test('fluxos da conta e edição usam recursos autorizados',()=>{
  expect(code).toContain("flowType: 'pkce'");
  expect(code).toContain('resetPasswordForEmail(');
  expect(code).toContain('auth.updateUser({password})');
  expect(code).toContain("?rj_recovery=1#comunidade");
  expect(code).toContain(".update({content}).eq('id',postId).eq('author_id',uid)");
  expect(code).toContain(".delete().eq('id',commentId).eq('author_id',uid)");
  expect(code).toContain("reason:reportReason");
  expect(code).not.toContain('window.prompt(');
});

test('políticas RLS protegem operações que agora têm controle no frontend',()=>{
  for(const table of ['rj_profiles','rj_posts','rj_likes','rj_comments','rj_reports']){
    expect(policies).toContain('alter table public.'+table+' enable row level security;');
  }
  expect(policies).toContain('create policy "rj post self update"');
  expect(policies).toContain('create policy "rj comment self delete"');
  expect(policies).toContain('with check ((select auth.uid()) = author_id)');
  expect(policies).not.toContain('service_role');
});
