// JS exclusivo de templates/administrador/admin-ver-sugestoes.html

function deleteSugestao(btn) {
    if (confirm("Deseja rejeitar e remover esta sugestão permanentemente?")) {
        const card = btn.closest('.sugestao-card');
        card.style.transition = "all 0.3s ease";
        card.style.opacity = "0";
        card.style.transform = "scale(0.95)";
        setTimeout(() => card.remove(), 300);
    }
}

carregarHeader('/partials/header-admin');
