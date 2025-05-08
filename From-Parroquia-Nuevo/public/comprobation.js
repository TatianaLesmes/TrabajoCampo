document.addEventListener('DOMContentLoaded', function() {
    const tokenSession = localStorage.getItem('tokenSession');
    if (!tokenSession) {
        window.location.href = '/'; // Redirige si no hay token
        return;
    }

    // Usa la URL correcta para tu entorno local
    fetch('http://localhost:3000/accessRole/user', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenSession}`
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Respuesta de red no fue ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.message !== "Acceso permitido a la ruta Usuario") {
            throw new Error('Rol no autorizado');
        }
        // Si llegamos aquí, el usuario tiene el rol correcto
        window.location.href = '/user';
        console.log('Acceso permitido');

    })
    .catch(error => {
        console.error('Error de autenticación:', error);
        window.location.href = '/'; // Redirige en caso de error o rol incorrecto
    });
});