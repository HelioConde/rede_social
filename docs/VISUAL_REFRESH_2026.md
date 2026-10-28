# Rede Jovem — Visual Refresh 2026

## Direção criativa

**Personalidade:** contemporânea, acolhedora, jovem e focada nas pessoas. Mantém a marca Rede Jovem, sem reproduzir visualmente qualquer plataforma específica.

**Problema identificado:** o layout anterior, apesar de funcional, usava superfícies azul-escuras quase uniformes, painéis com hierarquia similar e um feed com pouca prioridade visual.

### Estratégia

1. **Clareza editorial:** fundo claro e superfícies brancas com bordas sutis; a caixa de publicação e o feed recebem prioridade visual.
2. **Expressividade controlada:** destaque principal com violeta/lilás e coral; ilustrações geométricas por CSS, sem imagens externas ou recursos pesados.
3. **Tipografia e escala:** títulos grandes com pesos fortes e menos competição entre cards.
4. **Social first:** menu discreto; descoberta e Espaço Fé compactados em cartões menores; contatos à direita.
5. **Personalização:** modo escuro atualizado, sem alterar dados de posts, amizades, mensagens, reflexão ou IndexedDB.
6. **Acessibilidade e desempenho:** foco visível, contraste forte, suporte a movimento reduzido, responsividade de 320 a 1600 px e sem fontes externas para renderizar.

### Cores principais

| Papel | Claro | Escuro |
|---|---|---|
| Fundo | `#F7F8FC` | `#11131D` |
| Cartão | `#FFFFFF` | `#1C2030` |
| Texto | `#23243C` | `#F4F2FF` |
| Secundário | `#646B81` | `#BBC0D4` |
| Ação | `#624BCC` | `#BAACFF` |
| Coral decorativo | `#F96F84` | `#FF9EB0` |

## Referências de pesquisa

- Google Design, **Expressive Design: Google's UX Research** (2025): cor, forma, escala, movimento e agrupamento aplicados à hierarquia visual. https://design.google/library/expressive-material-design-google-research
- Nielsen Norman Group, **The Characteristics of Minimalism in Web Design**: tipografia, espaço negativo e reduzir distrações sem esconder funções principais. https://www.nngroup.com/articles/characteristics-minimalism/
- Adobe Express, **A beginner's guide to social media graphics** (21 jul. 2026): clareza, consistência e leitura imediata. https://www.adobe.com/express/learn/blog/design-tips-for-social-media-graphics
- ManyPixels, **Top social media design trends for 2026** (2 jul. 2026): tipografia marcante, autenticidade e minimalismo com personalidade. https://www.manypixels.co/blog/social-media-design/trends
- W3C, **WCAG 2.2**, 1.4.3: contraste mínimo 4.5:1 para texto comum. https://www.w3.org/TR/WCAG22/

## Implementação

- `src/refresh.css` é a camada visual, importada **depois** dos estilos existentes.
- `src/main.tsx` altera apenas apresentação, preferências visuais e agrupamento de links rápidos.
- A seleção de tema utiliza `rede-jovem-theme-v3`: visitantes existentes entram inicialmente no tema claro da nova versão, sem migrar ou apagar dados sociais.
- `#comunidade` permanece integrada visualmente, porém ainda requer configuração separada de autenticação e banco para interação real.
- `tests/visual-refresh.spec.ts` valida contraste básico, tema, navegação, layout responsivo e apresentação.

## QA e roteiro de revisão

- Testar feed, Espaço Fé, perfis, amizades, mensagens e configurações.
- Capturar `320`, `360`, `390`, `768`, `1280` e `1600` px; verificar overflow horizontal, texto sobreposto e links não clicáveis.
- Verificar edição/publicação de post, comentários, backup e toggle dark/light.
- Verificar navegação por teclado, foco visível e `prefers-reduced-motion`.

**Escopo:** redesign apenas. Não prometer mensagens reais, cadastro ativo ou funcionalidades inexistentes.
