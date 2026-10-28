# Rede Jovem · MVP online (versão 1)

## O que é real e o que ainda é demonstração

A aplicação original (#feed, #faith, #friends, #messages) continua sendo **demonstração individual**, com dados no IndexedDB do navegador. A nova rota **#comunidade** é a versão online, com contas reais e dados compartilhados **apenas depois** de configurar um projeto Supabase dedicado.

**MVP online:** silenciar e reexibir pessoas no próprio feed, cadastro por e-mail/senha, confirmação de e-mail, login/logout, recuperação de senha, perfil público para usuários autenticados, feed com publicações de texto, busca entre posts carregados, curtidas, comentários, edição e exclusão de publicações próprias, exclusão de comentários próprios, paginação e denúncias armazenadas para revisão humana. Sem mensagens privadas, imagens, amizade, notificações ou federação online nesta fase. Não migra automaticamente nenhum dado da demonstração.

## Ativação (não usar banco de outro aplicativo)

1. Crie um projeto **novo** na sua conta Supabase com nome **Rede Jovem**. O projeto não deve compartilhar dados com a pizzaria ou qualquer outro serviço.
2. No SQL Editor, aplique **nesta ordem**:
   - `supabase/rede_jovem_mvp.sql` (tabelas e políticas básicas)
   - `supabase/rede_jovem_controles_pessoais.sql` (silenciar perfis e permissões por coluna)
   Em seguida, confira todas as tabelas com RLS habilitado e consulte o Security Advisor. Verifique também as recomendações do Security Advisor.
3. Em Supabase → Authentication → Providers → Email, mantenha confirmação de e-mail ligada. Configure CAPTCHA, limites de cadastro e um serviço SMTP antes de abrir para público; o SMTP padrão pode não suportar uso público. Defina em URL Configuration:
   - Site URL: `https://helioconde.github.io/rede_social/`
   - Redirect URLs: `https://helioconde.github.io/rede_social/**`
   - Para recuperação de senha com PKCE: incluir explicitamente `https://helioconde.github.io/rede_social/?rj_recovery=1#comunidade` na allowlist, e testar o template de e-mail. O fluxo de redefinição precisa ser concluído no mesmo navegador em que foi solicitado (verificação PKCE).
4. Em GitHub → repositório → Settings → Secrets and variables → Actions → **Variables** (não Secrets, pois esses valores serão incluídos no frontend), cadastre:
   - `VITE_SUPABASE_URL`: URL HTTPS da API do **novo** projeto
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: chave pública `sb_publishable_...` do projeto.
5. Em GitHub → Settings → Pages, selecione GitHub Actions como Source. Execute novamente o workflow **Rede Jovem — QA e GitHub Pages** na branch `gh-pages`.
6. Abra `https://helioconde.github.io/rede_social/#comunidade`, crie duas contas **de teste**, confirme e-mails, publique, comente, curta, edite e exclua posts e comentários próprios, tente modificar registros alheios para verificar que o RLS bloqueia.
7. Teste **Esqueci minha senha** e o e-mail de recuperação, incluindo token inválido/expirado, em navegador que solicitou a redefinição (PKCE).
8. Publique mais de 20 textos de teste, clique em **Carregar mais**, atualize a página e confirme que só são buscadas curtidas/comentários dos posts carregados.

## Escalabilidade e restrições da fase atual

- O feed carrega em páginas de 20 posts. Somente curtidas e comentários desses posts são buscados no Data API; busca e filtros **não** são pesquisa global no banco, apenas nos itens já carregados.
- O total de likes e comentários por lote permanece limitado a 3.000 registros. Antes de alta escala, substituir por contagens no banco com consultas mais eficientes e paginação específica para comentários.
- A lista de perfis é restrita aos autores de posts e comentários carregados. A existência de uma conta ou de uma publicação não deve ser interpretada como privada para outros membros autenticados.
- Silenciar perfis usa `rj_mutes` e é uma preferência pessoal de exibição, **não bloqueio entre usuários nem controle de acesso aos posts no banco**. O mecanismo de denúncias grava em `rj_reports`, mas ainda exige uma pessoa responsável, revisando via dashboard/SQL privado. A aplicação não oferece painel administrativo.
- O código cliente não é substituto para RLS: todas as operações de escrita devem continuar protegidas no Supabase. A atualização de posts e exclusão de comentários usam as políticas já presentes em `supabase/rede_jovem_mvp.sql`.

## Checklist de segurança para lançamento

- Nunca coloque chave `service_role`, `sb_secret_`, token pessoal ou senha do banco no código, nas variáveis VITE, nos logs nem em commits.
- Políticas RLS obrigatórias: leitura somente para usuários autenticados; escrita e exclusão somente pelo autor; denúncias visíveis somente ao denunciante e aos administradores via dashboard privado.
- Antes de abrir cadastros públicos, defina pessoa responsável por **revisar denúncias**, excluir conteúdo ilegal/abusivo, tratar solicitações de exclusão de dados e responder contato de privacidade.
- O MVP ainda não tem exclusão automática de conta: demandas de exclusão devem ser tratadas manualmente no painel de administração, incluindo registros de Auth, após verificação de identidade.
- O sistema não implementa rate limiting personalizado, banimento, bloqueios entre usuários ou filtros de conteúdo. **Não é pronto para escala ou público irrestrito sem controles adicionais.**
- Não divulgue o link como rede privada, pois o feed é visível a **qualquer pessoa com conta autenticada**.

## Testes

`npm install`, `npm run build` e `npm run test:e2e`. Os testes Playwright cobrem estados desconfigurado e demonstração; testes de integração com autenticação real exigem duas contas de teste no projeto dedicado e devem ser executados sem credenciais no repositório.

## Próxima etapa

Depois da validação com um grupo pequeno, adicionar: edição/exclusão de comentários, paginação por cursor, limites de taxa e moderação administrativa, política LGPD e atendimento a exclusão, bloqueios pessoais, perfis privados e controle de idade. Só depois considerar DMs e upload de mídia.

### Validação automatizada da fase 2

O workflow do GitHub executa os testes sem credenciais reais: verifica a interface desconfigurada, o link de retorno ao modo local e contratos do SQL/TypeScript. É necessário rodar testes manuais com duas contas em um projeto Supabase exclusivo antes de liberar acesso público. Não use projetos externos ou chaves de serviço para simular.

Documentação Supabase: [Reset password](https://supabase.com/docs/reference/javascript/auth-resetpasswordforemail), [PKCE](https://supabase.com/docs/guides/auth/sessions/pkce-flow).

## Controle pessoal e menor privilégio (fase 3)

O arquivo `supabase/rede_jovem_controles_pessoais.sql` é obrigatório antes de ativar o controle de silenciar. Ele cria `rj_mutes` com RLS para que apenas o titular visualize, inclua ou remova entradas da sua lista. Não disponibilize listas de silenciados para outros usuários.

A mesma atualização restringe as permissões `INSERT` e `UPDATE` nas colunas das cinco tabelas básicas. A API de navegador não poderá atribuir manualmente `created_at` ou transferir o autor de um registro por um `UPDATE` comum. Isso complementa as políticas RLS, não as substitui.

Silenciar alguém **somente oculta** suas publicações nesta interface. A pessoa ainda pode interagir com outros usuários; para abuso, use o recurso separado de denúncia, sujeito à análise humana. Não prometa bloqueio de contato, banimento, rate limit, privacidade de dados ou moderação automática.

Se a tabela `rj_mutes` ainda não existir, a interface mantém o feed funcionando e informa que o recurso precisa ser ativado no banco dedicado.

### Verificações manuais obrigatórias depois da ativação

1. Use duas contas de teste A e B. Na conta A, silencie B; atualize a página e confirme que os posts de B desaparecem **somente do feed da conta A**.
2. Remova B da lista e confirme a reaparição das publicações. B não deve ver nem editar a lista de A.
3. Via cliente autenticado de B, tente consultar, inserir e remover linhas de `rj_mutes` pertencentes a A; operações fora de escopo devem ser negadas por RLS.
4. Tente alterar `author_id` e `created_at` de um post usando a chave pública e a conta A. A alteração deve ser negada por permissão de coluna, mesmo se o post for de A.
5. Verifique índices, grants e políticas pelo SQL Editor e execute os advisors de segurança e desempenho do Supabase. Não rode estes testes no banco `pizzaria-db`.

Para lançar publicamente ainda faltam moderação administrativa, limites de taxa para escrita e estratégia de exclusão de contas/dados.
