// JS exclusivo de templates/anunciante/cadastrar-estabelecimento.html

// 1. Carrega o Header
carregarHeader('/partials/header-cadastrado');

// 2. Busca Estados da API do IBGE
document.addEventListener('DOMContentLoaded', () => {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
        .then(response => response.json())
        .then(estados => {
            estados.sort((a, b) => a.nome.localeCompare(b.nome));

            selectEstado.innerHTML = '<option value="">Selecione o Estado</option>';
            estados.forEach(estado => {
                const option = document.createElement('option');
                option.value = estado.sigla;
                option.textContent = `${estado.nome} (${estado.sigla})`;
                selectEstado.appendChild(option);
            });
        })
        .catch(err => {
            console.error("Erro ao buscar estados:", err);
            selectEstado.innerHTML = '<option value="">Erro ao carregar estados</option>';
        });
});

// 3. Monitora mudança no Estado e atualiza Cidades
selectEstado.addEventListener('change', function() {
    const sgUF = this.value;

    if (!sgUF) {
        selectCidade.innerHTML = '<option value="">Selecione um estado antes</option>';
        selectCidade.disabled = true;
        return;
    }

    selectCidade.innerHTML = '<option value="">Carregando cidades...</option>';
    selectCidade.disabled = false;

    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${sgUF}/municipios`)
        .then(response => response.json())
        .then(cidades => {
            cidades.sort((a, b) => a.nome.localeCompare(b.nome));

            selectCidade.innerHTML = '<option value="">Selecione a Cidade</option>';
            cidades.forEach(cidade => {
                const option = document.createElement('option');
                option.value = cidade.nome;
                option.textContent = cidade.nome;
                selectCidade.appendChild(option);
            });
        })
        .catch(err => {
            console.error("Erro ao buscar cidades:", err);
            selectCidade.innerHTML = '<option value="">Erro ao carregar cidades</option>';
        });
});

function closeModal() {
    document.getElementById('modalConfirmacao').classList.remove('active');
    document.getElementById('formEstabelecimento').reset();
    selectCidade.innerHTML = '<option value="">Selecione um estado antes</option>';
    selectCidade.disabled = true;
}
