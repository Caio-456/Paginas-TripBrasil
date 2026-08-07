// JS exclusivo de templates/anunciante/editar-estabelecimento.html

// Dados para simular o "Carregar do Banco"
const DADOS_SALVOS = {
    uf: "MG",
    cidade: "Araxá"
};

// 1. Carrega o Header
carregarHeader('/partials/header-cadastrado');

// 2. Busca Estados e pré-seleciona
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
                if(estado.sigla === DADOS_SALVOS.uf) option.selected = true;
                selectEstado.appendChild(option);
            });

            // Se já tem estado, carrega cidades
            if(DADOS_SALVOS.uf) carregarCidades(DADOS_SALVOS.uf, DADOS_SALVOS.cidade);
        });
});

// 3. Monitora mudança no Estado
selectEstado.addEventListener('change', function() {
    carregarCidades(this.value);
});

function carregarCidades(sgUF, cidadePreSelecionada = null) {
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
                if(cidadePreSelecionada && cidade.nome === cidadePreSelecionada) option.selected = true;
                selectCidade.appendChild(option);
            });
        });
}

function closeModal() {
    document.getElementById('modalConfirmacao').classList.remove('active');
}
