# Design System — Rede Jovem

## Identidade e Image to Code
A versão original de 2019 usava o nome Rede Jovem, barra superior azul, busca, amigos, perfil, publicações e mensagens. Mantivemos esses pilares. O novo desenho usa painel branco, azul marinho e azul principal, uma interpretação moderna sem copiar o layout de outra rede.

## Taste Skill: tokens globais
- Fundo: #f2f5fb; cabeçalho: #14294d; ação: #2357c9; superfície: branco; texto: #14243f.
- Escala: 4, 8, 12, 16, 24, 32 px; cartões com 18 px de raio.
- Foco visível: 3 px de azul-ciano, com offset de 3 px.
- Tipografia nativa do sistema; contraste de texto principal sobre branco e marinho.

## Web Design Guidelines
- HTML semântico; navegação por botões, estado aria-current e skip link.
- Campos com rótulos, feedback com role=status e acesso por teclado.
- Chat pode ser fechado por Escape; controles de pelo menos 43px quando possível.
- Breakpoints para 375, 768 e 1440 px. CSS respeita prefers-reduced-motion.

## Awesome Design
Sistema de cartões, barra sticky, hero com hierarquia tipográfica, coluna lateral com navegação, botão de chat flutuante e formulário legível. Componentes visuais consistentes nas seções.

## Estado local
Publicar, curtir, comentar, adicionar amigos, conversar e editar perfil usando localStorage. Os nomes são fictícios; **não há** autenticação, sincronização, servidor ou banco de dados. Texto dos usuários sempre é renderizado via textContent.

## Playwright
Testes de telas 375/768/1440, erro JS e overflow, persistência de postagens, curtidas e mensagens. Capturas de página completa são geradas em tests/screenshots.

## Segurança de deploy
O build publica exclusivamente index.html e site/ com .nojekyll; não copia PHP ou config.php. Migrar Settings → Pages para **GitHub Actions**. A opção de Pages por branch não isola arquivos legados.
