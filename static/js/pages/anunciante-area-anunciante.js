// JS exclusivo de templates/anunciante/area-anunciante.html

// CONFIGURAÇÃO DO GRÁFICO DE BARRAS CUSTOMIZADO
const ctx = document.getElementById('viewsChart').getContext('2d');

new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['1', '2', '3', '4'],
        datasets: [{
            label: 'Visualizações',
            data: [5, 10, 2, 8],
            backgroundColor: 'rgba(174, 212, 241, 0.7)', // Azul claro pastel translúcido
            borderColor: 'rgba(174, 212, 241, 1)',
            borderWidth: 1,
            borderRadius: 8,
            borderSkipped: false,
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false } // Oculta a legenda para ficar minimalista
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: 'rgba(255, 255, 255, 0.6)', fontFamily: 'Outfit' }
            },
            y: {
                beginAtZero: true,
                max: 10,
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                ticks: { color: 'rgba(255, 255, 255, 0.6)', stepSize: 2, fontFamily: 'Outfit' }
            }
        }
    }
});

// Injeção dinâmica do menu superior unificado
carregarHeader('/partials/header-cadastrado');
