# Pesquisa de mercado e decisões de produto — Rede Jovem / Espaço Fé

Última revisão: 27 de outubro de 2026

## Escopo e limites
A Rede Jovem continua sendo uma demonstração estática aberta a qualquer visitante, sem autenticação ou base de dados externa. O novo **Espaço Fé** é uma seção cristã acessada voluntariamente, sem rastreamento, inferência ou classificação da religião do visitante. Não representa a totalidade das religiões brasileiras.

## Resultados de mercado confirmados
1. O IBGE (Censo 2022, publicado em 06/06/2025) estima que, entre pessoas de **10 anos ou mais**, 56,7% se declaram católicas, 26,9% evangélicas e 9,3% sem religião. Esses dados não permitem inferir gostos por cor, tipo de interface ou intenção de uso da Rede Jovem. Fonte: https://agenciagov.ebc.com.br/noticias/202506/censo-2022-catolicos-seguem-em-queda-evangelicos-e-sem-religiao-crescem-no-pais
2. Pesquisa Pew (2024, publicada 21/01/2026): 76% dos adultos brasileiros entrevistados disseram orar ao menos diariamente. Isto sugere relevância de conteúdo devocional, mas não determina o interesse de todos os usuários. Fonte: https://www.pewresearch.org/global/2026/01/21/religious-and-spiritual-practices-in-latin-america/
3. YouVersion: Isaías 41:10 liderou o engajamento bíblico global em 2025; amor, ansiedade e paz estiveram entre os termos de busca mais comuns. Fonte: https://www.youversion.com/de/news/youversion-announces-2025-verse-of-the-year
4. Não foi encontrada evidência populacional sólida de que "religiosos preferem azul/verde/dourado". Uma referência de identidade visual de organização religiosa relata associações de azul/verde com espiritualidade, mas **não constitui pesquisa representativa dos brasileiros religiosos**. Fonte: https://guide.churchofjesuschrist.org/4-2-5-colors?lang=eng
5. Acessibilidade: para texto comum, contraste WCAG AA de pelo menos 4,5:1; para componentes e ícones relevantes, 3:1. Fonte: https://developer.mozilla.org/en-US/docs/Web/Accessibility/Guides/Understanding_WCAG/Perceivable/Color_contrast

## Hipóteses de design (não fatos sobre preferências religiosas)
- **Azul Sereno:** comunica tranquilidade e preserva a identidade azul original.
- **Verde Esperança:** alternativa com acolhimento e renovação.
- **Luz e Fé:** azul, dourado e creme como variante editorial.
As três são escolhidas manualmente, guardadas apenas no navegador, e precisam de testes reais com usuários diversos. Não há personalização automática por religião.

## Conteúdo curado
12 referências bíblicas distribuídas em esperança, paz, amor, coragem, gratidão e propósito. Os parágrafos são **reflexões autorais**, identificadas explicitamente como NÃO sendo transcrições de tradução bíblica moderna. Referências não estão sujeitas às restrições de reprodução integral da tradução.
- Sem promessa de aconselhamento médico, psicológico ou pastoral.
- Caderno de gratidão particular no IndexedDB do navegador, com exclusão e backup JSON.
- Compartilhamento no feed apenas por clique explícito.
- Nenhum pedido de perfil religioso ou coleta de fé.

## Riscos, próximos passos e métricas
- Verificar contraste final com testes automatizados e revisão visual.
- Rodar testes com usuários voluntários de várias crenças e com pessoas sem religião, sem inferir suas preferências.
- Comparar navegação, legibilidade, compreensão da distinção entre texto bíblico e reflexão e facilidade de desativar o conteúdo opt-in.
- Continuar usando o GitHub Pages, sem backend, como DEMO local; não alegar mensagens reais ou interação multiusuário.
