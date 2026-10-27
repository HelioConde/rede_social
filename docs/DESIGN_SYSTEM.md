# Rede Jovem — Design System (2026)

## Objetivo
Modernizar o projeto histórico **Rede Jovem**, arquivado em `legacy/php-20261027`, mantendo a identidade azul, o nome e os recursos visuais legados, com acessibilidade e funcionamento estático no GitHub Pages.

## Linguagem visual
- **Identidade:** azul profundo, índigo e superfícies bem separadas; marca original em `public/assets/brand-logo.png`.
- **Tema:** escuro por padrão; claro selecionável em Configurações ou no cabeçalho.
- **Tipografia:** pilha de fontes do sistema (Inter quando disponível, Segoe UI e sans-serif).
- **Layout:** três áreas (navegação, conteúdo, contatos) em desktop; duas em telas médias; navegação inferior e painel lateral no mobile.
- **Conteúdo:** cartões para posts, perfis e conversas, com máximo de largura e boas quebras de linha.

## Tokens CSS
| Categoria | Token | Valor |
|---|---|---|
| Espaçamento | `--space-1/2/3/4/5/6/8/10` | 4/8/12/16/20/24/32/40 px |
| Raio | `--radius-sm/md/lg/xl` | 9/14/20/26 px |
| Primária | `--primary` | `#617dff` |
| Foco | `--focus` | `#98aaff` |
| Fundo | `--background` | variável por tema |
| Superfície | `--surface` | variável por tema |
| Texto | `--text`, `--muted`, `--soft` | variável por tema |

## Componentes
- **Topbar:** marca, busca, indicação de demonstração, tema, notificações e acesso ao perfil.
- **Sidebar / Bottom nav:** itens semânticos, estado ativo e foco de teclado.
- **Composer:** texto, imagem comprimida, limite de caracteres, publicação local.
- **PostCard:** autoria, texto, foto, curtidas, comentários, edição e exclusão do próprio post.
- **PeopleGrid:** perfis fictícios, solicitação e confirmação local de amizade.
- **ChatWindow:** conversa local com dois painéis no desktop e um por vez no mobile.
- **Configurações:** tema, troca de perfil de demonstração, backup e restauração.

## Acessibilidade e Web Design Guidelines
- Elementos nativos `button`, `input`, `nav`, `main`, `article` e `section`.
- Rótulos acessíveis em botões de ícone, campos e conversas.
- Foco visível com 3 px de contorno em teclado; ligação "Pular para conteúdo".
- `aria-live` para avisos e conversas; `aria-pressed` em filtros e curtidas.
- `prefers-reduced-motion: reduce` desativa animações/transições e rolagem suave.
- O Espaço Fé possui carrossel editorial com teclado, feedback de status e controles explícitos.

## Image to Code
A linguagem visual referencia a arquitetura do projeto PHP antigo, mas reconstrói suas telas em componentes React, evitando imagens de layout como substituto de conteúdo. O fundo legado é usado somente na capa do perfil.

## QA visual
Playwright cobre 360, 390, 768, 1280 e 1600 px e salva capturas completas de cinco páginas (25 imagens). Falhas de overflow horizontal e de funcionalidade são verificadas na CI.

## Limites do modo demonstrativo
Não existe autenticação real, sincronização ou compartilhamento entre dispositivos. Dados persistem apenas no navegador por IndexedDB. Não armazenar informações privadas ou senhas.

## Espaço Fé, outubro de 2026
- Conteúdo cristão opcional e claramente identificado, sem inferência da religião do usuário.
- Curadoria de 12 referências com reflexões originais, filtro por temas, favoritos e caderno local de gratidão.
- Três paletas configuráveis: Azul Sereno, Verde Esperança e Luz e Fé; preferencias persistidas apenas no navegador.
- Carrossel de reflexões com controles Anterior/Próxima nomeados, aria-live para avisos e suporte a movimento reduzido.
- Pesquisas, limites metodológicos e fontes em `docs/MARKET_RESEARCH_FAITH.md`.

## Outubro de 2026 — leitura guiada e descoberta
- Novos tokens locais de `faith.css` mantêm os três temas sem classificar visitantes por fé.
- Campo de busca por referência, título e tema com normalização de acentos; `type=search` e rótulo.
- Navegador de reflexões sem autoplay: Anterior/Próxima + anúncio de referência em `aria-live=polite`; rotação automática evitada conforme recomendações W3C/WAI.
- Planos de sete etapas com progresso local no IndexedDB, descrição acessível e estado sem obrigatoriedade de leitura diária.
- Novas reflexões autorais inspiradas em Salmo 91, Salmo 46, João 14:27, Lamentações 3:22–23, Tiago 1:5 e Salmo 34:18.
- Novo relatório: `docs/RESEARCH_RELIGIOUS_DIGITAL_2026.md`.

## Alvos de toque — Espaço Fé (27/10/2026)
- Setas do carrossel, filtros por tema, filtro de salvos, botão Salvar, histórico e exclusão de anotações possuem área interativa mínima de **44×44 px**, inclusive em 360 px de largura.
- Não alterar a ordem semântica ou a identidade do carrossel para expandir os controles; os testes verificam tamanho e ausência de rolagem horizontal.
