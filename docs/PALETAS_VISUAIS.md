# Paletas acessíveis — Rede Jovem (28/10/2026)

## Objetivo

A versão de outubro recebeu feedback sobre a direção visual com flores e muito rosa/lilás. A nova proposta evita presumir gênero ou estilo com base no perfil da pessoa. A aparência padrão é **Índigo**: azul e grafite, com detalhes turquesa e geometria de conexões, preservando o visual social contemporâneo e os recursos existentes.

## Aparência e personalização

A seção **Configurações → Aparência → Cores da interface** oferece quatro escolhas para qualquer pessoa:

| Paleta | Cores de destaque | Uso |
|---|---|---|
| Índigo (padrão) | Azul + turquesa | Visual equilibrado e profissional |
| Oceano | Azul-petróleo + turquesa | Fresco e leve |
| Floresta | Verde + esmeralda | Natural e acolhedor |
| Aurora | Violeta + coral | Mais colorido e expressivo |

A escolha é **independente** do tema claro/escuro, não depende de gênero, nome ou localização e fica persistida em `localStorage` (`rede-jovem-accent-v1`). A preferência aplica-se também à rota `#comunidade`. Não são alterados posts, arquivos, amizades nem mensagens.

## Mudanças de interface

- Substituição de flores por redes de círculos, pontos e ícone de pessoas unidos no topo do feed.
- Troca de fundo pastel rosa pela combinação neutra azul/grafite na identidade inicial.
- Sidebar, botões, textos de destaque, contatos, convites e área online ajustados à paleta ativa.
- Atalho **Personalizar cores** no desktop, com opções também acessíveis pela navegação mobile em Configurações.
- Botões com `aria-pressed`, foco visível, sem animações obrigatórias e contraste considerado para ambos os temas.

## Arquitetura

- `src/main.tsx`: estado e seleção; carregamento da preferência também ao visitar diretamente `#comunidade`.
- `src/personalization.css`: tokens e substituições visuais isolados, importados após o design anterior.
- `tests/personalization.spec.ts`: escolhas, persistência, mobile, modo escuro e navegação online.

Não há segmentação de cor por sexo: é personalização voluntária.
