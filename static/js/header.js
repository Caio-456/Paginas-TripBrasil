// TripBrasil - carregamento do cabecalho compartilhado.
// Implementacao unica do bloco fetch + innerHTML que antes estava copiado
// em cada script de pagina. Vira {% include %} quando o projeto migrar
// para Jinja e este arquivo deixa de ser necessario.

function carregarHeader(rota, alvo = '#header') {
    return fetch(rota)
        .then(response => {
            if (!response.ok)
                throw new Error('Erro ao carregar cabecalho: ' + response.status);
            return response.text();
        })
        .then(html => {
            document.querySelector(alvo).innerHTML = html;
        })
        .catch(err => console.error(err));
}
