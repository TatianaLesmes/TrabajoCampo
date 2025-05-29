 document.addEventListener("DOMContentLoaded", function () {
        const collapseContent = document.getElementById('collapseContent');
        const bloqueSalmo = document.getElementById('bloqueSalmo'); // Asegúrate de que tu bloque tenga este ID
        const textoSalmo = document.getElementById("textoSalmo");
        const referenciaSalmo = document.getElementById("referenciaSalmo");

        // Mostrar/ocultar salmo según estado del colapsable
        if (collapseContent && bloqueSalmo) {
            collapseContent.addEventListener('show.bs.collapse', () => {
                bloqueSalmo.classList.add('d-none');
            });

            collapseContent.addEventListener('hide.bs.collapse', () => {
                bloqueSalmo.classList.remove('d-none');
            });
        }

        // Obtener el Salmo del Día
        fetch('http://localhost:3000/api/salmo', { cache: 'no-store' })
            .then(response => response.json())
            .then(data => {
                if (textoSalmo) {
                    textoSalmo.textContent = data.texto ? `"${data.texto.trim()}"` : "No se encontró el salmo.";
                }

                if (referenciaSalmo && data.referencia) {
                    referenciaSalmo.textContent = data.referencia;
                }
            })
            .catch(error => {
                console.error("Error al obtener el salmo:", error);
            });
    });

function nextSlide() {
    const carousel = new bootstrap.Carousel(document.getElementById('registerCarousel'));
    const activeItem = document.querySelector('.carousel-item.active');
    const isSecondStep = activeItem.querySelector('#verificationCode') !== null;

    if (!isSecondStep) {
        carousel.next();

    }
    // Si es el segundo paso, no avanzamos automáticamente. La función verifyCode() se encargará de avanzar si la verificación es exitosa.
}

function nextSlide() {
    const carousel = new bootstrap.Carousel(document.getElementById('registerCarousel'));
    carousel.next();

}

function previousSlide() {
    const carousel = new bootstrap.Carousel(document.getElementById('registerCarousel'));
    carousel.prev();
}

function previousSlideResetPassword() {
    const carousel = new bootstrap.Carousel(document.getElementById('rememberPasswordCarousel'));
    carousel.prev();
}

document.getElementById('verifyEmailBtn').addEventListener('click', async function () {
    const email = document.getElementById('email').value;
    const messageDiv = document.getElementById('emailVerificationMessage');

    // Validación del correo electrónico
    if (!email) {
        messageDiv.innerHTML = '<div class="alert alert-danger">Por favor, ingrese un correo electrónico.</div>';
        return;
    }

    // Validación simple de formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        messageDiv.innerHTML = '<div class="alert alert-danger">Por favor, ingrese un correo electrónico válido.</div>';
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/auth/verify-Email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ mail: email }),
        });

        const data = await response.json();

        if (response.ok) {
            messageDiv.innerHTML = '<div class="alert alert-success">Código de verificación enviado. Por favor, revise su correo.</div>';
            nextSlide(); // Avanza al siguiente paso
        } else {
            // Manejo de errores específicos del servidor
            switch (data.error) {
                case 'EMAIL_EXISTS':
                    messageDiv.innerHTML = '<div class="alert alert-danger">Este correo electrónico ya está registrado.</div>';
                    break;
                case 'INVALID_EMAIL':
                    messageDiv.innerHTML = '<div class="alert alert-danger">El correo electrónico ingresado no es válido.</div>';
                    break;
                default:
                    messageDiv.innerHTML = `<div class="alert alert-danger">${data.error || 'Ocurrió un error. Por favor, intente de nuevo.'}</div>`;
            }
        }
    } catch (error) {
        messageDiv.innerHTML = '<div class="alert alert-danger">Error de conexión. Por favor, intente de nuevo más tarde.</div>';
    }
});

// Opcional: Deshabilitar la navegación del carrusel mediante gestos o teclado
document.getElementById('registerCarousel').addEventListener('slide.bs.carousel', function (e) {
    if (e.from === e.to) {
        e.preventDefault();
    }
});


function verifyCode() {
    const email = document.getElementById('email').value; // Asumiendo que guardamos el email del paso anterior
    const verificationCode = document.getElementById('verificationCode').value;
    const messageDiv = document.getElementById('emailVerificationMessage');

    if (!verificationCode) {
        messageDiv.innerHTML = '<div class="alert alert-danger">Por favor, ingrese el código de verificación.</div>';
        return;
    }

    fetch('http://localhost:3000/auth/verify-Code', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mail: email, verificationCode: verificationCode }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                messageDiv.innerHTML = `<div class="alert alert-success">${data.message}</div>`;
                nextSlide(); // Avanza al siguiente paso si la verificación es exitosa
            } else {
                messageDiv.innerHTML = `<div class="alert alert-danger">${data.error}</div>`;
            }
        })
        .catch(error => {
            messageDiv.innerHTML = '<div class="alert alert-danger">Ocurrió un error. Por favor, intente de nuevo.</div>';
            console.error('Error:', error);
        });
}






function registerUser() {
    const name = document.getElementById('name').value;
    const lastName = document.getElementById('lastName').value;
    const birthdate = document.getElementById('birthdate').value;
    const documentNumber = document.getElementById('docNumber').value;
    const typeDocument = document.getElementById('docType').value;
    const email = document.getElementById('email').value; // Asumiendo que guardamos el email del primer paso
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('registerMessage');

    // Validación básica
    if (!name || !lastName || !birthdate || !documentNumber || !typeDocument || !email || !password) {
        messageDiv.innerHTML = '<div class="alert alert-danger">Por favor, complete todos los campos.</div>';
        return;
    }

    const userData = {
        name,
        lastName,
        birthdate,
        documentNumber,
        typeDocument,
        mail: email,
        password,
        role: "Usuario"
    };

    fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData),
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.error);
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.data) {
                messageDiv.innerHTML = '<div class="alert alert-success">Usuario registrado exitosamente.</div>';
                window.location.href = '/'; // Redireccionar a la vista 'index.html';
            }
        })
        .catch(error => {
                messageDiv.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
                console.error('Error:', error.message);
});


}

// Asegúrate de que el botón "Crear cuenta" en el tercer paso llame a esta función
// <button type="button" class="btn btn-primary" onclick="registerUser()">Crear cuenta</button>


const getAllDocumentData = async () => {
    try {
        const response = await fetch('http://localhost:3000/documentType/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            console.error('Error fetching documents:', response.statusText);
            throw new Error('Error fetching documents');
        }

        const data = await response.json();
        console.log('Fetched Data:', data); // Log the fetched data
        return data.data; // Asumiendo que data.data contiene la lista de documentos
    } catch (error) {
        console.error("Error fetching documents:", error);
        return [];
    }
};


// Función para obtener y mostrar el Salmo del día
document.addEventListener("DOMContentLoaded", function() {
    fetch('http://localhost:3000/api/salmo')
        .then(response => response.json())
        .then(data => {
            const textoSalmo = document.getElementById("textoSalmo");
            if (textoSalmo) {
                textoSalmo.textContent = data.salmo || "No se encontró el salmo.";
            }
        })
        .catch(error => {
            console.error("Error al obtener el salmo:", error);
        });
});


getAllDocumentData().then(documentData => {
    console.log('Document Data:', documentData); // Imprimir los datos devueltos
});