import { expect, test } from '@playwright/test';

test.beforeEach(async ({page})=>{
  await page.goto('/rede_social/#faith');
  await expect(page.getByRole('heading',{name:/Uma pausa para a alma/})).toBeVisible();
});

test('reflexões com referência, filtros e navegação acessível',async ({page})=>{
  const card=page.getByTestId('faith-feature');
  await expect(card).toContainText('Reflexão original inspirada');
  const initial=await card.locator('.faith-reference').innerText();
  await page.getByRole('button',{name:'Próxima reflexão'}).click();
  await expect(card.locator('.faith-reference')).not.toHaveText(initial);
  await page.getByRole('button',{name:'Paz',exact:true}).click();
  await expect(card.locator('.faith-reference')).toContainText('Paz');
  await expect(page.getByRole('button',{name:'Reflexão anterior'})).toBeVisible();
});

test('favoritos continuam guardados após recarga',async ({page})=>{
  await page.getByRole('button',{name:'Salvar',exact:true}).click();
  await expect(page.getByRole('button',{name:'Salvo',exact:true})).toHaveAttribute('aria-pressed','true');
  await page.reload();
  await page.getByRole('button',{name:/Salvos/}).click();
  await expect(page.getByTestId('faith-feature')).toBeVisible();
  await expect(page.getByRole('button',{name:'Salvo',exact:true})).toBeVisible();
});

test('caderno de gratidão local permite criar e apagar registro',async ({page})=>{
  await page.getByRole('textbox',{name:'Hoje sou grato(a) por...'}).fill('Pelo carinho dos amigos hoje.');
  await page.getByRole('button',{name:'Guardar reflexão'}).click();
  await page.reload();
  await page.getByRole('button',{name:/Ver meus registros/}).click();
  await expect(page.getByText('Pelo carinho dos amigos hoje.')).toBeVisible();
  await page.getByRole('button',{name:'Excluir registro de gratidão'}).click();
  await expect(page.getByText('Pelo carinho dos amigos hoje.')).toHaveCount(0);
});

test('paleta é personalizável e persistida sem rastrear religião',async ({page})=>{
  await page.getByRole('button',{name:/Verde Esperança/}).click();
  await expect(page.locator('html')).toHaveAttribute('data-palette','esperanca');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-palette','esperanca');
  await page.getByRole('button',{name:/Luz e Fé/}).click();
  await expect(page.locator('html')).toHaveAttribute('data-palette','luz');
});

test('compartilhamento de reflexão só acontece mediante clique',async ({page})=>{
  await page.getByRole('button',{name:'Compartilhar no feed'}).click();
  await expect(page.getByRole('heading',{name:/Boas-vindas/})).toBeVisible();
  await expect(page.getByTestId('post-card').first()).toContainText('Reflexão autoral');
  await expect(page.getByTestId('post-card').first()).toContainText('Referência bíblica');
});

test('paleta e favoritos funcionam no mobile e sem movimento',async ({page})=>{
  await page.setViewportSize({width:360,height:780});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/rede_social/#faith');
  await expect(page.getByTestId('faith-feature')).toBeVisible();
  await page.getByRole('button',{name:'Salvar',exact:true}).click();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)).toBeLessThanOrEqual(1);
});

test('convite ao Espaço Fé não espreme conteúdo no feed mobile',async ({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto('/rede_social/#feed');
  const invitation=page.locator('.faith-quick');
  await expect(invitation).toBeVisible();
  const height=await invitation.evaluate(el=>el.getBoundingClientRect().height);
  expect(height).toBeLessThan(205);
  await invitation.getByRole('button',{name:/Conhecer Espaço Fé/}).click();
  await expect(page.getByRole('heading',{name:/Uma pausa para a alma/})).toBeVisible();
});


test('carrossel recebe foco, mostra progresso e navega com teclado',async ({page})=>{
  const card=page.getByTestId('faith-feature');
  await expect(card).toHaveAttribute('aria-roledescription','carrossel');
  await card.focus();
  const initial=await card.locator('.faith-reference').innerText();
  await page.keyboard.press('ArrowRight');
  await expect(card.locator('.faith-reference')).not.toHaveText(initial);
  await expect(card.locator('.faith-progress span')).toBeVisible();
  await page.keyboard.press('End');
  await expect(card.locator('.faith-pagination')).toContainText('12 de 12');
  await page.keyboard.press('Home');
  await expect(card.locator('.faith-pagination')).toContainText('1 de 12');
  await expect(card.getByText(/use ← → para explorar/)).toBeVisible();
});

test('setas do carrossel não interferem nas entradas de gratidão',async ({page})=>{
  const field=page.locator('#faith-gratitude');
  await field.fill('Minha gratidão');
  await field.press('ArrowLeft');
  await expect(field).toHaveValue('Minha gratidão');
  await expect(page.getByTestId('faith-feature').locator('.faith-pagination')).toContainText(/de 12/);
});


test('controles da seção Fé oferecem alvos de toque acessíveis no celular', async ({page})=>{
  await page.setViewportSize({width:360,height:780});
  await page.goto('/rede_social/#faith');
  const selectors=['.faith-topic','.faith-favorite-filter','.faith-round','.faith-save','.faith-history-toggle'];
  for(const selector of selectors){
    const elements=page.locator(selector);
    const boxes=await elements.evaluateAll(nodes=>nodes.filter(el=>el.getClientRects().length>0).map(el=>{
      const r=el.getBoundingClientRect();
      return {width:r.width,height:r.height};
    }));
    expect(boxes.length,selector).toBeGreaterThan(0);
    for(const box of boxes){
      expect(box.width,selector+' largura').toBeGreaterThanOrEqual(44);
      expect(box.height,selector+' altura').toBeGreaterThanOrEqual(44);
    }
  }
  await expect(page.getByRole('button',{name:'Próxima reflexão'})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
});
