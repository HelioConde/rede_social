# Rede Social — edição estática de demonstração

Este repositório mantém o histórico do antigo projeto PHP/MySQL na branch `legacy/php-20261027`. A branch publicada `gh-pages` contém **somente arquivos estáticos** para proteger o GitHub Pages contra exposição acidental de scripts PHP.

## Funcionalidades
- Feed com publicações, curtidas, exclusão com confirmação e pesquisa.
- Lista de contatos fictícios e janelas de conversa no canto da tela.
- Mensagens, publicações e curtidas salvas **apenas neste navegador**, em localStorage.
- Exportação JSON e botão para limpar todos os dados locais.
- Responsividade, navegação por teclado, foco visível e respeito a movimento reduzido.

**Limites reais:** sem login, banco de dados, servidor, envio de mensagens para terceiros ou sincronização entre dispositivos. Não use dados sensíveis. O aplicativo não é uma rede social hospedada com usuários reais.

## Publicação
O GitHub Pages pode servir os arquivos diretamente pela branch `gh-pages` na pasta `/`, ou via workflow `.github/workflows/pages.yml` quando configurado para **GitHub Actions** em Settings → Pages.
URL esperada: https://helioconde.github.io/rede_social/

## Testes
`node --check app.js` e `node tests/smoke.cjs`.
O workflow executa verificação e auditoria Playwright em resoluções mobile, tablet e desktop e arquiva capturas. A validação visual manual continua recomendada.

## Segurança
A versão PHP antiga usava APIs MySQL obsoletas. Credenciais históricas que tenham sido publicadas no Git devem ser **revogadas/rotacionadas**, mesmo que não estejam mais na branch de publicação: remover arquivos atuais não apaga o histórico Git.
