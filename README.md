# Rede Jovem — comunidade em modo local

Modernização da rede social PHP de 2019, preservando o nome, as cores azuis, as publicações, os amigos, o perfil e as mensagens.

**[Abrir GitHub Pages](https://helioconde.github.io/rede_social/)** · [Design System](docs/DESIGN_SYSTEM.md)

## Demonstração estática
A interface de entrada é o arquivo index.html e utiliza somente HTML, CSS, JavaScript e localStorage. Publicações, curtidas, comentários, amizades, perfil, chat local, busca, exportação JSON e reinício funcionam no mesmo navegador, sem banco de dados.

**Limites explícitos:** nenhuma conta real, login, comunicação entre usuários, envio a servidor, nem sincronização entre dispositivos. Os perfis exibidos são exemplos fictícios.

## Executar e testar
Execute um servidor estático na raiz do repositório:

    python3 -m http.server 4173

Visite http://localhost:4173. Para testar com Playwright:

    npm install
    npx playwright install chromium
    npm run build
    npm test

As capturas automáticas são produzidas em tests/screenshots.

## GitHub Pages com isolamento
O workflow em .github/workflows/pages.yml gera public-dist com **somente** index.html e site/ e publica essa pasta por Actions. Para ativar: abra Settings → Pages → Build and deployment → Source e selecione **GitHub Actions**. A publicação pela branch gh-pages também encontra a nova entrada index.html, mas **não exclui arquivos PHP históricos**; por isso recomendamos Actions.

## Segurança e legado
Os arquivos PHP históricos permanecem no repositório para estudo e **não devem ser executados em produção**. Eles precisam de revisão de sessões, SQL injection, CSRF, tratamento de upload e rotação de credenciais eventualmente encontradas no histórico. A atualização não garante segurança do backend legado e não reescreve o histórico Git.

Projeto de [Hélio Conde](https://github.com/HelioConde).
