# Code review - TripBrasil

TripBrasil e um protótipo de portal de turismo servido por FastAPI: 45 rotas em `main.py`, cada
uma devolvendo uma página HTML inteira via `FileResponse`, com CSS e JS já extraídos para
`static/`. O estado é o esperado para esta etapa: a separação de camadas está feita e a estrutura
de pastas está limpa. O que ainda não está pronto é a **camada de dados**: nenhum formulário do
projeto consegue enviar informação para o servidor, e há um caminho de imagem quebrado replicado
em 39 das 42 folhas de estilo de página. São dois defeitos mecânicos, de correção rápida, mas que
travam a próxima entrega. Nota geral: estrutura boa, HTML de formulário e acessibilidade ainda
crus.

Este review verificou 25 alarmes. **7 foram derrubados** na conferência (a seção final explica
por quê) e vários tiveram a contagem corrigida — os números abaixo foram medidos, não estimados.

## Pontos fortes

- **Rotas e assets consistentes**: 45 rotas em `main.py`, nenhum path duplicado, nenhuma rota
  apontando para template inexistente. Todo link interno usa a rota (`/login`), nunca o arquivo.
- **Nenhum `label for` órfão**: os 9 `<label for="...">` do projeto apontam para ids que existem.
  Zero casos quebrados.
- **Nenhum `getElementById` para id inexistente**: conferi as 42 duplas página/script — todos os
  ids buscados pelo JS existem no HTML correspondente. O acoplamento `main.js` ↔ páginas também
  está correto (detalhes na seção de descartados).
- **`alt` descritivo quando existe**: nenhum `alt="imagem"`/`alt="foto"`. Os headers usam
  `alt="Logo TripBrasil"`.
- **Placeholders documentados**: `templates/publico/roteiros.html`,
  `templates/anunciante/meus-estabelecimentos.html` e `templates/assinante/editar-roteiro.html`
  contêm a justificativa de por que a tela não foi feita. Isso é decisão registrada, não arquivo
  esquecido.
- **Selects de estado/cidade com dados reais**: 3 páginas consomem a API do IBGE e montam as
  `<option>` com `createElement` + `textContent`, não com concatenação de string.

## Achados

### Crítico

#### C1. Imagem de fundo quebrada em 39 das 42 folhas de página

`static/css/pages/publico-home.css:27` (+ 41 ocorrências em 38 outros arquivos)

```css
background:
    linear-gradient(rgba(0, 0, 0, .55), rgba(0, 0, 0, .55)),
    url('../static/img/fundo.webp');
```

**Evidência.** `url()` em CSS resolve relativo à **folha de estilo**, não ao documento. A folha é
servida em `/static/css/pages/publico-home.css`, então `../static/img/fundo.webp` vira
`/static/css/static/img/fundo.webp` — que não existe. Medido: 42 ocorrências em 39 arquivos, todas
apontando para `fundo.webp`.

**Impacto.** O fundo da página nunca carrega. Em 9 dos 39 arquivos há uma segunda camada
`url('https://images.unsplash.com/...')` que pinta por baixo e mascara o defeito — nesses casos o
site parece funcionar, mas está puxando imagem da internet a cada carga. Nos outros 30 o fundo é
só o gradiente preto.

**Correção.** Trocar por caminho absoluto, que é a convenção que o próprio README manda usar:

```css
url('/static/img/fundo.webp');
```

(o relativo correto seria `../../img/fundo.webp`, mas o absoluto é mais robusto e casa com o resto
do projeto). Comando para localizar todas: `grep -rn "\.\./static/img" static/css/`.

**Extra do mesmo grupo:** 3 folhas usam **só** Unsplash, sem imagem local —
`administrador-admin-locais.css:24`, `administrador-admin-sugestao.css:21`,
`administrador-admin-ver-sugestoes.css:24`. Sem internet, essas 3 telas ficam sem fundo.

#### C2. 99 campos de formulário sem `name` — nenhum dado chegará ao FastAPI

`templates/publico/login.html:47,51`

```html
<input type="email" class="form-control custom-input" placeholder="E-mail ou usuário" required>
<input type="password" class="form-control custom-input" placeholder="Senha" required>
```

**Evidência.** Parser de HTML sobre os 45 templates: **99** `input`/`select`/`textarea` sem `name`
(excluindo `hidden`, `submit`, `button`). O projeto inteiro tem apenas **4** campos com `name`, e
todos são o mesmo rádio `tipo_local` (`admin-cadastrar-local.html:51,54` e
`admin-editar-local.html:49,53`). Espalhado por 28 arquivos; os maiores focos são
`admin-editar-anuncio.html` (8), `contratar-resultado.html` (8), `admin-cadastrar-local.html` (6),
`admin-locais.html` (6), `cadastrar-estabelecimento.html` (6), `editar-estabelecimento.html` (6).

**Impacto.** Um campo sem `name` **não é serializado** no envio do formulário. Quando `main.py`
passar a ter rotas `POST`, o corpo da requisição chegará vazio: nenhum `Form(...)` do FastAPI vai
receber valor, e cada um deles vai estourar `422 Unprocessable Entity`. É o bloqueio direto da
próxima entrega.

**Correção.** Dar `name` em snake_case a todo campo que representa dado, casando com o nome do
parâmetro da rota. Em `login.html`:

```html
<input type="email" name="email" id="email" class="form-control custom-input" required>
<input type="password" name="senha" id="senha" class="form-control custom-input" required>
```

