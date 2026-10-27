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
  await expect(card.locator('.faith-pagination')).toContainText('18 de 18');
  await page.keyboard.press('Home');
  await expect(card.locator('.faith-pagination')).toContainText('1 de 18');
  await expect(card.getByText(/use ← → para explorar/)).toBeVisible();
});

test('setas do carrossel não interferem nas entradas de gratidão',async ({page})=>{
  const field=page.locator('#faith-gratitude');
  await field.fill('Minha gratidão');
  await field.press('ArrowLeft');
  await expect(field).toHaveValue('Minha gratidão');
  await expect(page.getByTestId('faith-feature').locator('.faith-pagination')).toContainText(/de 18/);
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

test('pesquisa referência bíblica mesmo sem acentos e oferece recuperação sem resultado',async ({page})=>{
  const input=page.getByRole('searchbox',{name:'Buscar reflexões por tema, palavra ou referência'});
  await input.fill('Salmo 91');
  await expect(page.getByTestId('faith-feature')).toContainText('Salmo 91');
  await expect(page.getByRole('status').filter({hasText:'1 reflexão encontrada'})).toBeVisible();
  await input.fill('conteudo-impossivel-000');
  await expect(page.getByText('Nenhuma reflexão encontrada')).toBeVisible();
  await page.getByRole('button',{name:'Limpar filtros'}).click();
  await expect(page.getByTestId('faith-feature')).toBeVisible();
  await input.fill('esperanca');
  await expect(page.getByTestId('faith-feature')).toBeVisible();
});

test('plano de cinco dias mantém progresso no IndexedDB após recarga',async ({page})=>{
  await expect(page.getByRole('heading',{name:'Pequenos passos, um dia de cada vez'})).toBeVisible();
  await expect(page.getByRole('progressbar',{name:'Progresso do plano Cinco dias de esperança'})).toHaveAttribute('aria-valuenow','0');
  await page.getByRole('button',{name:'Concluir dia 1'}).click();
  await expect(page.getByRole('progressbar',{name:'Progresso do plano Cinco dias de esperança'})).toHaveAttribute('aria-valuenow','1');
  await expect(page.getByText('1 de 5 dias concluídos. Você pode ler na ordem que preferir.')).toBeVisible();
  await page.reload();
  await expect(page.getByRole('progressbar',{name:'Progresso do plano Cinco dias de esperança'})).toHaveAttribute('aria-valuenow','1');
  await page.getByRole('button',{name:'Marcar como não concluído o dia 1'}).click();
  await expect(page.getByRole('progressbar',{name:'Progresso do plano Cinco dias de esperança'})).toHaveAttribute('aria-valuenow','0');
});

test('plano abre reflexão correspondente e trilhas são independentes',async ({page})=>{
  await page.getByRole('button',{name:/Cinco dias de paz/}).click();
  await page.getByRole('button',{name:'Concluir dia 1'}).click();
  await expect(page.getByRole('progressbar',{name:'Progresso do plano Cinco dias de paz'})).toHaveAttribute('aria-valuenow','1');
  await page.getByRole('button',{name:/Cinco dias de coragem/}).click();
  await expect(page.getByRole('progressbar',{name:'Progresso do plano Cinco dias de coragem'})).toHaveAttribute('aria-valuenow','0');
  await page.getByRole('button',{name:/Ler dia 1:/}).click();
  await expect(page.getByTestId('faith-feature')).toContainText('Isaías 41:10');
});

test('carrossel responde ao teclado sem rotação automática',async ({page})=>{
  const feature=page.getByTestId('faith-feature');
  await feature.focus();
  const before=await feature.locator('.faith-reference').innerText();
  await feature.press('ArrowRight');
  await expect(feature.locator('.faith-reference')).not.toHaveText(before);
  await feature.press('Home');
  await expect(feature.locator('.faith-pagination')).toContainText('1 de');
  await feature.press('End');
  await expect(feature.locator('.faith-pagination')).toContainText('18 de');
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(feature).toBeVisible();
});

test('responsividade da busca e planos em 360px',async ({page})=>{
  await page.setViewportSize({width:360,height:780});
  await page.reload();
  await expect(page.getByRole('heading',{name:'Pequenos passos, um dia de cada vez'})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)).toBeLessThanOrEqual(1);
});
