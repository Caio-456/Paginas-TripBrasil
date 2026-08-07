// JS exclusivo de templates/administrador/login-adm.html

function togglePasswordVisibility() {
    const passwordField = document.getElementById('password');
    const passIcon = document.getElementById('passIcon');

    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        passIcon.classList.remove('fa-eye');
        passIcon.classList.add('fa-eye-slash');
    } else {
        passwordField.type = 'password';
        passIcon.classList.remove('fa-eye-slash');
        passIcon.classList.add('fa-eye');
    }
}

// Função corrigida para forçar o redirecionamento na mesma pasta raiz
function handleLogin(event) {
    event.preventDefault();
    window.location.href = '/admin/dashboard';
}

// Carregamento assíncrono do header original do seu projeto
carregarHeader('/partials/header-admin');
