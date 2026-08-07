# TripBrasil

Projeto preparado para conversao em templates Jinja.

## Como rodar

```bash
python3 -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Abra <http://127.0.0.1:8000>. A lista completa de rotas fica em `/docs`.

## Estrutura

```text
main.py                 uma rota por pagina, com FileResponse
requirements.txt
static/
  css/
    style.css           regras comuns a todas as paginas
    <dominio>.css       regras comuns as paginas de um dominio
    pages/<pagina>.css  regras exclusivas de uma pagina
  js/
    main.js             scripts comuns
    pages/<pagina>.js   scripts exclusivos de uma pagina
  img/
templates/
  administrador/
  anunciante/
  assinante/
  cadastrado/
  publico/
```

Cada arquivo em `templates/` continua sendo a pagina HTML inteira: ainda
nao ha `{% extends %}` nem `{% include %}`. Essa parte e o trabalho de voces.

## Rotas

### administrador

| rota | template |
| --- | --- |
| `/admin/anuncios` | `templates/administrador/admin-anuncios.html` |
| `/admin/avaliacoes` | `templates/administrador/admin-avaliacoes.html` |
| `/admin/cadastrar-local` | `templates/administrador/admin-cadastrar-local.html` |
| `/admin/dashboard` | `templates/administrador/dashboard-admin.html` |
| `/admin/editar-anuncio` | `templates/administrador/admin-editar-anuncio.html` |
| `/admin/editar-local` | `templates/administrador/admin-editar-local.html` |
| `/admin/locais` | `templates/administrador/admin-locais.html` |
| `/admin/login` | `templates/administrador/login-adm.html` |
| `/admin/sugestao` | `templates/administrador/admin-sugestao.html` |
| `/admin/usuarios` | `templates/administrador/usuarios.html` |
| `/admin/ver-sugestoes` | `templates/administrador/admin-ver-sugestoes.html` |
| `/partials/header-admin` | `templates/administrador/header-admin.html` |

### anunciante

| rota | template |
| --- | --- |
| `/anunciante/area` | `templates/anunciante/area-anunciante.html` |
| `/anunciante/cadastrar-estabelecimento` | `templates/anunciante/cadastrar-estabelecimento.html` |
| `/anunciante/contratar-resultado` | `templates/anunciante/contratar-resultado.html` |
| `/anunciante/editar-estabelecimento` | `templates/anunciante/editar-estabelecimento.html` |
| `/anunciante/estatisticas-anuncios` | `templates/anunciante/estatisticas-anuncios.html` |

### assinante

| rota | template |
| --- | --- |
| `/assinante/aumentar-catalogo` | `templates/assinante/aumentar-catalogo.html` |
| `/assinante/cancelar-assinatura` | `templates/assinante/cancelar-assinatura.html` |
| `/assinante/meus-roteiros` | `templates/assinante/meus-roteiros.html` |
| `/assinante/minha-assinatura` | `templates/assinante/minha-assinatura.html` |
| `/assinante/roteiros-ia` | `templates/assinante/roteiros-ia.html` |
| `/assinante/sugerir-estabelecimento` | `templates/assinante/sugerir-estabelecimento.html` |
| `/assinante/sugerir-ponto-turistico` | `templates/assinante/sugerir-ponto-turistico.html` |

### cadastrado

| rota | template |
| --- | --- |
| `/conta/assinar-plano` | `templates/cadastrado/assinar-plano.html` |
| `/conta/avaliar-estabelecimento` | `templates/cadastrado/avaliar-estabelecimento.html` |
| `/conta/avaliar-ponto-turistico` | `templates/cadastrado/avaliar-ponto-turistico.html` |
| `/conta/editar-perfil` | `templates/cadastrado/editar-perfil.html` |
| `/conta/favoritos` | `templates/cadastrado/favoritos.html` |
| `/conta/minhas-avaliacoes` | `templates/cadastrado/minhas-avaliacoes.html` |
| `/conta/perfil` | `templates/cadastrado/perfil-usuario.html` |
| `/partials/header-cadastrado` | `templates/cadastrado/header-cadastrado.html` |

### publico

| rota | template |
| --- | --- |
| `/` | `templates/publico/home.html` |
| `/buscar-explorar` | `templates/publico/buscar-explorar.html` |
| `/cadastro` | `templates/publico/cadastro.html` |
| `/estabelecimento` | `templates/publico/estabelecimento.html` |
| `/login` | `templates/publico/login.html` |
| `/partials/header` | `templates/publico/header.html` |
| `/ponto-turistico` | `templates/publico/ponto-turistico.html` |
| `/recuperar-senha` | `templates/publico/recuperar-senha.html` |
| `/redefinir-senha` | `templates/publico/redefinir-senha.html` |
| `/resultados-pesquisa` | `templates/publico/resultados-pesquisa.html` |
| `/roteiro` | `templates/publico/roteiro.html` |
| `/roteiros-predefinidos` | `templates/publico/roteiros-predefinidos.html` |
| `/tornar-se-anunciante` | `templates/publico/tornar-se-anunciante.html` |

## Proximos passos (conversao para Jinja)

1. Crie `templates/base.html` com o esqueleto comum (`<head>`, cabecalho,
   rodape) e um `{% block conteudo %}{% endblock %}` no miolo.
2. Veja `PARTIAIS.md`: lista os blocos que ja aparecem identicos em varias
   paginas. Cada um e candidato direto a `{% include %}`. No HTML eles estao
   entre `<!-- INICIO bloco compartilhado ... -->` e `<!-- FIM ... -->`.
3. Troque `FileResponse` por `TemplateResponse` no `main.py`, um endpoint por
   vez, passando os dados que a pagina precisa.
4. Substitua os dados fixos do HTML por variaveis e lacos `{% for %}`.

## Sobre os caminhos

Todo asset usa caminho absoluto (`/static/...`) e todo link interno aponta
para a rota (`/login`), nunca para o arquivo (`login.html`). Mantenha assim:
e o que faz a navegacao funcionar a partir de qualquer rota.
