// JS exclusivo de templates/anunciante/contratar-resultado.html

// 1. Carrega o Header
carregarHeader('/partials/header');

// Impede que o clique direto no checkbox duplique o evento gerado pela div pai
document.querySelectorAll('.estab-check').forEach(checkbox => {
    checkbox.addEventListener('click', (e) => {
        e.stopPropagation();
    });
});

// 3. Cálculo Dinâmico do Valor Total
function calcularTotal() {
    const checkboxes = document.querySelectorAll('.estab-check');
    let total = 0;

    checkboxes.forEach(box => {
        if (box.checked) {
            total += parseFloat(box.value);
        }
    });

    document.getElementById('totalDisplay').textContent = `Valor: R$ ${total.toFixed(2).replace('.', ',')}`;
}

function closeModal() {
    document.getElementById('modalConfirmacao').classList.remove('active');
    document.getElementById('formContratar').reset();
    calcularTotal();
}
