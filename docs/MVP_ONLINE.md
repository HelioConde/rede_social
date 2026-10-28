# Rede Jovem · MVP online (versão 1)

## O que é real e o que ainda é demonstração

A aplicação original (#feed, #faith, #friends, #messages) continua sendo **demonstração individual**, com dados no IndexedDB do navegador. A nova rota **#comunidade** é a versão online, com contas reais e dados compartilhados **apenas depois** de configurar um projeto Supabase dedicado.

**MVP online:** cadastro por e-mail/senha, confirmação de e-mail, login/logout, perfil público para usuários autenticados, feed com publicações de texto, busca, curtidas, comentários, exclusão de publicações próprias e denúncias armazenadas para revisão humana. Sem mensagens privadas, imagens, amizade, notificações ou federação online nesta fase. Não migra automaticamente nenhum dado da demonstração.

## Ativação (não usar banco de outro aplicativo)

1. Crie um projeto **novo** na sua conta Supabase com nome **Rede Jovem**. O projeto não deve compartilhar dados com a pizzaria ou qualquer outro serviço.
2. No SQL Editor, aplique \`supabase/rede_jovem_mvp.sql\` e confira todas as tabelas com RLS habilitado. Verifique também as recomendações do Security Advisor.
3. Em Supabase → Authentication → Providers → Email, mantenha confirmação de e-mail ligada. Configure CAPTCHA, limites de cadastro e um serviço SMTP antes de abrir para público; o SMTP padrão pode não suportar uso público. Defina em URL Configuration:
   - Site URL: \`https://helioconde.github.io/rede_social/\`
   - Redirect URLs: \`https://helioconde.github.io/rede_social/**\`
4. Em GitHub → repositório → Settings → Secrets and variables → Actions → **Variables** (não Secrets, pois esses valores serão incluídos no frontend), cadastre:
   - \`VITE_SUPABASE_URL\`: URL HTTPS da API do **novo** projeto
   - \`VITE_SUPABASE_PUBLISHABLE_KEY\`: chave pública \`sb_publishable_...\` do projeto.
5. Em GitHub → Settings → Pages, selecione GitHub Actions como Source. Execute novamente o workflow **Rede Jovem — QA e GitHub Pages** na branch \`gh-pages\`.
6. Abra \`https://helioconde.github.io/rede_social/#comunidade\`, crie duas contas **de teste**, confirme e-mails, publique, comente, curta e verifique que um usuário não consegue alterar/excluir os posts do outro.

## Checklist de segurança para lançamento

- Nunca coloque chave \`service_role\`, \`sb_secret_\`, token pessoal ou senha do banco no código, nas variáveis VITE, nos logs nem em commits.
- Políticas RLS obrigatórias: leitura somente para usuários autenticados; escrita e exclusão somente pelo autor; denúncias visíveis somente ao denunciante e aos administradores via dashboard privado.
- Antes de abrir cadastros públicos, defina pessoa responsável por **revisar denúncias**, excluir conteúdo ilegal/abusivo, tratar solicitações de exclusão de dados e responder contato de privacidade.
- O MVP ainda não tem exclusão automática de conta: demandas de exclusão devem ser tratadas manualmente no painel de administração, incluindo registros de Auth, após verificação de identidade.
- O sistema não implementa rate limiting personalizado, banimento, bloqueios entre usuários ou filtros de conteúdo. **Não é pronto para escala ou público irrestrito sem controles adicionais.**
- Não divulgue o link como rede privada, pois o feed é visível a **qualquer pessoa com conta autenticada**.

## Testes

\`npm install\`, \`npm run build\` e \`npm run test:e2e\`. Os testes Playwright cobrem estados desconfigurado e demonstração; testes de integração com autenticação real exigem duas contas de teste no projeto dedicado e devem ser executados sem credenciais no repositório.

## Próxima etapa

Depois da validação com um grupo pequeno, adicionar: edição/exclusão de comentários, paginação por cursor, limites de taxa e moderação administrativa, política LGPD e atendimento a exclusão, bloqueios pessoais, perfis privados e controle de idade. Só depois considerar DMs e upload de mídia.
