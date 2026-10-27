# Segurança e publicação
O backend PHP legado contém consultas SQL e configurações que devem ser auditadas antes de qualquer uso público. **Não hospede a raiz deste repositório como site de produção**.
- Revisar e revogar credenciais antigas de banco potencialmente presentes no código e no histórico Git. Excluir o arquivo atual não remove o histórico.
- Migrar futuramente queries para prepared statements; revisar sessão, CSRF, uploads e controle de acesso antes de reativar PHP.
- A demo de GitHub Pages não usa PHP, SQL, login, envio real nem contas. Dados fictícios e mensagens locais ficam no navegador; a exportação JSON é explícita.
- Somente o diretório pages/ é copiado para dist-pages/ no workflow. Não expor configs ou backups.
- Não publique dados reais, especialmente mensagens ou fotos, neste protótipo.