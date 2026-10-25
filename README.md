<div align="center">
  <h1>🌐 Rede Social — Experimento PHP</h1>
  <p><strong>Um projeto histórico de rede social com cadastro, perfis, amizades, mensagens e publicações.</strong></p>
  <p><img alt="PHP" src="https://img.shields.io/badge/PHP-Backend-777BB4?logo=php&logoColor=white"> <img alt="Status" src="https://img.shields.io/badge/status-sistema%20legado-64748b"></p>
</div>

## O que este projeto representa

A **Rede Social** registra uma implementação antiga de funcionalidades comuns a comunidades online. Ao contrário de uma simples tela conceitual, o repositório contém **rotas PHP para cadastro, login, perfis, amigos, solicitações, publicações e mensagens**.

Isso **não significa** que todas as funcionalidades estejam operacionais ou seguras em um ambiente atual.

## Estrutura encontrada

| Área | Arquivos de exemplo |
| --- | --- |
| **Acesso e cadastro** | `cadastro.php`, `exec_registro.php`, `verificacao.php`, `id_login.php` |
| **Perfis** | `perfil.php`, `editar.php`, `myphoto.php`, `uploudPerfil.php` |
| **Amigos** | `addamigo.php`, `amigoslist.php`, `solicitacao.php`, `aceitaramigo.php` |
| **Publicações** | `posts.php`, `postAmigos.php`, `gravar.php` |
| **Mensagens e presença** | `amigosmsg.php`, `online.php`, `ocupado.php`, `ausente.php` |
| **Busca** | `pesquisa.php` |
| **Banco e recursos** | `config.php`, `img/`, `css/`, `js/`, `uploadedimage/` |

## Explorar localmente

Para estudo, use PHP e um **banco isolado com dados fictícios**. Clone o repositório, revise previamente `config.php` e somente então inicie o servidor local:

```bash
git clone https://github.com/HelioConde/rede_social.git
cd rede_social
php -S 127.0.0.1:8000
```

Abra o ponto de entrada esperado pela aplicação, considerando que há arquivos `Index.php` e outros scripts de acesso. **A autenticação e o banco de dados precisam ser configurados; a instalação não foi homologada nesta revisão.**

## Segurança antes de qualquer publicação

**Não coloque a aplicação na internet sem auditoria.** Sistemas sociais tratam informações pessoais, imagens e mensagens privadas; portanto, devem ter validação de sessões e permissões de cada usuário, SQL parametrizado, proteção de upload, escape contra XSS e defesa contra CSRF.

Também revise **credenciais históricas, arquivos de configuração e qualquer arquivo enviado** antes de disponibilizar um repositório público. O fato de haver uma `verificacao.php` não garante proteção suficiente de todas as rotas.

## Relação com outros projetos

[**GameSocial**](https://github.com/HelioConde/rede_social_gamer) é um conceito separado em React para uma comunidade voltada a jogadores. Este repositório preserva a experiência PHP mais antiga.

Desenvolvido por [Hélio Conde](https://github.com/HelioConde).