e do lado do servidor `def post_login(email: str = Form(...), senha: str = Form(...))`. Aproveite a
passada para colocar `id` no mesmo campo — resolve A2 de graça.

### Alto

#### A1. Os 17 formulários do projeto estão sem `action` e sem `method`

`templates/publico/login.html:45`, `cadastro.html:36`, `redefinir-senha.html:38`,
`tornar-se-anunciante.html:37`, `assinar-plano.html:63`, `editar-perfil.html:40`,
`avaliar-estabelecimento.html:39`, `avaliar-ponto-turistico.html:39`,
`sugerir-estabelecimento.html:46`, `sugerir-ponto-turistico.html:46`, `login-adm.html:30`,
`admin-cadastrar-local.html:32`, `admin-editar-anuncio.html:33`, `admin-editar-local.html:29`,
`cadastrar-estabelecimento.html:30`, `contratar-resultado.html:21`,
`editar-estabelecimento.html:30`.

**Evidência.** São **17 de 17** — não existe um único `<form>` com destino declarado. Sete deles
mascaram isso com `onsubmit="event.preventDefault(); openModal();"` ou
`onsubmit="handleSubmit(event)"`, ou seja, o envio é cancelado e substituído por um `alert`/modal.

**Impacto.** Sem `method`, o default é `GET`; sem `action`, o destino é a própria URL. O resultado
seria recarregar a mesma página com os dados na query string — inclusive senha visível na barra de
endereço em `login.html` e `redefinir-senha.html`.

**Correção.** Para cada form, `<form method="post" action="/rota-de-destino">` e remover o
`onsubmit` que faz `preventDefault`. O modal de confirmação vira redirect após o POST.

#### A2. 83 campos sem rótulo associado

`templates/publico/cadastro.html:46-47`

```html
<label>Nome completo</label>
<input type="text" placeholder="Digite seu nome" required>
```

**Evidência.** 83 `input`/`select`/`textarea` sem `<label for>`, sem label envolvente e sem
`aria-label`. O projeto tem 81 elementos `<label>` mas só **9** usam `for`. O caso de
`cadastro.html` é o mais fácil de resolver: o texto já está escrito, só falta a ligação.
Há também campos sem qualquer texto ao redor: `admin-anuncios.html:100` (busca de campanha),
`admin-locais.html:37` (busca de locais) e os dois `<select class="filter-select">` do mesmo
arquivo (linhas 65 e 70).

*(o alarme original dizia 94; a contagem correta, considerando label envolvente e `aria-label`, é 83)*

**Impacto.** Leitor de tela anuncia "caixa de edição" sem dizer do quê. O `placeholder` não supre:
some ao digitar e não é lido de forma confiável. Clicar no texto do rótulo também não foca o campo.

**Correção.** Ligar por id, no mesmo passo do C2:

```html
<label for="nome_completo">Nome completo</label>
<input type="text" id="nome_completo" name="nome_completo" placeholder="Digite seu nome" required>
```

Para busca e filtros sem rótulo visível, use `aria-label="Pesquisar locais cadastrados"`.

#### A3. 81 botões e links sem nome acessível

`templates/administrador/usuarios.html:85,102,119`

```html
<button class="btn-delete" title="Excluir Usuário"><svg ...></svg></button>
```

**Evidência.** 81 controles (`<button>`/`<a>`) cujo conteúdo é só ícone SVG, `<i>` de Font Awesome
ou imagem sem `alt` útil. Divididos em dois grupos:

- **48 sem nada** — nem texto, nem `title`, nem `aria-label`. Inclui os 21 botões "voltar"
  (`class="back-button"`, ex.: `admin-anuncios.html:24`), os 6 `btn-delete-thumb`
  (`admin-cadastrar-local.html:112,116,120,124`, `admin-editar-local.html:95,99`), o botão de
  enviar do chat (`roteiros-ia.html:56`) e o olho de mostrar senha (`login-adm.html:45`).
- **33 com apenas `title`** — ex.: `usuarios.html:85`, `meus-roteiros.html:79,86`. O `title` entra
  na computação do nome acessível só como último recurso: não aparece em toque, não é exposto de
  forma confiável a comando de voz e alguns leitores o ignoram por configuração.

Dentro dos 48, **16 são links cujo único conteúdo é `<img alt="">`**:
`buscar-explorar.html:57,66,75,84,93,102,111,120` e `favoritos.html:53,62,71,80,89,98,107,116`.
O link vira anônimo — o leitor anuncia só "link".

**Correção.** Nos 48 sem nada, adicionar `aria-label`. Nos 16 links de card, mover o nome do
destino para o `alt` (o `<h3>` logo abaixo já tem o texto):

```html
<a href="/ponto-turistico"><img src="/static/img/buscar-explorar/e1.webp" alt="Pão de Açúcar, RJ"></a>
```

Nos 33 que têm `title`, trocar por `aria-label` com o mesmo texto (pode manter o `title` como
tooltip visual).

#### A4. Desfavoritar não funciona: ternário com o mesmo valor nos dois ramos

`static/js/pages/cadastrado-favoritos.js:10`

```js
c.classList.toggle('ativo');
c.textContent = c.classList.contains('ativo') ? '♥' : '♥';
```

**Evidência.** Os dois ramos devolvem `♥`. Compare com a versão correta do mesmo componente em
`static/js/pages/publico-buscar-explorar.js:22-25`, que devolve `'♥' : '♡'`.

