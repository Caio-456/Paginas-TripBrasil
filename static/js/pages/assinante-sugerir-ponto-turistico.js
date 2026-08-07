// JS exclusivo de templates/assinante/sugerir-ponto-turistico.html

// INTERCEPTADOR DE ENVIO DO FORMULÁRIO COM TOAST POPUP
document.getElementById('suggestionForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o reload real da página

    const toast = document.getElementById('successToast');
    toast.classList.add('show'); // Ativa a mensagem flutuante

    // Reseta o formulário após o envio simulado
    this.reset();

    // Oculta a notificação após 4 segundos
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
});

// Injeção dinâmica do menu superior unificado
carregarHeader('/partials/header-cadastrado');
