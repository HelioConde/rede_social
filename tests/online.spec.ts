import {expect, test} from '@playwright/test';

test('rota do MVP online não se passa por rede compartilhada quando não configurada', async ({page}) => {
  await page.goto('/rede_social/#comunidade');
  await expect(page.getByRole('heading', {name:/Uma comunidade para/})).toBeVisible();
  await expect(page.locator('.online-setup, .online-auth')).toBeVisible();
  if (await page.locator('.online-setup').isVisible()) {
    await expect(page.getByRole('link', {name:'Como ativar o MVP'})).toBeVisible();
  }
});

test('retorno da comunidade para a demonstração funciona', async ({page}) => {
  await page.goto('/rede_social/#comunidade');
  await page.getByRole('button', {name:/Ver demonstração/}).click();
  await expect(page.getByRole('heading', {name:/Boas-vindas/})).toBeVisible();
});

test('MVP online não cria overflow no celular', async ({page}) => {
  await page.setViewportSize({width:360,height:780});
  await page.goto('/rede_social/#comunidade');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
});
