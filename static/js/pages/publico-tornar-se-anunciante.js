// JS exclusivo de templates/publico/tornar-se-anunciante.html

// INTERCEPTADOR DE ENVIO DO FORMULÁRIO COM FEEDBACK DE MENSAGEM FLUTUANTE
document.getElementById('advertiserForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o recarregamento real da página

    const toast = document.getElementById('successToast');
    toast.classList.add('show'); // Exibe a mensagem flutuante elegante na tela

    // Limpa os campos do formulário para simular a conclusão do fluxo
    this.reset();

    // Esconde a notificação de sucesso após 4 segundos
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
});

// Injeção dinâmica do menu superior unificado
carregarHeader('/partials/header');
