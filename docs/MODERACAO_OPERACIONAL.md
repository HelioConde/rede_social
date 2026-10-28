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
- A operação de ocultar e registrar a decisão ocorre em duas chamadas; se a segunda falhar, o post pode ficar oculto sem decisão registrada. A interface permite atualizar a fila e finalizar a revisão. Para escala, migrar para operação transacional no backend.
- A tabela `rj_reports` tem chave estrangeira com `ON DELETE CASCADE` para o post. Caso o próprio autor exclua a publicação, a denúncia e seu registro de revisão serão removidos. **Este é um limite de retenção de evidências e não equivale a um registro auditável permanente.** Não use essa fila como sistema de conformidade/legal sem implementar retenção própria.

## Testes de segurança antes do lançamento

Use **três contas reais de teste** no novo banco: participante A, participante B e moderador M.

1. A publica, B denuncia; apenas B e M devem conseguir consultar a denúncia. A não consegue ver a fila.
2. M abre a fila e oculta um post; o post não deve aparecer em leituras de A e B como membros comuns (o autor, por regra explícita, ainda pode visualizá-lo).
3. A e B não devem conseguir consultar as revisões nem inserir registros em `rj_post_moderation`.
4. Tente simular, via chave pública, um INSERT em `rj_moderators` com usuário comum — deve ser negado.
5. M revisa outra denúncia como descartada; confirme que o registro permanece disponível na fila.
6. Verifique que M não pode atualizar/excluir decisões gravadas e que A não pode editar o autor de posts.
7. Inspecione o **Security Advisor**, permissões por coluna e logs, inclusive após excluir uma publicação denunciada. Documente as limitações de retenção e o fluxo de contestação.
8. Teste mobile e faça revisão manual antes de abrir o cadastro para público.

## Próximas etapas necessárias para lançamento

- Retenção de denúncias independente da exclusão de posts, com prazo de guarda e tratamento LGPD.
- Revisão paginada de **pendências**, não apenas das últimas 50 denúncias.
- Operações transacionais de ocultar/revisar, fluxo de recurso/reversão e histórico auditável.
- Limites de escrita, detecção de spam, bloqueio entre contas, política de privacidade e exclusão de dados pessoais.
- Testes de integração em um projeto próprio (os Playwright atuais exercitam o modo sem backend e contratos estáticos do SQL).
