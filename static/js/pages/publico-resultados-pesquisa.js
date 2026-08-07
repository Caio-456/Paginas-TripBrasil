// JS exclusivo de templates/publico/resultados-pesquisa.html

carregarHeader('/partials/header');

document.addEventListener('DOMContentLoaded', () => {

    document.querySelectorAll('.favorito').forEach(coracao => {

        // o coracao e um <span role="button">: mouse e teclado usam o mesmo caminho
        const alternar = () => {

            coracao.classList.toggle('ativo');

            const ativo = coracao.classList.contains('ativo');

            coracao.textContent = ativo ? '♥' : '♡';

            coracao.setAttribute('aria-pressed', ativo ? 'true' : 'false');

        };

        coracao.addEventListener('click', alternar);

        coracao.addEventListener('keydown', evento => {

            if (evento.key === 'Enter' || evento.key === ' ') {
                evento.preventDefault();
                alternar();
            }

        });

    });

});