**Impacto.** Em `/conta/favoritos` os 8 corações já nascem preenchidos
(`favoritos.html:55,64,...` usam `♥`). Ao clicar, a classe `.ativo` alterna e o CSS muda a cor de
`#113601` para `black` (`cadastrado-favoritos.css:143,153`) — uma diferença praticamente
invisível. Na prática o usuário não consegue remover um favorito, que é justamente a função da
tela.

**Correção.** `c.textContent = c.classList.contains('ativo') ? '♥' : '♡';`

#### A5. 23 `<img>` sem `alt`

`templates/publico/resultados-pesquisa.html:50,59,68,77,86,95,104,113` (os 8 cards),
`roteiros-predefinidos.html:45,57,69,80,91`, `cadastro.html:73,74,75,76`,
`home.html:153,167,181,195`, `admin-anuncios.html:154`, `admin-sugestao.html:35`.

**Impacto.** Sem `alt`, o leitor de tela lê o nome do arquivo (`img1.webp`). Com `alt=""` a imagem
seria ignorada — que é o certo para as 4 decorativas de `cadastro.html`, mas errado para as 13 que
são o conteúdo do card.

**Correção.** Decorativa → `alt=""`. Conteúdo → `alt` com o nome do destino, já disponível no
`<h3>` irmão. Ao virar `{% for %}` isso fica `alt="{{ local.nome }}"`.

#### A6. 8 imagens referenciadas não existem no disco

- `templates/publico/home.html:153,167,181,195` → `vitoria.jpg`, `rio.jpg`, `salvador.jpg`, `florianopolis.jpg`
- `templates/publico/home.html:228` → `mapa-brasil.svg`
- `templates/administrador/admin-anuncios.html:154` → `anuncio1.jpg`
- `templates/cadastrado/perfil-usuario.html:31` e `editar-perfil.html:74` → `mariana.webp`

**Evidência.** Conferido contra o conteúdo real de `static/img/`, que tem apenas `fundo.webp`,
`logo-cabecario.svg`, `seta.svg` e as pastas `buscar-explorar/`, `cadastro/`, `estabelecimento/`,
`minha-assinatura/`, `resultados-pesquisa/`, `roteiros-predefinidos/`, `dashboard-adm/`.

**Impacto.** Home é a rota `/` — a primeira tela do site mostra 4 cards de destino quebrados e o
mapa ausente.

**Correção.** Adicionar os arquivos em `static/img/` ou apontar para imagens que já existem. Note
que essas 8 são as *únicas* quebradas: os outros 21 caminhos `../static/...` resolvem certo (ver D2).

#### A7. 33 elementos não interativos usados como controle

`templates/publico/buscar-explorar.html:59` — 24 corações de favoritar são `<span>`:

```html
<span class="favorito">♡</span>
```

com listener em `static/js/pages/publico-buscar-explorar.js:18`. Distribuição: 8 em
`buscar-explorar.html`, 8 em `resultados-pesquisa.html`, 8 em `favoritos.html`.

Mais 9 `<div onclick=...>`: `admin-editar-anuncio.html:76,85,94,103`,
`contratar-resultado.html:70,78,86,94` (ambos `toggleCheckbox`) e
`admin-cadastrar-local.html:103` (`triggerUploadAlert`).

**Impacto.** `<span>` e `<div>` não recebem foco pelo Tab, não respondem a Enter/Espaço e não são
anunciados como controle. Favoritar e selecionar estabelecimento ficam inacessíveis por teclado.

**Correção.** Para os corações: `<button type="button" class="favorito" aria-pressed="false">♡</button>`
com `background:none;border:0;` no CSS, e o JS alternando `aria-pressed`. Para os
`div.estab-item`: envolver o rótulo num `<label for="estab1">` — o clique no label já alterna o
checkbox nativo, e o `toggleCheckbox()` do `main.js` deixa de ser necessário.

#### A8. Header injetado recarrega o CSS base no fim do body e inverte a cascata

`templates/publico/header.html:1-3` (idem `cadastrado/header-cadastrado.html:1-3` e
`administrador/header-admin.html:1-3`)

```html
  <link rel="stylesheet" href="/static/css/style.css">
  <link rel="stylesheet" href="/static/css/publico.css">
  <link rel="stylesheet" href="/static/css/pages/publico-header.css">
<header>
```

Esse arquivo inteiro é injetado em `<div id="header">` via `innerHTML`
(`static/js/pages/publico-home.js:9` e mais 41).

**Evidência.** `<link>` inserido por `innerHTML` **é aplicado** pelo navegador (ao contrário de
`<script>`). Como ele entra no fim do `<body>`, `style.css` e `<dominio>.css` passam a vir **depois**
de `pages/<pagina>.css`, invertendo a ordem que a estrutura do projeto define. Colisão real medida:

| seletor | página quer | `style.css` reinjetado impõe |
| --- | --- | --- |
| `.custom-toast` (`cadastrado-editar-perfil.css:177`, dentro de `@media max-width:991px`) | `right: 20px; bottom: 20px` | `right: 30px; bottom: 30px` |
| `.custom-toast` (`publico-tornar-se-anunciante.css:188`, dentro de `@media max-width:768px`) | `right: 20px; bottom: 20px` | `right: 30px; bottom: 30px` |

