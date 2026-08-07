// JS exclusivo de templates/publico/cadastro.html

function salvarAlteracoes(event) {
    event.preventDefault(); // Evita o reload da página

    const toast = document.getElementById('toastMessage');

    // Adiciona a classe para subir e mostrar o elemento
    toast.classList.add('show');

    // Remove o elemento após 3 segundos (3000ms)
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

carregarHeader('/partials/header');
