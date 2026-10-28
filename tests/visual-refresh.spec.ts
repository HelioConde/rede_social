import { expect, test } from '@playwright/test';

test('tema claro de boas-vindas destaca o feed, cards e comunidade', async ({page}) => {
  await page.goto('/rede_social/#feed');
  await expect(page.locator('html')).toHaveAttribute('data-theme','light');
  await expect(page.locator('.feed-welcome h1')).toContainText('Boas-vindas');
  await expect(page.locator('.feed-quick-actions .card')).toHaveCount(2);
  await expect(page.getByRole('link',{name:/Explorar comunidade/})).toBeVisible();
  await expect(page.getByRole('button',{name:'Ativar modo escuro'})).toBeVisible();
  const background = await page.locator('body').evaluate(el => getComputedStyle(el).backgroundColor);
  expect(background).toBe('rgb(247, 248, 252)');
});

test('modo escuro alterna e persiste após recarregar', async ({page}) => {
  await page.goto('/rede_social/#feed');
  await page.getByRole('button',{name:'Ativar modo escuro'}).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
  await page.getByRole('button',{name:'Ativar modo claro'}).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme','light');
});

test('feed mobile não corta ações nem causa overflow', async ({page}) => {
  for(const width of [320,360,390,768,1280]){
    await page.setViewportSize({width,height:850});
    await page.goto('/rede_social/#feed');
    await expect(page.locator('.feed-welcome h1')).toBeVisible();
    await expect(page.getByRole('button',{name:'Publicar',exact:true})).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), 'largura: '+width).toBeLessThanOrEqual(1);
  }
});

test('menu mobile permite explorar e retornar ao feed', async ({page}) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto('/rede_social/#feed');
  await page.getByRole('button',{name:'Abrir menu'}).click();
  await expect(page.getByRole('navigation',{name:'Navegação principal'})).toBeVisible();
  await page.getByRole('navigation',{name:'Navegação principal'}).getByRole('button',{name:'Explorar'}).click();
  await expect(page.getByRole('heading',{name:'Explorar pessoas'})).toBeVisible();
  await page.getByRole('navigation',{name:'Navegação mobile'}).getByRole('button',{name:'Início'}).click();
  await expect(page.locator('.feed-welcome h1')).toBeVisible();
});

test('redução de movimento elimina transições decorativas', async ({page}) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/rede_social/');
  const transition = await page.locator('.side-link').first().evaluate(el => parseFloat(getComputedStyle(el).transitionDuration));
  expect(transition).toBeLessThanOrEqual(0.001);
});
