// JS exclusivo de templates/cadastrado/editar-perfil.html

// SCRIPT PARA INTERCEPTAR O ENVIO E MOSTRAR A MENSAGEM
document.getElementById('editProfileForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita o recarregamento real da página

    const toast = document.getElementById('successToast');
    toast.classList.add('show'); // Mostra a mensagem na tela

    // Esconde a mensagem automaticamente após 4 segundos
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
});

// Injeção dinâmica do menu
carregarHeader('/partials/header-cadastrado');
