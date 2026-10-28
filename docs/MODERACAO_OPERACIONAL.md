# Moderação humana — Rede Jovem (pré-lançamento)

## Status e restrições

**Código preparado, não ativado em produção.** Não existe projeto Supabase exclusivo da Rede Jovem. A tentativa de criação foi recusada pela cota gratuita da conta (limite de 2 projetos ativos, mesmo aparecendo somente um projeto acessível aqui). Nenhum dado da pizzaria foi alterado.

O MVP local não tem denúncias online reais. A área administrativa só aparece para uma sessão autenticada que consiga ler a própria linha em `rj_moderators` por RLS, depois que o banco estiver pronto.

## Instalação em projeto isolado

1. Crie um projeto Supabase chamado Rede Jovem, **diferente** de `pizzaria-db`, na região `sa-east-1`. Confirme preço e limites antes de criar. Não remova projetos existentes sem revisar impactos.
2. Execute, nesta ordem, os scripts de `supabase/` no **novo** projeto:
   - `rede_jovem_mvp.sql`: perfis, posts, comentários, curtidas, denúncias e RLS básico.
   - `rede_jovem_controles_pessoais.sql`: silenciar usuários e permissões por coluna.
   - `rede_jovem_moderacao.sql`: moderadores, fila de revisão e ocultação com RLS.
   - `rede_jovem_auditoria.sql`: revisão atômica com `SECURITY INVOKER` e preservação mínima de denúncias.
3. Crie uma conta real com e-mail verificado, complete o perfil e localize o UUID dela no **novo** Supabase.
4. Nomeie o primeiro moderador exclusivamente no SQL Editor da conta administrativa:
   `insert into public.rj_moderators(user_id) values ('UUID_DA_CONTA_VERIFICADA');`
   **Nunca** coloque um UUID privilegiado, chave de serviço, senha ou permissão administrativa no frontend. Uma pessoa não se torna moderadora editando metadados da conta.
5. Configure Auth, SMTP, CAPTCHA, URLs de redirecionamento, variáveis públicas da aplicação e RLS conforme `docs/MVP_ONLINE.md`. **Não abra inscrições irrestritas antes de preparar suporte e moderação.**

## Como funciona

- Qualquer membro autenticado pode denunciar um post com motivo spam, abuso ou outro; cada pessoa pode denunciar um post uma vez.
- Somente moderadores nomeados conseguem ver a fila (últimas 50 denúncias), o texto do post e decisões.
- **Ocultar publicação** insere uma linha em `rj_post_moderation`; a publicação desaparece das consultas normais a posts, curtidas e comentários. Moderadores e o próprio autor mantêm acesso ao post para revisão. O frontend não pode conceder essa permissão.
- **Descartar denúncia** insere uma linha imutável em `rj_report_reviews`; ocultar também registra a decisão separadamente.
- Moderadores não podem nomear outros moderadores, conceder permissões via frontend ou excluir/modificar o histórico de decisões.
- Após aplicar `rede_jovem_auditoria.sql`, o painel chama a função `rj_review_report` com `SECURITY INVOKER`. Ocultação e registro da decisão passam a ocorrer na mesma transação do PostgreSQL: uma falha desfaz toda a operação. As políticas RLS continuam sendo aplicadas.
- Após aplicar `rede_jovem_auditoria.sql`, excluir uma publicação define `rj_reports.post_id = NULL`, preservando data, motivo e denunciante e também o registro de decisão. **O texto do post não é copiado ou armazenado para evidência**; a revisão posterior só poderá registrar descarte por indisponibilidade. A exclusão da conta do denunciante remove as denúncias por cascata. Esse histórico limitado não substitui gestão de evidências, retenção com prazo definido nem política LGPD.

## Testes de segurança antes do lançamento

Use **três contas reais de teste** no novo banco: participante A, participante B e moderador M.

1. A publica, B denuncia; apenas B e M devem conseguir consultar a denúncia. A não consegue ver a fila.
2. M abre a fila e oculta um post; o post não deve aparecer em leituras de A e B como membros comuns (o autor, por regra explícita, ainda pode visualizá-lo).
3. A e B não devem conseguir consultar as revisões nem inserir registros em `rj_post_moderation`.
4. Tente simular, via chave pública, um INSERT em `rj_moderators` com usuário comum — deve ser negado.
5. M revisa outra denúncia como descartada; confirme que o registro permanece disponível na fila.
6. Verifique que M não pode atualizar/excluir decisões gravadas e que A não pode editar o autor de posts. Exclua um post denunciado como autor e confirme que a denúncia permanece com `post_id` nulo, sem texto, e que a decisão anterior permanece.
7. Inspecione o **Security Advisor**, permissões por coluna e logs, inclusive após excluir uma publicação denunciada. Documente as limitações de retenção e o fluxo de contestação.
8. Teste mobile e faça revisão manual antes de abrir o cadastro para público.

## Próximas etapas necessárias para lançamento

- Definir prazo de guarda, descarte programado e procedimento LGPD para denúncias, que agora permanecem com dados mínimos após a exclusão de posts.
- Revisão paginada de **pendências**, não apenas das últimas 50 denúncias.
- Fluxo de recurso/reversão e política de histórico auditável (a operação de ocultar/revisar agora é atômica).
- Limites de escrita, detecção de spam, bloqueio entre contas, política de privacidade e exclusão de dados pessoais.
- Testes de integração em um projeto próprio (os Playwright atuais exercitam o modo sem backend e contratos estáticos do SQL).
