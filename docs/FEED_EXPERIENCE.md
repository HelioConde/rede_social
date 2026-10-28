# Rede Jovem — Feed e experiência social (MVP local)

Esta etapa aprimora a área demonstrativa da Rede Jovem, mantendo o modo online separado até a configuração de um backend dedicado.

## Funcionalidades

- **Salvos**: botão de marcador em cada publicação, com indicação de estado e um filtro no feed. Publicações favoritas ficam no IndexedDB do navegador, separadas por perfil demonstrativo.
- **Mais recentes / Mais curtidas**: ordenação local do feed; quando a contagem de curtidas empata, a publicação mais recente aparece primeiro.
- **Filtros Todos / Amigos / Salvos**: contagem visível de salvos e mensagens de estado vazio com retorno ao feed.
- **Busca ativa**: indicação do termo e ação de limpar.
- **Copiar texto**: texto do botão deixa claro que não é possível compartilhar um link público de uma postagem local.
- **Acessibilidade**: botões com `aria-label` / `aria-pressed`, ordenação com label, correção do link de pular conteúdo para não resetar a navegação.

## Compatibilidade e privacidade

Nenhum dado existente é apagado. `savedPostIds` é campo opcional de `SocialData`, incluído no backup JSON e aceito pelos dados antigos mesmo quando ausente. O validador rejeita mapas de salvos inválidos. Ao excluir uma publicação, referências a ela são retiradas dos salvos de todos os perfis locais.

Salvar ou curtir na demonstração **não gera interação entre usuários reais**. Dados de um navegador não aparecem em outro; o modo online tem infraestrutura e limitações independentes.

## QA

Verificar via GitHub Actions: build TypeScript, testes Playwright com salvamento/persistência, troca de perfis, ordem, busca, 320–768 px e navegação por teclado; manter testes do Espaço Fé, perfil, mensagens e paletas.