No mobile o toast fica com `left:20px` (da página) e `right:30px` (do `style.css`) — assimétrico.
Há também `.panel-layout` em `admin-locais.css:125` e `admin-ver-sugestoes.css` colidindo com a
regra responsiva de `style.css:557-560`: qual vence depende de o `fetch` já ter resolvido ou não,
ou seja, o layout responsivo dessas duas telas muda **durante** o carregamento.

**Impacto.** Além do salto visual, isso torna a cascata imprevisível: uma regra de página pode
funcionar em teste e falhar em produção conforme a latência do `fetch`.

**Correção.** Tirar as 3 linhas de `<link>` dos partials e declarar
`pages/<dominio>-header.css` no `<head>` das páginas que usam aquele header. Quando virar
`{% include %}` o problema some sozinho — o partial passa a ser colado no lugar certo.

### Médio

#### M1. `<base href="../">` em 40 páginas quebra todo link `href="#"`

`templates/publico/home.html:11`, `admin-anuncios.html:8` e mais 38.

**Evidência e nuance.** O `<base>` não é inofensivo nem inútil — ele é o que faz as 29 URLs
`../static/...` de 8 arquivos resolverem certo. Numa rota como `/conta/perfil`, o base resolve
para `http://host:8000/`, e daí `../static/img/x.webp` vira `/static/img/x.webp`. **Se você
remover o `<base>` sem trocar essas 29 URLs por `/static/...`, elas quebram.**

O que ele quebra de fato:

1. `templates/publico/home.html:19` — `<link rel="stylesheet" href="style.css">` resolve para
   `/style.css` → 404.
2. Os **7 `href="#"`** em `perfil-usuario.html:50`, `login-adm.html:51`, `roteiros-ia.html:70`,
   `meus-roteiros.html:77,112,147`, `minha-assinatura.html:54`. Com `<base>`, `#` não é mais
   "esta página": resolve para `http://host:8000/#`. Clicar em "Ver Itinerário" em
   `/assinante/meus-roteiros` **leva o usuário para a home**. O mesmo vale para os 31 `href="#"`
   dos menus de emergência injetados por JS (ver M4).

*(o alarme original falava em 70 URLs relativas em 12 páginas; medido: 29 em 8 páginas)*

**Correção, em ordem:** (1) trocar as 29 `../static/...` por `/static/...`;
(2) apagar `home.html:19`; (3) remover as 40 tags `<base>`; (4) trocar os `href="#"` por
`<button type="button">` ou pela rota real.

#### M2. Reset `*{}` e regra `body{}` repetidos nas 42 folhas de página

`static/css/pages/publico-home.css:12-34` — bloco idêntico em **42** arquivos de
`static/css/pages/`. `static/css/style.css` não tem nenhum dos dois.

**Impacto.** Trocar a fonte ou o fundo do site exige editar 42 arquivos. E é aqui que o defeito
C1 se multiplicou: o `url()` errado veio junto na cópia.

**Correção.** Mover `*{}` e `body{}` para o topo de `static/css/style.css` (já carregado em todas
as páginas) e apagar os 42 blocos. Corrige C1 e M2 numa passada só.

#### M3. Tokens de cor definidos e ignorados: `#70AE6E` aparece 45 vezes escrito à mão

`static/css/pages/publico-home.css:5-10`

```css
:root {
    --primary: #70AE6E;
    --primary-hover: #5A9758;
    --glass: rgba(255, 255, 255, .10);
    --glass-border: rgba(255, 255, 255, .18);
}
```

**Evidência.** O `:root` existe em 4 folhas de página (`publico-home.css`,
`administrador-admin-anuncios.css`, `administrador-admin-avaliacoes.css`,
`administrador-dashboard-admin.css`) e **nunca** em `style.css`. Cores literais em
`static/css/`: `#70ae6e` 45x, `#63b880` 29x, `#e6c594` 22x, `#ffffff` 15x, `#ffc107` 10x,
`#0c0c0c` 11x, `#5a9758` 10x. Usos de `var(--...)` no projeto inteiro: **10**.

**Impacto.** Um `:root` declarado dentro de `publico-home.css` só existe na home. As outras 38
páginas nem têm as variáveis. Mudar a cor da marca hoje é find-and-replace em 45 lugares.

**Correção.** Mover o `:root` para o topo de `style.css`, ampliar com as cores realmente usadas
(`--success:#63b880`, `--sand:#e6c594`, `--warning:#ffc107`) e substituir os literais.

#### M4. Bloco `fetch` + `innerHTML` do header copiado em 42 arquivos, em 3 variantes

`static/js/pages/publico-home.js:3-11`

- **Variante A** — checa `response.ok` e loga no `catch`. Ex.: `publico-home.js`, `publico-buscar-explorar.js`.
- **Variante B** — sem checagem e **sem `catch`**. 6 arquivos: `administrador-admin-sugestao.js`,
  `anunciante-editar-estabelecimento.js`, `assinante-minha-assinatura.js`,
  `cadastrado-favoritos.js`, `publico-resultados-pesquisa.js`, `publico-roteiros-predefinidos.js`.
  Se o `fetch` falhar, a página fica sem cabeçalho e sem erro visível.
- **Variante C** — o `catch` injeta um `<nav>` de emergência de ~10 linhas com estilo inline. 11
  arquivos, entre eles `administrador-admin-cadastrar-local.js:42-51`,
  `cadastrado-perfil-usuario.js`, `anunciante-area-anunciante.js`. Nesses menus **todos os links
  são `href="#"`** — combinados com o `<base>` de M1, levam para a home.

