import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const sql=readFileSync(resolve(process.cwd(),'supabase/rede_jovem_moderacao.sql'),'utf8');
const app=readFileSync(resolve(process.cwd(),'src/OnlineMVP.tsx'),'utf8');
const panel=readFileSync(resolve(process.cwd(),'src/ModerationPanel.tsx'),'utf8');

test('tabelas de moderação têm RLS e só moderadores podem gravar',()=>{
  for(const table of ['rj_moderators','rj_post_moderation','rj_report_reviews']){
    expect(sql).toContain('alter table public.'+table+' enable row level security;');
    expect(sql).toContain('revoke all on public.'+table+' from public, anon, authenticated;');
  }
  expect(sql).toContain('for select to authenticated using ((select auth.uid()) = user_id)');
  expect(sql).toContain('rj moderators hide posts');
  expect(sql).toContain('moderator_id = (select auth.uid())');
  expect(sql).toContain('rj moderators record decisions');
  expect(sql).not.toMatch(/security\s+definer/i);
  expect(sql).not.toMatch(/grant\s+(insert|update|delete).*rj_moderators\s+to\s+authenticated/i);
  expect(sql).not.toMatch(/service_role/i);
});

test('ocultação impede leitura do post pelos demais membros',()=>{
  expect(sql).toContain('drop policy if exists "rj posts visible to signed in"');
  expect(sql).toContain('not exists (select 1 from public.rj_post_moderation h where h.post_id = id)');
  expect(sql).toContain('author_id = (select auth.uid())');
  expect(sql).toContain('drop policy if exists "rj comments visible to signed in"');
  expect(sql).toContain('drop policy if exists "rj likes visible to signed in"');
  expect(sql).toContain('exists (select 1 from public.rj_posts p where p.id = post_id)');
});

test('painel não tem privilégio administrativo no navegador',()=>{
  expect(app).toContain("from('rj_moderators').select('user_id')");
  expect(app).toContain('isModerator&&moderationOpen');
  expect(panel).toContain("from('rj_reports')");
  expect(panel).toContain("from('rj_post_moderation')");
  expect(panel).toContain("from('rj_report_reviews')");
  expect(panel).toContain("maybeSingle()");
  expect(panel).toContain('Ocultar publicação');
  expect(panel).toContain('Descartar denúncia');
  expect(panel).not.toContain('service_role');
  expect(panel).not.toContain('sb_secret_');
});

test('site sem backend continua honesto e sem painel administrativo',async({page})=>{
  await page.goto('/rede_social/#comunidade');
  await expect(page.getByRole('heading',{name:/Uma comunidade para/})).toBeVisible();
  await expect(page.getByRole('button',{name:'Revisar denúncias'})).toHaveCount(0);
  const setup=page.locator('.online-setup');
  if(await setup.isVisible()){
    await expect(page.getByRole('heading',{name:'Estamos preparando o espaço online'})).toBeVisible();
    await expect(page.getByRole('link',{name:'Como ativar o MVP'})).toBeVisible();
  }
});

test('layout da comunidade sem backend preserva telas menores',async({page})=>{
  for(const width of [320,360,390,768]){
    await page.setViewportSize({width,height:840});
    await page.goto('/rede_social/#comunidade');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth),String(width)).toBeLessThanOrEqual(1);
  }
});
