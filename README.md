# Rede Jovem — versão moderna

Uma releitura do projeto **Rede Jovem** (2019–2022), agora em **React + TypeScript + Vite**, com identidade original preservada e publicação estática no GitHub Pages.

**Demonstração:** https://helioconde.github.io/rede_social/ (após habilitar GitHub Pages → GitHub Actions e publicar a branch `gh-pages`).

## Recursos
- Feed: criar, editar, excluir, curtir e comentar publicações.
- **Espaço Fé (opcional):** 12 referências bíblicas com reflexões autorais, filtros por tema, favoritos, caderno local de gratidão, compartilhamento voluntário e três paletas de cores.
- Imagens: pré-visualização, validação e compressão no navegador.
- Perfis: avatar, nome, usuário, biografia e cidade.
- Amizades: adicionar e aceitar solicitações fictícias.
- Mensagens: chats locais em janelas flutuantes (até duas no desktop).
- Busca, notificações fictícias, temas claro/escuro e layout responsivo.
- Dados armazenados via IndexedDB; backup e restauração com JSON.
- Playwright: funcionalidades e 25 capturas em 5 resoluções.

### IMPORTANTE: demonstração sem backend
A aplicação **não é uma rede social multiusuário real**. Não há senha, autenticação, servidor, banco remoto ou mensagens recebidas da internet. Os outros perfis são dados fictícios. Publicações, conversas e imagens ficam apenas no navegador e podem ser apagadas pelos dados do site. Não use dados pessoais sensíveis.

## Desenvolver
```bash
npm install
npm run dev
npm run build
npx playwright install chromium
npm run test:e2e
```
Node.js 22+ recomendado. O Vite usa `base: '/rede_social/'` para garantir caminhos corretos no GitHub Pages.

## Publicar no GitHub Pages
1. Integre a branch de modernização à `gh-pages`.
2. Em **Settings → Pages → Build and deployment**, selecione **Source: GitHub Actions**.
3. O workflow `.github/workflows/rede-jovem-pages.yml` executará build, verificações Playwright e deploy do diretório `dist/`.
4. Em **Actions**, abra o workflow para baixar o artefato de screenshots e inspecionar testes.

O deploy é bloqueado se o job QA falhar. Publicações em branches de desenvolvimento executam QA, mas não substituem o site público.

## Segurança e histórico
O PHP original foi preservado na branch **`legacy/php-20261027`**; a branch publicada não contém arquivos PHP, configurações nem uploads legados. Senhas históricas ainda devem ser rotacionadas, pois commits antigos continuam consultáveis.

O legado PHP utilizava `mysql_*`, queries com dados não confiáveis e senhas sem hash, e **não deve ser reativado em produção**. Para uma rede social real, é necessário backend e autenticação com controles de acesso próprios.

Consulte `docs/DESIGN_SYSTEM.md` para design e acessibilidade e `docs/MARKET_RESEARCH_FAITH.md` para dados, fontes, limites e hipóteses de cores.

### Atualização de outubro de 2026 — jornadas de leitura
O Espaço Fé recebeu busca por referências e assuntos, seis reflexões adicionais e três planos opcionais de sete etapas (paz, esperança e coragem). Marcação de leitura e retomada funcionam pelo armazenamento local e pelos backups JSON já existentes. Não há contagem de dias consecutivos nem contas reais.

Veja `docs/RESEARCH_RELIGIOUS_DIGITAL_2026.md` para as fontes do YouVersion, Pew e W3C. Os percentuais de apps bíblicos descrevem seus usuários, não a população geral.