*(o alarme dizia 40 arquivos; são 42 — todos os `static/js/pages/*.js`)*

**Correção.** Extrair para `static/js/header.js` uma função
`carregarHeader(rota, alvo = '#header')` com uma implementação só, e cada página chamar
`carregarHeader('/partials/header')`. Some ~400 linhas duplicadas. Quando virar
`{% include %}`, o arquivo inteiro desaparece.

#### M5. 14 páginas pulam nível de heading

| arquivo:linha | salto |
| --- | --- |
| `publico/estabelecimento.html:51` | h1 → h5 |
| `publico/ponto-turistico.html:51` | h1 → h5 |
| `anunciante/estatisticas-anuncios.html:34` | h1 → h4 |
| `administrador/dashboard-admin.html:123` | h3 → h5 |
| `administrador/dashboard-admin.html:77`, `admin-anuncios.html:144`, `admin-avaliacoes.html:40`, `admin-sugestao.html:47`, `assinante/meus-roteiros.html:72`, `cadastrado/favoritos.html:56`, `publico/buscar-explorar.html:60`, `publico/resultados-pesquisa.html:53`, `publico/roteiro.html:42`, `publico/roteiros-predefinidos.html:49` | h1 → h3 |

**Impacto.** A navegação por cabeçalhos (comando padrão de leitor de tela) pula seções inteiras.

**Correção.** Usar o nível seguinte e resolver o tamanho no CSS. Em `favoritos.html:56` o `<h3>`
do card deve virar `<h2>` — o tamanho é definido por `.card-content h3`
(`cadastrado-favoritos.css:128`), então basta trocar o seletor para `.card-content h2`. O nível do
heading é estrutura; o tamanho é estilo, e são coisas independentes.

#### M6. Páginas duplicadas: `sugerir-*` e `avaliar-*`

Medido com `diff`:

| par | linhas diferentes |
| --- | --- |
| `assinante/sugerir-estabelecimento.html` × `sugerir-ponto-turistico.html` | 12 de 100 |
| `cadastrado/avaliar-estabelecimento.html` × `avaliar-ponto-turistico.html` | 8 de 75 |
| `assinante-sugerir-estabelecimento.js` × `...-ponto-turistico.js` | **1** (só o comentário do topo) |
| `cadastrado-avaliar-estabelecimento.js` × `...-ponto-turistico.js` | **1** (só o comentário do topo) |
| `cadastrado-avaliar-estabelecimento.css` × `...-ponto-turistico.css` | **2** (só os comentários) |
| `assinante-sugerir-estabelecimento.css` × `...-ponto-turistico.css` | 5 (comentários + 1 linha em branco) |

Os pares de JS e CSS são **byte a byte iguais** exceto pela linha de comentário. A diferença real
no HTML são as `<option>` do tipo de local (`sugerir-estabelecimento.html:59-61` × 
`sugerir-ponto-turistico.html:58`) e o texto do título.

**Correção.** Uma rota só, com o tipo como parâmetro — `/assinante/sugerir/{tipo}` — servindo o
mesmo template e a mesma dupla CSS/JS. Corrigir um bug hoje significa lembrar de corrigir em dois
lugares.

#### M7. Quatro implementações do mesmo botão Voltar, três delas com `href="javascript:"`

Quatro classes para o mesmo componente: `back-button` (21x), `btn-back` (14x),
`btn-back-admin` (2x), `btn-voltar` (1x). E três estratégias de navegação:

- **(a) link para rota fixa** — `admin-anuncios.html:24` `<a href="/admin/dashboard" class="back-button">`
- **(b) botão com histórico** — `perfil-usuario.html:26` `<button class="btn-back" onclick="window.history.back()">` (14 ocorrências)
- **(c) link com URL `javascript:`** — 7 ocorrências: `cadastrar-estabelecimento.html:21`,
  `contratar-resultado.html:26`, `editar-estabelecimento.html:21`,
  `estatisticas-anuncios.html:21`, `aumentar-catalogo.html:24`, `meus-roteiros.html:24`
  (`javascript:history.go(-1)`) e `roteiro.html:26` (`javascript:history.back()`).

**Impacto.** `href="javascript:..."` é bloqueado por qualquer CSP razoável, aparece na barra de
status ao passar o mouse e não funciona com clique do meio / "abrir em nova aba". Além disso,
quatro classes para um componente significam quatro blocos de CSS a manter.

**Correção.** Padronizar em uma classe (`btn-back`, a mais próxima do padrão do projeto) e uma
estratégia: `<a href="/rota-pai" class="btn-back" aria-label="Voltar">`. Rota fixa é preferível a
histórico — funciona quando o usuário chega por link direto.

### Baixo

#### B1. `event` global implícito em vez do parâmetro do evento

`static/js/pages/administrador-admin-avaliacoes.js:13`

```js
function filtrar(tipo) {
    const btns = document.querySelectorAll('.tab-btn');
    btns.forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
}
```

Chamado em `templates/administrador/admin-avaliacoes.html:60-61`.

**Impacto — corrigido.** `window.event` é suportado hoje em Chrome, Edge, Firefox 63+ e Safari,
então **isso funciona**. Não é um bug ativo. O problema é que é uma API legada, quebra se o
`onclick` inline virar `addEventListener`, e o parâmetro `tipo` recebido nunca é usado — a aba
troca de cor mas não filtra nada.

