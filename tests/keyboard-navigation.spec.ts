import { expect, test } from '@playwright/test';

test('menu lateral mobile fecha com Escape e devolve foco ao botão', async ({page}) => {
  await page.setViewportSize({width:390,height:800});
  await page.goto('/rede_social/#feed');
  const menu=page.getByRole('button',{name:'Abrir menu'});
  await expect(menu).toBeVisible();
  await menu.click();
  const close=page.getByRole('button',{name:'Fechar menu'});
  await expect(close).toHaveAttribute('aria-expanded','true');
  await page.keyboard.press('Escape');
  await expect(menu).toHaveAttribute('aria-expanded','false');
  await expect(menu).toBeFocused();
  await expect(page.locator('#navegacao-lateral')).not.toHaveClass(/open/);
});

test('Escape fecha busca mobile sem apagar pesquisa', async ({page}) => {
  await page.setViewportSize({width:390,height:800});
  await page.goto('/rede_social/#feed');
  await page.getByRole('button',{name:'Abrir busca'}).click();
  const search=page.getByRole('textbox',{name:'Pesquisar pessoas e publicações'});
  await search.fill('criatividade');
  await page.keyboard.press('Escape');
  const open=page.getByRole('button',{name:'Abrir busca'});
  await expect(open).toHaveAttribute('aria-expanded','false');
  await expect(open).toBeFocused();
  await open.click();
  await expect(search).toHaveValue('criatividade');
});

test('Escape fecha notificações e conversa flutuante', async ({page}) => {
  await page.goto('/rede_social/#feed');
  const notifications=page.getByRole('button',{name:'Notificações'});
  await notifications.click();
  await expect(notifications).toHaveAttribute('aria-expanded','true');
  await page.keyboard.press('Escape');
  await expect(notifications).toHaveAttribute('aria-expanded','false');
  await expect(page.getByRole('region',{name:'Resumo de notificações'})).toHaveCount(0);

  await page.goto('/rede_social/#messages');
  await page.locator('.contact-row').first().click();
  await expect(page.getByTestId('chat-window')).toHaveCount(1);
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('chat-window')).toHaveCount(0);
});
