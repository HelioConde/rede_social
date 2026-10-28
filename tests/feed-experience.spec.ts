import {expect,test} from '@playwright/test';

test('salvar uma publicação e encontrá-la após recarregar',async ({page})=>{
  await page.goto('/rede_social/#feed');
  const value='Minha publicação para salvar no feed';
  await page.getByRole('textbox',{name:'O que você está pensando?'}).fill(value);
  await page.getByRole('button',{name:'Publicar',exact:true}).click();
  const card=page.getByTestId('post-card').filter({hasText:value});
  await card.getByRole('button',{name:'Salvar publicação'}).click();
  await expect(card.getByRole('button',{name:'Remover dos salvos'})).toHaveAttribute('aria-pressed','true');
  await page.getByRole('group',{name:'Filtrar publicações'}).getByRole('button',{name:/Salvos/}).click();
  await expect(page.getByTestId('post-card')).toHaveCount(1);
  await expect(page.getByText('Publicações salvas ficam apenas neste navegador', {exact:false})).toBeVisible();
  await page.reload();
  await page.getByRole('group',{name:'Filtrar publicações'}).getByRole('button',{name:/Salvos/}).click();
  await expect(page.getByTestId('post-card').filter({hasText:value})).toBeVisible();
  await page.getByTestId('post-card').getByRole('button',{name:'Remover dos salvos'}).click();
  await expect(page.getByText('Você ainda não salvou publicações')).toBeVisible();
  await page.getByRole('button',{name:'Ver todas as publicações'}).click();
  await expect(page.getByTestId('post-card').filter({hasText:value})).toBeVisible();
});

test('salvos são independentes para cada perfil de demonstração',async ({page})=>{
  await page.goto('/rede_social/#feed');
  const content='Post com favorito por perfil';
  await page.getByRole('textbox',{name:'O que você está pensando?'}).fill(content);
  await page.getByRole('button',{name:'Publicar',exact:true}).click();
  await page.getByTestId('post-card').filter({hasText:content}).getByRole('button',{name:'Salvar publicação'}).click();
  await page.goto('/rede_social/#settings');
  const selector=page.getByRole('combobox',{name:'Escolher perfil demonstrativo'});
  const values=await selector.locator('option').evaluateAll(options=>options.map(option=>(option as HTMLOptionElement).value));
  expect(values.length).toBeGreaterThan(1);
  await selector.selectOption(values.find(v=>v!=='me')!);
  await page.goto('/rede_social/#feed');
  await page.getByRole('group',{name:'Filtrar publicações'}).getByRole('button',{name:/Salvos/}).click();
  await expect(page.getByText('Você ainda não salvou publicações')).toBeVisible();
  await page.goto('/rede_social/#settings');
  await page.getByRole('combobox',{name:'Escolher perfil demonstrativo'}).selectOption('me');
  await page.goto('/rede_social/#feed');
  await page.getByRole('group',{name:'Filtrar publicações'}).getByRole('button',{name:/Salvos/}).click();
  await expect(page.getByTestId('post-card').filter({hasText:content})).toBeVisible();
});

test('ordenar por mais curtidas e limpar a busca',async ({page})=>{
  await page.goto('/rede_social/#feed');
  const a='rjfeedqa Primeiro';
  const b='rjfeedqa Segundo';
  for(const content of [a,b]){
    await page.getByRole('textbox',{name:'O que você está pensando?'}).fill(content);
    await page.getByRole('button',{name:'Publicar',exact:true}).click();
  }
  await page.getByTestId('post-card').filter({hasText:a}).getByRole('button',{name:'Curtir publicação'}).click();
  await page.getByRole('textbox',{name:'Pesquisar pessoas e publicações'}).fill('rjfeedqa');
  await expect(page.getByTestId('post-card')).toHaveCount(2);
  await expect(page.getByTestId('post-card').first()).toContainText(b);
  await page.getByRole('combobox',{name:'Ordenar publicações'}).selectOption('popular');
  await expect(page.getByTestId('post-card').first()).toContainText(a);
  await page.getByRole('button',{name:/Limpar busca/}).first().click();
  await expect(page.getByRole('textbox',{name:'Pesquisar pessoas e publicações'})).toHaveValue('');
});

test('salvos e ordenação não provocam rolagem lateral em mobile',async ({page})=>{
  for(const width of [320,360,390,768]){
    await page.setViewportSize({width,height:840});
    await page.goto('/rede_social/#feed');
    const saved=page.getByRole('group',{name:'Filtrar publicações'}).getByRole('button',{name:/Salvos/});
    await expect(saved).toBeVisible();
    await saved.click();
    await expect(page.getByRole('combobox',{name:'Ordenar publicações'})).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth),String(width)).toBeLessThanOrEqual(1);
  }
});

test('link de pular conteúdo não altera a seção da página',async ({page})=>{
  await page.goto('/rede_social/#explore');
  await expect(page.getByRole('heading',{name:'Explorar pessoas'})).toBeVisible();
  await page.keyboard.press('ControlOrMeta+Home');
  await page.keyboard.press('Tab');
  const skip=page.getByRole('link',{name:'Pular para conteúdo'});
  await skip.focus();
  await skip.press('Enter');
  await expect(page.getByRole('heading',{name:'Explorar pessoas'})).toBeVisible();
  await expect(page.locator('#main')).toBeVisible();
});
