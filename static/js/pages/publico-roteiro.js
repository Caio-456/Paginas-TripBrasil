// JS exclusivo de templates/publico/roteiro.html

// Lógica existente do cabeçalho
carregarHeader('/partials/header');

// NOVA LÓGICA: Mensagem de Favorito
const btnSalvar = document.querySelector('.btn-salvar');

const toast = document.getElementById('toastFavorito');

btnSalvar.addEventListener('click', function() {
    // Mostra a notificação adicionando a classe .show
    toast.classList.add('show');

    // Altera o texto do botão para dar um feedback visual imediato
    btnSalvar.innerText = "Salvo!";
    btnSalvar.style.background = "white";
    btnSalvar.style.color = "black";

    // Esconde a notificação automaticamente após 3 segundos (3000ms)
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
});
