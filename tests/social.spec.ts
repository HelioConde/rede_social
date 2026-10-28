import { expect, test } from '@playwright/test';
test.beforeEach(async ({ page }) => {
  await page.goto('/rede_social/');
  await expect(page.getByRole('heading', {name: /Boas-vindas/})).toBeVisible();
});
test('publicar, curtir e comentar com persistência após recarga', async ({page}) => {
  const message='Minha publicação automatizada Rede Jovem';
  await page.getByRole('textbox',{name:'O que você está pensando?'}).fill(message);
  await page.getByRole('button',{name:'Publicar',exact:true}).click();
  const post=page.getByTestId('post-card').filter({hasText:message});
  await expect(post).toBeVisible();
  await post.getByRole('button',{name:'Curtir publicação'}).click();
  await expect(post.getByRole('button',{name:'Descurtir publicação'})).toBeVisible();
  await post.getByRole('textbox',{name:'Escrever comentário'}).fill('Comentário local');
  await post.getByRole('button',{name:'Enviar comentário'}).click();
  await expect(post.getByText('Comentário local')).toBeVisible();
  await page.reload();
  await expect(page.getByTestId('post-card').filter({hasText:message})).toContainText('Comentário local');
});
test('aceitar convite e abrir chat com envio local', async ({page}) => {
  await page.goto('/rede_social/#friends');
  await expect(page.getByRole('heading',{name:'Amigos e conexões'})).toBeVisible();
  await page.locator('.people-grid').first().getByRole('button',{name:'Aceitar'}).first().click();
  await expect(page.getByRole('status')).toContainText('Amizade adicionada');
  await page.goto('/rede_social/#messages');
  await page.locator('.contact-row').first().click();
  await expect(page.getByTestId('chat-window')).toBeVisible();
  await page.getByRole('textbox',{name:/Mensagem para/}).fill('Teste de conversa local');
  await page.getByRole('button',{name:'Enviar mensagem'}).click();
  await expect(page.getByTestId('chat-window')).toContainText('Teste de conversa local');
});
test('editar perfil, alternar tema e restaurar demonstração',async ({page})=>{
  await page.goto('/rede_social/#profile');
  await page.getByRole('button',{name:'Editar',exact:true}).click();
  await page.getByRole('textbox',{name:'Nome',exact:true}).fill('Perfil QA');
  await page.getByRole('button',{name:'Salvar alterações'}).click();
  await expect(page.getByRole('heading',{name:'Perfil QA'})).toBeVisible();
  await page.goto('/rede_social/#settings');
  await page.getByRole('button',{name:'Alternar tema'}).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
  page.once('dialog',d=>d.accept());
  await page.getByRole('button',{name:'Restaurar demonstração'}).click();
  await expect(page.getByRole('heading',{name:/Boas-vindas, Visitante/})).toBeVisible();
});
test('busca filtra publicações e botões têm nomes acessíveis', async ({page})=>{
  await page.getByRole('textbox',{name:'Pesquisar pessoas e publicações'}).fill('criatividade conecta');
  await expect(page.getByTestId('post-card')).toHaveCount(1);
  await expect(page.getByRole('button',{name:'Notificações'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Ativar modo escuro'})).toBeVisible();
});

test('busca mobile expande por botão acessível',async ({page})=>{
  await page.setViewportSize({width:390,height:800});
  await page.goto('/rede_social/');
  await page.getByRole('button',{name:'Abrir busca'}).click();
  const search=page.getByRole('textbox',{name:'Pesquisar pessoas e publicações'});
  await expect(search).toBeVisible();
  await search.fill('criatividade conecta');
  await expect(page.getByTestId('post-card')).toHaveCount(1);
});