**Correção.** `function filtrar(tipo, botao) { ...; botao.classList.add('active'); }` e no HTML
`onclick="filtrar('denunciadas', this)"`. Ao ligar no banco, usar o `tipo` para de fato filtrar.

#### B2. Duas convenções de id para o mesmo campo estado/cidade

- `select-estado` / `select-cidade` (kebab) em `admin-editar-local.html:73,78`,
  `cadastrar-estabelecimento.html:51,57`, `editar-estabelecimento.html:51,57`
- `selectEstado` / `selectCidade` (camel) em `admin-cadastrar-local.html:71,82`

**Impacto.** A convenção dominante do projeto é camelCase (`modalConfirmacao`, `formEditar`,
`txtPreco`, `chkGratuito`). Os selects fogem dela em 3 arquivos — e para piorar, `main.js:3,5`
declara `const selectEstado = document.getElementById('select-estado')`, ou seja, a **variável**
camelCase aponta para o **id** kebab. Quem for ligar isso no backend vai tropeçar.

Consequência prática já visível: em `admin-cadastrar-local.html` os selects (ids camelCase) têm
4 estados e 3 cidades **chumbados no HTML**, enquanto as outras 3 páginas carregam a lista
completa do IBGE. Mesma funcionalidade, dois comportamentos.

**Correção.** Escolher `select-estado`/`select-cidade` nas 4 páginas (é o que `main.js` já espera)
e fazer `admin-cadastrar-local.html` usar o mesmo script de IBGE.

#### B3. Tabela sem `scope` e campos com `type` genérico

- **Tabela** — a única do projeto, `anunciante/estatisticas-anuncios.html:69-72`: 4 `<th>` sem
  `scope="col"`. Correção: `<th scope="col">Estabelecimento</th>`.
- **`type` genérico** — 6 casos onde há tipo específico:
  `assinar-plano.html:69` (CPF), `editar-perfil.html:57` (telefone),
  `cadastrar-estabelecimento.html:77` e `editar-estabelecimento.html:77` (`R$`),
  `admin-cadastrar-local.html:65` (`Valor (R$)`), `tornar-se-anunciante.html:50` (CNPJ).
  O projeto não usa `type="tel"`, `type="number"` nem `type="date"` em lugar nenhum.
  Correção: `type="tel"` para telefone, `type="number" step="0.01"` para valor; CPF/CNPJ podem
  ficar `text` com `inputmode="numeric"` e `pattern`.
- **Botão sem `type` dentro de form** — `assinar-plano.html:87` `<button class="btn-primary">`.
  É o único do projeto. Sem `type`, o default é `submit`; deixe explícito.

#### B4. Rota do login admin com nome gerado por desambiguação

`main.py:202-204`

```python
@app.get("/admin/login", response_class=FileResponse)
def get_login_2() -> FileResponse:
    return pagina("administrador/login-adm.html")
```

As outras 44 rotas têm nome descritivo. `get_login_2` colide de significado com `get_login`
(`main.py:36-38`, `/login`).

**Correção.** `def get_login_admin()`. Custo zero, e evita confusão quando o `url_for` de Jinja
começar a referenciar rotas pelo nome.

#### B5. Mapa de prontidão para Jinja: onde entra `{% for %}` e onde entra variável

Isto não é defeito — dado fixo em protótipo é esperado. É o roteiro da conversão.

**Viram `{% for %}`** (grade repetida à mão):

| arquivo | linhas | item | repetições |
| --- | --- | --- | --- |
| `publico/buscar-explorar.html` | 56, 65, 74, 83, 92, 101, 110, 119 | `div.card` com `<a>` + `<img>` + `span.favorito` + `h3` + `p` | 8 |
| `cadastrado/favoritos.html` | 52, 61, 70, 79, 88, 97, 106, 115 | mesmo bloco de `buscar-explorar`, com `♥` no lugar de `♡` | 8 |
| `publico/resultados-pesquisa.html` | 49, 58, 67, 76, 85, 94, 103, 112 | **variante diferente**: `<img>` solto, sem `<a>` envolvente | 8 |
| `publico/roteiros-predefinidos.html` | 44-90 | `roteiro-card` | 5 |
| `anunciante/area-anunciante.html` | 76-118 | `establishment-item` | 4 |
| `publico/home.html` | 151-193 | `destination-card` | 4 |
| `cadastrado/minhas-avaliacoes.html` | 63-128 | `review-card` | 3 |
| `administrador/usuarios.html` | 79-113 | `user-card` | 3 |

Atenção: os cards de `resultados-pesquisa.html` **não** são iguais aos de `buscar-explorar.html`
— ali o card não é clicável (não tem `<a>`) e a imagem não tem `alt`. Ao unificar num
`{% include %}`, use a versão com link.

**Viram variável de contexto**: os contadores de `administrador/dashboard-admin.html:43,51,59,67`
(`1.248` usuários, `357` locais, `892` avaliações, `41` anúncios) e os `value=` de formulário de
`cadastrado/editar-perfil.html:47-67` e `administrador/admin-editar-anuncio.html:47,52,57`. Os
gráficos são PNG estático (`static/img/dashboard-adm/Exemplo-grafico1.png` e `2.png`) — precisam
de uma biblioteca de charts ou de geração no servidor.

## Descartados na verificação

