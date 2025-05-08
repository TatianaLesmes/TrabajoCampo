const getUserRole = async (email) => {
    try {
        const token = localStorage.getItem('tokenSession');
        if (!token) {
            throw new Error('No se encontró el token en localStorage');
        }

        const response = await fetch('http://localhost:3000/user/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error al obtener los usuarios: ${response.statusText}`);
        }

        const users = await response.json();
        const user = users.find(u => u.mail === email);

        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        return user.role;
    } catch (error) {
        console.error("Error al obtener el rol del usuario:", error.message);
        throw error;
    }
};

document.getElementById('VerificacionDeLogin').addEventListener('click', function () {
    const email = document.getElementById('CorreoelectronicLogin').value;
    const password = document.getElementById('passwordLogin').value;

    console.log('Intentando login con:', { mail: email, password: password });

    fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mail: email, password: password }),
    })
        .then(response => {
            if (!response.ok) {
                // Aquí manejamos diferentes códigos de estado HTTP
                if (response.status === 404) {
                    throw new Error('Usuario no encontrado');
                } else if (response.status === 401) {
                    throw new Error('Contraseña incorrecta');
                } else {
                    return response.json().then(err => {
                        throw new Error(err.message || 'Error desconocido en la autenticación');
                    });
                }
            }
            return response.json();
        })
        .then(data => {
            console.log('Respuesta completa:', data);
            if (data.tokenSession) {
                console.log('Login exitoso:', data);
                localStorage.setItem('tokenSession', data.tokenSession);
                return { role: data.data.role, data: data };
            } else {
                throw new Error('Token de sesión no recibido');
            }
        })
        .then(({ role, data }) => {
            console.log('Rol de usuario:', role);

            switch (role) {
                case "Usuario":
                    console.log('Intentando redirigir a /User');
                    window.location.href = '/User';
                    break;
                case "Admin":
                    console.log('Intentando redirigir a /Admin');
                    window.location.href = '/Admin';
                    break;
                case "SuperAdmin":
                    console.log('Intentando redirigir a /SuperAdmin');
                    window.location.href = '/SuperAdmin';
                    break;
                default:
                    console.error('Rol no reconocido:', role);
            }
        })
        .catch(error => {
            console.error('Error en la autenticación:', error);
            // Usar SweetAlert2 para mostrar mensajes de error más amigables
            Swal.fire({
                icon: 'error',
                title: 'Error de autenticación',
                text: error.message || 'Ocurrió un error durante el inicio de sesión',
            });
        });
});



//recordar contraseña verificar codigo
function forgotPassword() {
    const emailInput = document.getElementById('CorreoelectronicRemember');
    const email = emailInput.value.trim();
    const messageDiv = document.getElementById('emailverificationRememberpassword');

    // Limpiar mensajes anteriores
    messageDiv.innerHTML = '';

    // Validación de campo vacío
    if (!email) {
        messageDiv.innerHTML = '<div class="alert alert-danger">Por favor, ingrese su correo electrónico.</div>';
        return;
    }

    // Validación básica de formato de correo
    if (!email.includes('@')) {
        messageDiv.innerHTML = '<div class="alert alert-danger">Por favor, ingrese un correo electrónico válido.</div>';
        return;
    }

    fetch('http://localhost:3000/auth/forgot-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mail: email }),
    })
        .then(response => {
            if (response.ok) {
                nextSlideRemember();
            } else if (response.status === 404) {
                messageDiv.innerHTML = '<div class="alert alert-danger">El correo electrónico no está registrado.</div>';
            } else {
                throw new Error(response.statusText);
            }
        })
        .catch(error => {
            messageDiv.innerHTML = '<div class="alert alert-danger">Error al enviar el código. Por favor, intente de nuevo.</div>';
            console.error('Error:', error);
        });
}

function verifyCodeRememberpassword() {
    const email = document.getElementById('CorreoelectronicRemember').value;
    const resetCode = document.getElementById('verificationCodeRememberpassword').value;
    const messageDiv = document.getElementById('codeVerificationMessage');

    if (!resetCode) {
        messageDiv.innerHTML = '<div class="alert alert-danger">Por favor, ingrese el código de verificación.</div>';
        return;
    }

    fetch('http://localhost:3000/auth/verify-ResetCode', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mail: email, resetCode: resetCode }),
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw err; });
            }
            return response.json();
        })
        .then(data => {
            if (data.message === 'Código válido') {
                messageDiv.innerHTML = '<div class="alert alert-success">Código verificado correctamente.</div>';
                // Guardamos el email para usarlo en el reseteo de contraseña
                localStorage.setItem('resetEmail', email);
                nextSlideRemember(); // Avanzar al slide de cambio de contraseña
            } else {
                messageDiv.innerHTML = '<div class="alert alert-danger">Código inválido o expirado.</div>';
            }
        })
        .catch(error => {
            messageDiv.innerHTML = `<div class="alert alert-danger">${error.message || 'Ocurrió un error. Por favor, intente de nuevo.'}</div>`;
            console.error('Error:', error);
        });
}

function resetPassword() {
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const messageDiv = document.getElementById('passwordResetMessage');
    const email = localStorage.getItem('resetEmail');

    console.log('Iniciando resetPassword');

    // Limpiar el mensaje de error anterior
    messageDiv.innerHTML = '';

    if (newPassword !== confirmPassword) {
        messageDiv.innerHTML = '<div class="alert alert-danger">Las contraseñas no coinciden.</div>';
        return;
    }

    console.log('Enviando solicitud al servidor');

    fetch('http://localhost:3000/auth/change-Password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mail: email, newPassword: newPassword }),
    })
        .then(response => {
            console.log('Respuesta del servidor recibida:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('Datos recibidos:', data);
            if (data.message.includes('exitosamente') || data.message.includes('successfully')) {
                $('#RememberPassword').modal('hide');
                console.log('Contraseña cambiada exitosamente');
                Swal.fire({
                    title: 'Contraseña restablecida',
                    text: 'Su contraseña ha sido restablecida con éxito. Por favor, inicie sesión con su nueva contraseña.',
                    icon: 'success',
                    confirmButtonText: 'Iniciar sesión',
                    backdrop: false,
                    customClass: {
                        confirmButton: 'btn btn-primary'
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Redirigir a la ruta deseada
                        $('#loginModal').modal('show');
                    }
                });
            } else {
                console.log('Error en el cambio de contraseña:', data.message);
                messageDiv.innerHTML = `<div class="alert alert-danger">${data.message || 'Error al cambiar la contraseña.'}</div>`;
                Swal.fire({
                    title: 'Error al cambiar la contraseña',
                    text: data.message || 'Error al cambiar la contraseña.',
                    icon: 'error',
                    confirmButtonText: 'Reintentar',

                });
            }
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
            messageDiv.innerHTML = '<div class="alert alert-danger">Ocurrió un error. Por favor, intente de nuevo.</div>';
            alert('Ocurrió un error. Por favor, intente de nuevo.');
        });
}




function nextSlideRemember() {
    const carousel = new bootstrap.Carousel(document.getElementById('rememberPasswordCarousel'));
    carousel.next();
}

// Event listeners
document.getElementById('rememberPassword').addEventListener('click', forgotPassword);
