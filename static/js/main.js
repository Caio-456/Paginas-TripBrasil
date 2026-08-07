// TripBrasil - scripts compartilhados entre paginas

const selectEstado = document.getElementById('select-estado');

const selectCidade = document.getElementById('select-cidade');

// Funções do Modal
function openModal() {
    document.getElementById('modalConfirmacao').classList.add('active');
}

// 2. Função para facilitar o clique na linha inteira do estabelecimento
function toggleCheckbox(id) {
    const checkbox = document.getElementById(id);
    checkbox.checked = !checkbox.checked;
    calcularTotal();
}