| Achado | Por que não procede |
| --- | --- |
| **`innerHTML` em 40 arquivos JS vira XSS armazenado** (crítico/segurança) | Não há ponto de injeção. Conferi as 70 ocorrências de `innerHTML`: 42 recebem o corpo de `/partials/header*`, que é arquivo estático servido pelo próprio backend; as demais são **literais de string** fixos (`administrador-admin-avaliacoes.js:24,28` e os `'<option value="">Carregando...</option>'`). As `<option>` vindas do IBGE são montadas com `createElement` + `textContent`, não por concatenação (`administrador-admin-editar-local.js:22-29`). E o projeto não lê nada do usuário: zero uso de `location.search`, `URLSearchParams` ou `document.cookie`. É hábito a corrigir quando houver banco, não vulnerabilidade hoje. |
| **75 acessos a `getElementById`/`querySelector` sem guarda de nulo** (alto/JS) | Verifiquei script por script contra o HTML de cada página: **zero** `getElementById` aponta para id inexistente. `openModal()` (`main.js:8`) só é chamado nas 5 páginas que têm `#modalConfirmacao` — e são exatamente as 5. `toggleCheckbox()` (`main.js:13`) só é chamado em `admin-editar-anuncio.html` e `contratar-resultado.html`, e ambas carregam um script que define `calcularTotal()`. `#header` existe nas 42 páginas. |
| **`selectEstado`/`selectCidade` valem `null` em 39 páginas** (parte do mesmo alarme) | Valem `null`, sim, mas `main.js` só as **declara** — nunca as usa. Quem usa são os 3 scripts de página (`administrador-admin-editar-local.js`, `anunciante-cadastrar-estabelecimento.js`, `anunciante-editar-estabelecimento.js`), e as 3 páginas correspondentes têm `id="select-estado"`. `main.js` é carregado antes do script de página em todas elas. Nada quebra. (A inconsistência de nome de id continua valendo — ver B2.) |
| **Dados pessoais expostos em `value=` de formulário** (médio) | "Mariana Silva", "Felipe Silva Guimarães", `felipe.silva@exemplo.com`, `123.456.789-00` são dados fictícios de wireframe, num protótipo sem banco. Isso é o esperado nesta etapa. O que vale como achado é a conversão para variável de contexto — está em B5. |
| **`<head>` aninhado em `home.html` quebra a página** (alto) | O defeito existe (`templates/publico/home.html:4-24`: dois `charset`, dois `viewport`, dois `<title>`, dois `<link>` de fonte idênticos e um `<head>` aberto na linha 20), mas o navegador **ignora** um `<head>` de abertura dentro de `<head>` — é erro de parsing tratado, não quebra o documento. Do mesmo jeito, o segundo `<title>` e o segundo `charset` são descartados. O único efeito real é o 404 de `style.css` na linha 19, já contabilizado em M1. Continua sendo lixo para limpar (é a única das 45 páginas assim), mas não é "alto". |
| **Três grades de 8 cards idênticas** (médio) | Duas são idênticas (`buscar-explorar.html` e `favoritos.html`); a terceira, `resultados-pesquisa.html`, tem estrutura diferente — sem `<a>` envolvente e sem `alt`. Tratá-las como um bloco só sem notar isso levaria a copiar a versão pior. Reclassificado como B5, com a diferença anotada. |
| **`<base href="../">` é herança inútil do protótipo** (médio) | O `<base>` é feio, mas está **fazendo trabalho**: é ele que faz as 29 URLs `../static/...` de 8 arquivos resolverem para `/static/...`. Removê-lo sozinho quebraria 21 imagens que hoje funcionam. O alarme também errou a escala (dizia 70 URLs em 12 páginas; são 29 em 8). Reescrito como M1, com a ordem de remoção segura e o efeito colateral que realmente importa: os 7 `href="#"` que navegam para a home. |

## Por onde começar

1. **Consertar o `url()` do fundo** (C1) — 42 substituições mecânicas de `../static/img/fundo.webp`
   por `/static/img/fundo.webp`. Faça junto com M2: mova `*{}` e `body{}` para `style.css` e apague
   os 42 blocos duplicados. Resolve os dois numa passada e o site volta a ter fundo.
2. **Dar `name` e `id` aos 99 campos** (C2 + A2) — é o pré-requisito de tudo que vem na próxima
   entrega. Cada campo ganha `name` em snake_case, `id` igual ao `name` e o `<label for>`
   correspondente. Comece pelos 5 formulários da rota pública (`login`, `cadastro`,
   `recuperar-senha`, `redefinir-senha`, `tornar-se-anunciante`).
3. **Declarar `method="post"` e `action` nos 17 formulários** (A1) e remover os `onsubmit` que
   fazem `preventDefault`. Com os passos 2 e 3 prontos, o `TemplateResponse` + `Form(...)` do
   FastAPI entra direto.
4. **Extrair `carregarHeader()` para `static/js/header.js`** (M4) e tirar os `<link>` de dentro dos
   3 partials (A8). Some ~400 linhas duplicadas, elimina as 3 variantes divergentes e acaba com a
   inversão de cascata. É também o ensaio do `{% include %}`.
5. **Limpar os caminhos e o `<base>`** (M1 + A6) — trocar as 29 URLs `../static/...` por
   `/static/...`, remover as 40 tags `<base>` e o `href="style.css"` de `home.html:19`, e resolver
   as 8 imagens que não existem no disco. Depois disso os `href="#"` param de levar para a home.

## Status da aplicação

