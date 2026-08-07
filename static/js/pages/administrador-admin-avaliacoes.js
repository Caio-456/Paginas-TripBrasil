// JS exclusivo de templates/administrador/admin-avaliacoes.html

// Carrega o Header unificado do TripBrasil
carregarHeader('/partials/header-admin');

// Mudança visual básica de Abas
// O botao clicado chega pelo parametro; `tipo` fica reservado para o filtro
// real quando a tela consultar o banco.
function filtrar(tipo, botao) {
    const btns = document.querySelectorAll('.tab-btn');
    btns.forEach(b => b.classList.remove('active'));
    botao.classList.add('active');
}

// Lógica visual de moderação imediata
function moderarAction(idCard, acao) {
    const card = document.getElementById(idCard);
    const icon = document.getElementById('modalIcon');
    const title = document.getElementById('modalTitle');
    const desc = document.getElementById('modalDesc');

    if (acao === 'aprovada') {
        icon.innerHTML = '<i class="fa-solid fa-circle-check" style="color: #63b880;"></i>';
        title.textContent = "Avaliação Mantida!";
        desc.textContent = "A denúncia foi rejeitada e o comentário continuará visível para todos.";
    } else {
        icon.innerHTML = '<i class="fa-solid fa-trash-can" style="color: #eb5e5e;"></i>';
        title.textContent = "Avaliação Removida!";
        desc.textContent = "O comentário foi excluído do sistema permanentemente.";
    }

    // Remove o item da lista visualmente
    card.style.opacity = '0';
    setTimeout(() => { card.remove(); }, 300);

    // Abre o modal de aviso
    document.getElementById('modalMod').classList.add('active');
}

function closeModal() {
    document.getElementById('modalMod').classList.remove('active');
}
