import {expect,test} from '@playwright/test';

test('identidade inicial é neutra e usa formas de conexão',async ({page})=>{
  await page.goto('/rede_social/#feed');
  await expect(page.locator('html')).toHaveAttribute('data-accent','indigo');
  await expect(page.locator('.feed-welcome h1')).toContainText('Boas-vindas');
  await expect(page.locator('.network-core')).toBeVisible();
  await expect(page.locator('.welcome-decoration .welcome-orbit')).toHaveCount(0);
  const gradient=await page.locator('.feed-welcome').evaluate(element=>getComputedStyle(element).backgroundImage);
  expect(gradient).toContain('linear-gradient');
  expect(gradient).not.toContain('rgb(255, 186, 195)');
});

test('todas as pessoas podem escolher e salvar uma paleta visual',async ({page})=>{
  await page.goto('/rede_social/#settings');
  await expect(page.getByRole('heading',{name:'Aparência'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Paleta Índigo'})).toHaveAttribute('aria-pressed','true');
  await page.getByRole('button',{name:'Paleta Oceano'}).click();
  await expect(page.locator('html')).toHaveAttribute('data-accent','oceano');
  await expect(page.getByRole('button',{name:'Paleta Oceano'})).toHaveAttribute('aria-pressed','true');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-accent','oceano');
  await expect(page.getByRole('button',{name:'Paleta Oceano'})).toHaveAttribute('aria-pressed','true');
  await page.getByRole('button',{name:'Paleta Floresta'}).click();
  await expect(page.locator('html')).toHaveAttribute('data-accent','floresta');
  await page.getByRole('button',{name:'Paleta Aurora'}).click();
  await expect(page.locator('html')).toHaveAttribute('data-accent','aurora');
  await page.getByRole('button',{name:'Paleta Índigo'}).click();
  await expect(page.locator('html')).toHaveAttribute('data-accent','indigo');
});

test('paleta e tema escuro são independentes',async ({page})=>{
  await page.goto('/rede_social/#settings');
  await page.getByRole('button',{name:'Paleta Floresta'}).click();
  await page.getByRole('button',{name:'Alternar tema'}).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
  await expect(page.locator('html')).toHaveAttribute('data-accent','floresta');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
  await expect(page.locator('html')).toHaveAttribute('data-accent','floresta');
  await page.getByRole('button',{name:'Alternar tema'}).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme','light');
  await expect(page.locator('html')).toHaveAttribute('data-accent','floresta');
});

test('atalho de personalização abre configurações no desktop',async ({page})=>{
  await page.setViewportSize({width:1280,height:900});
  await page.goto('/rede_social/#feed');
  await page.getByRole('button',{name:'Personalizar cores'}).click();
  await expect(page.getByRole('heading',{name:'Configurações'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Paleta Índigo'})).toBeVisible();
});

test('personalização não causa corte horizontal no celular',async ({page})=>{
  for(const width of [320,360,390,768]){
    await page.setViewportSize({width,height:840});
    await page.goto('/rede_social/#settings');
    await expect(page.getByRole('button',{name:'Paleta Aurora'})).toBeVisible();
    await page.getByRole('button',{name:'Paleta Oceano'}).click();
    const diff=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
    expect(diff,'resolução '+width).toBeLessThanOrEqual(1);
    await page.goto('/rede_social/#feed');
    await expect(page.locator('.network-core')).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
  }
});

test('cores escolhidas também acompanham a rota da comunidade',async ({page})=>{
  await page.goto('/rede_social/#settings');
  await page.getByRole('button',{name:'Paleta Floresta'}).click();
  await page.goto('/rede_social/#comunidade');
  await expect(page.locator('.online-root')).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-accent','floresta');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-accent','floresta');
  await expect(page.locator('.online-root')).toBeVisible();
});