Correções aplicadas em três ondas. A onda 1 tratou os defeitos críticos e altos de
funcionamento; a onda 2, o JavaScript e a padronização de nomes; a onda 3,
acessibilidade, CSS, HTML semântico, prontidão para Jinja e consistência.
Os itens marcados como "onda 1/2" foram lidos do estado do repositório e dos relatórios
da etapa anterior — não havia relatório nomeado por onda, então a atribuição vem do que
já estava aplicado quando a onda 3 começou.

| achado | onda | status | observação |
| --- | --- | --- | --- |
| C1 — `url()` do fundo quebrado em 39 folhas | 1/2 | aplicado | as 42 ocorrências passaram a `/static/img/fundo.webp` |
| C2 — 99 campos sem `name` | 1/2 | aplicado | `name` em snake_case em todos os campos de dado |
| A1 — 17 formulários sem `action`/`method` | 1/2 | aplicado (parcial) | todo `<form>` tem `method="post"` e `action`; os `onsubmit` com `preventDefault` continuam porque ainda não existe rota `POST` — remover junto com a criação delas |
| A2 — 83 campos sem rótulo | 3 | aplicado | 49 ligados ao `<label>` visível que já existia (`id` + `for`) e 34 com `aria-label`; zero campos sem nome acessível |
| A3 — 81 controles sem nome acessível | 3 | aplicado | 39 `title` viraram também `aria-label`, 32 controles só-de-ícone ganharam `aria-label` e os 16 links de card levam o nome do destino no `alt` |
| A4 — desfavoritar com ternário igual nos dois ramos | 1/2 | aplicado | `? '♥' : '♡'` |
| A5 — 23 `<img>` sem `alt` | 3 | aplicado | 19 descritivos e 4 decorativos com `alt=""` |
| A6 — 8 imagens ausentes no disco | — | não aplicado | exige adicionar arquivo binário ou trocar a foto do card; escolher outra imagem mudaria o conteúdo da tela (ex.: "Vitória - ES" apontando para foto de Ouro Preto). Fica para os autores |
| A7 — 33 elementos não interativos usados como controle | 3 | aplicado (parcial) | 24 corações e 1 gatilho de upload viraram `role="button"` + `tabindex="0"` + tecla Enter/Espaço; nos 8 `div.estab-item` o `<input type="checkbox">` interno já é focável e agora tem `aria-label`, então envolvê-los num `role="button"` criaria um controle dentro de outro |
| A8 — header injetado recarrega o CSS base e inverte a cascata | 3 | aplicado | os 3 `<link>` saíram dos partials e cada página declara o CSS do header no `<head>` |
| M1 — `<base href="../">` em 40 páginas | 3 | aplicado | 29 URLs `../static/...` viraram `/static/...`, as 40 tags `<base>` saíram e o `<head>` duplicado de `home.html` foi limpo |
| M2 — reset `*{}` e `body{}` repetidos em 42 folhas | 3 | aplicado (parcial) | o reset `*{}` foi para `style.css` e saiu de 33 folhas; o `body{}` **não** foi unificado porque não é idêntico: são 14 variantes distintas de fundo/cor entre as 42 folhas |
| M3 — tokens de cor definidos e ignorados | 3 | aplicado | `:root` movido para `style.css` com `--success`, `--sand` e `--warning`; 108 literais trocados por `var(--token)` de mesmo valor |
| M4 — bloco `fetch`+`innerHTML` copiado em 42 arquivos | 1/2 | aplicado | `carregarHeader()` em `static/js/header.js` |
| M5 — 14 páginas pulando nível de heading | 3 | aplicado | nível corrigido e tamanho travado no valor anterior (classe `.h3`/`.h4`/`.h5` do Bootstrap onde ele está carregado, `font-size` explícito onde não está). Zero saltos restantes |
| M6 — páginas duplicadas `sugerir-*` e `avaliar-*` | — | não aplicado | unificar exige rota com parâmetro e apagar template/CSS/JS dos alunos; é decisão de arquitetura, não correção de defeito |
| M7 — quatro implementações do botão Voltar | 3 | aplicado (parcial) | os 7 `href="javascript:..."` viraram rota real; as 4 classes (`back-button`, `btn-back`, `btn-back-admin`, `btn-voltar`) **não** foram unificadas porque cada uma tem CSS próprio e juntá-las mudaria o visual |
| B1 — `event` global implícito | 1/2 | aplicado | `filtrar('denunciadas', this)` |
| B2 — duas convenções de id para estado/cidade | 3 | aplicado (parcial) | `admin-cadastrar-local.html` passou a usar `select-estado`/`select-cidade`, igual às outras 3 páginas e ao `main.js`; a lista chumbada de estados **não** foi trocada pela do IBGE porque mudaria o conteúdo do select |
| B3 — `<th>` sem `scope`, `type` genérico, botão sem `type` | 3 | aplicado | 4 `<th scope="col">`; `type`/`inputmode` dos 6 campos e o `type="submit"` de `assinar-plano` já vinham da onda 1/2 |
| B4 — rota `get_login_2` | 3 | aplicado | agora `get_login_admin` |
| B5 — mapa de prontidão para Jinja | 3 | aplicado | 8 comentários `<!-- repeticao: ... candidato a {% for %} -->` nos blocos repetidos e 3 comentários nos pontos que viram variável de contexto. Nenhuma lista foi transformada em laço — isso é exercício do aluno |
