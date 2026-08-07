// JS exclusivo de templates/administrador/admin-editar-anuncio.html

// 1. Carrega o Header
carregarHeader('/partials/header-admin');

document.querySelectorAll('.estab-check').forEach(checkbox => {
    checkbox.addEventListener('click', (e) => {
        e.stopPropagation();
    });
});

// 3. Recalcula o valor baseado nos locais marcados
function calcularTotal() {
    const checkboxes = document.querySelectorAll('.estab-check');
    let total = 0;

    checkboxes.forEach(box => {
        if (box.checked) {
            total += parseFloat(box.value);
        }
    });

    document.getElementById('totalDisplay').textContent = `Novo Valor: R$ ${total.toFixed(2).replace('.', ',')}`;
}

// Inicializa o valor com base nos itens pré-marcados na renderização inicial
document.addEventListener('DOMContentLoaded', calcularTotal);

function closeModal() {
    document.getElementById('modalConfirmacao').classList.remove('active');
}
