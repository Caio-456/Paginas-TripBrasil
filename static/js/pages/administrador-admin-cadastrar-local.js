// JS exclusivo de templates/administrador/admin-cadastrar-local.html

// Controla exibição do campo de preço baseado no checkbox gratuito
function togglePriceInput(checkbox) {
    const priceInput = document.getElementById('txtPreco');
    if (checkbox.checked) {
        priceInput.style.display = 'none';
        priceInput.removeAttribute('required');
    } else {
        priceInput.style.display = 'block';
        priceInput.setAttribute('required', 'true');
    }
}

// Simulação do gatilho de upload de mídia
function triggerUploadAlert() {
    alert("Disparar seletor de arquivos do sistema operacional para carregar nova foto.");
}

// Remove miniatura com parada de propagação para não ativar clique no slot pai
function removeThumb(event, button) {
    event.stopPropagation();
    if(confirm("Remover esta imagem?")) {
        const slot = button.closest('.thumb-upload-slot');
        slot.style.opacity = "0.3";
        button.remove();
    }
}

// Submissão do formulário
function handleSubmit(event) {
    event.preventDefault();
    alert("Local cadastrado com sucesso no banco de dados da plataforma!");
    window.location.href = "/admin/locais";
}

// Injeção dinâmica do menu superior
carregarHeader('/partials/header-admin');

// O gatilho de upload e um <div role="button">: Enter e Espaco reaproveitam
// o mesmo handler de clique que ja existe no atributo onclick.
document.addEventListener('DOMContentLoaded', () => {

    document.querySelectorAll('.main-upload-trigger').forEach(alvo => {

        alvo.addEventListener('keydown', evento => {

            if (evento.key === 'Enter' || evento.key === ' ') {
                evento.preventDefault();
                alvo.click();
            }

        });

    });

});
