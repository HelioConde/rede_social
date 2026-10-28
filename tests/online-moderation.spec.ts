import {expect,test} from '@playwright/test';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const code=readFileSync(resolve(process.cwd(),'src/OnlineMVP.tsx'),'utf8');
const migration=readFileSync(resolve(process.cwd(),'supabase/rede_jovem_controles_pessoais.sql'),'utf8');

test('comunidade desconfigurada permanece acessível e não solicita contas reais',async({page})=>{
  await page.goto('/rede_social/#comunidade');
  await expect(page.getByRole('heading',{name:/Uma comunidade para/})).toBeVisible();
  const setup=page.locator('.online-setup');
  if(await setup.isVisible()){
    await expect(page.getByRole('heading',{name:'Estamos preparando o espaço online'})).toBeVisible();
    await expect(page.getByRole('link',{name:'Como ativar o MVP'})).toBeVisible();
  }
});

test('silenciar só filtra o feed, sem fingir bloquear contas',()=>{
  expect(code).toContain("from('rj_mutes')");
  expect(code).toContain("!mutedIds.includes(p.author_id)");
  expect(code).toContain("eq('owner_id',uid)");
  expect(code).toContain('Pessoas silenciadas');
  expect(code).toContain('não substitui uma denúncia');
  expect(code).toContain('setMutesReady(false)');
  expect(code).toContain('Silenciar pessoas requer a atualização');
});

test('políticas de silenciados restringem leitura, inserção e exclusão ao titular',()=>{
  expect(migration).toContain('alter table public.rj_mutes enable row level security;');
  expect(migration).toMatch(/policy "rj mutes select own"[\s\S]*?auth\.uid\(\)\) = owner_id/);
  expect(migration).toMatch(/policy "rj mutes insert own"[\s\S]*?auth\.uid\(\)\) = owner_id/);
  expect(migration).toMatch(/policy "rj mutes delete own"[\s\S]*?auth\.uid\(\)\) = owner_id/);
  expect(migration).toContain('constraint rj_mutes_not_self check (owner_id <> muted_id)');
  expect(migration).toContain('revoke all on public.rj_mutes from anon, authenticated');
  expect(migration).not.toContain('security definer');
});

test('permissões de colunas impedem troca de autor e falsificação da data de criação',()=>{
  expect(migration).toContain('revoke insert, update on public.rj_posts from authenticated;');
  expect(migration).toContain('grant insert(author_id, content) on public.rj_posts to authenticated;');
  expect(migration).toContain('grant update(content) on public.rj_posts to authenticated;');
  expect(migration).toContain('grant update(handle, name, bio) on public.rj_profiles to authenticated;');
  expect(migration).not.toMatch(/grant update\(author_id|grant update\(created_at/i);
});

test('a rota online preserva layout no celular',async({page})=>{
  for(const width of [320,360,390]){
    await page.setViewportSize({width,height:780});
    await page.goto('/rede_social/#comunidade');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
  }
});
