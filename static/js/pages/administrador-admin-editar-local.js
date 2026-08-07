// JS exclusivo de templates/administrador/admin-editar-local.html

// Estado: Espírito Santo (ES), Cidade: Marataízes conforme o seu wireframe
const DADOS_INICIAIS = {
    uf: "ES",
    cidade: "Marataízes"
};

// Carrega o Header
carregarHeader('/partials/header-admin');

// Carrega Estados do IBGE
document.addEventListener('DOMContentLoaded', () => {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
        .then(response => response.json())
        .then(estados => {
            estados.sort((a, b) => a.nome.localeCompare(b.nome));
            selectEstado.innerHTML = '<option value="">Selecione o Estado</option>';

            estados.forEach(estado => {
                const option = document.createElement('option');
                option.value = estado.sigla;
                option.textContent = estado.nome;
                if(estado.sigla === DADOS_INICIAIS.uf) option.selected = true;
                selectEstado.appendChild(option);
            });

            if(DADOS_INICIAIS.uf) carregarCidades(DADOS_INICIAIS.uf, DADOS_INICIAIS.cidade);
        });
});

selectEstado.addEventListener('change', function() {
    carregarCidades(this.value);
});

function carregarCidades(sgUF, cidadePreSelecionada = null) {
    if (!sgUF) {
        selectCidade.innerHTML = '<option value="">Selecione o estado antes</option>';
        selectCidade.disabled = true;
        return;
    }

    selectCidade.innerHTML = '<option value="">Carregando...</option>';
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
