# Rede Jovem — pesquisa complementar sobre religião e experiência digital
**Pesquisa realizada em 27 de outubro de 2026.**

## Novos sinais para produto
- **YouVersion Brasil (6 out. 2026):** mais de 1,1 milhão de brasileiros usam diariamente apps da plataforma; 29% dos usuários brasileiros seguem um plano anual de leitura bíblica (24% no ano anterior). A proporção é interna à plataforma, não à população do Brasil. `https://www.youversion.com/pt/news/ansiedade-esperanca-e-cura-youversion-revela-o-que-os-brasileiros-estao-buscando-na-biblia-este-ano`
- **YouVersion Brasil:** 'ansiedade', 'esperança' e 'cura' figuram entre os assuntos mais buscados; o **Salmo 91** foi o termo isolado mais pesquisado em 2026. Isso NÃO equivale à preferência de todos os religiosos. Mesma fonte acima.
- **Pew Research Center (21 jan. 2026; pesquisa de 2024):** 76% dos adultos entrevistados no Brasil oram ao menos diariamente, e 43% participam de serviços religiosos semanalmente. Contexto de práticas religiosas, não medida direta de uso da Rede Jovem. `https://www.pewresearch.org/religion/2026/01/21/religious-and-spiritual-practices-in-latin-america/`
- **W3C WAI:** carrosséis acessíveis exigem navegação pelo teclado, controles explícitos, anúncio de mudanças e ausência de rotação automática não controlável. `https://www.w3.org/WAI/tutorials/carousels/`

## Como os dados orientam o produto
1. Introduzir planos **opcionais** com sete leituras e progresso voluntário, sem ranking ou sequência compulsória.
2. Incluir novas reflexões autorais inspiradas em Salmo 91, Salmo 46, João 14:27, Lamentações 3:22-23 e Tiago 1:5.
3. Adicionar busca em títulos, temas, referências e conteúdo, com normalização de acentos.
4. Melhorar o destaque editorial e a acessibilidade da navegação anterior/próxima com anúncio do novo item; sem avanço automático.
5. Salvar progresso do plano no IndexedDB já existente; permitir backup JSON, mantendo privacidade e compatibilidade com backups anteriores.
6. Manter a identidade original da Rede Jovem e as três paletas de cores como **hipóteses de UI**, não gostos inferidos de religiões ou grupos.
7. Construir CSS responsivo sem imagens decorativas dependentes de servidor; auditar com Playwright.

## Interpretação responsável
Não inferir a crença do visitante nem adaptar conteúdo automaticamente por religião. Há diversidade entre católicos, evangélicos, espiritualistas, pessoas de outras religiões e sem religião. O Espaço Fé é uma seção cristã escolhida voluntariamente. Não misturar dados de usuários da YouVersion com toda a população brasileira, nem tratar reflexões autorais como tradução literal da Bíblia.

## Indicadores sugeridos (sem analytics invasivo)
Entendimento da interface, sucesso em completar uma leitura, facilidade para encontrar Salmo 91, acessibilidade por teclado e preferência voluntária por tema visual em testes de usabilidade. Não coletar nomes, religião ou diários de gratidão para métricas.
