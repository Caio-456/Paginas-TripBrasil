# Blocos compartilhados

Levantamento automatico das secoes que aparecem **identicas** em mais de uma
pagina. Sao os candidatos naturais a `{% include %}`.

No HTML cada um esta entre `<!-- INICIO bloco compartilhado ... -->` e
`<!-- FIM bloco compartilhado ... -->`.

- grupos identicos: **0**
- ocorrencias cobertas: **0**

| tag | paginas | tamanho | exemplo |
| --- | ---: | ---: | --- |

## Como usar

1. Escolha o bloco que aparece em mais paginas.
2. Recorte o conteudo para `templates/_<nome>.html`.
3. Troque cada ocorrencia por `{% include "_<nome>.html" %}`.
4. Se o bloco tiver estado ativo de menu (`class="... active"`), passe a pagina
   atual como variavel e resolva com `{% if %}` dentro do include.
