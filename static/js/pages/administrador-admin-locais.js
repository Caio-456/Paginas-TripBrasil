// JS exclusivo de templates/administrador/admin-locais.html

// Função para remover local simulada
function deleteLocal(btn) {
    if (confirm("Deseja realmente excluir permanentemente este local da plataforma?")) {
        const card = btn.closest('.local-card');
        card.style.transition = "all 0.3s ease";
        card.style.opacity = "0";
        card.style.transform = "scale(0.9)";
        setTimeout(() => card.remove(), 300);
    }
}

// Injeção dinâmica do menu superior
carregarHeader('/partials/header-admin');
