document.addEventListener('DOMContentLoaded', function () {
    const mainContent = document.getElementById('Principal');
    const SolicitudPartidas = document.getElementById('SolicitudDePartidas');
    const MobileSolicitudpartidas = document.getElementById('MobileAdminLink');
    const inicioLink = document.getElementById('inicioLink');
    const MobileinicioLink = document.getElementById('MobileinicioLink');

    const contenidoInicial = `
        <div class="container px-5 my-5 text-center">
            <img src="/img/parroquiaSantaMaria.png" class="img-fluid" alt="">
        </div>
    `;

    function handleGestionMisasClick(e) {
        e.preventDefault();
        const SolicitudPartidashtml = `
        <div class="container px-4 py-5">
            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
                <div class="col">
                    <div class="card h-100 justify-content-center align-items-center">
                        <div style="height: 50%; width: 50%" class="d-flex">
                            <img src="/img/bautismo.jpeg" class="card-img-top img-fluid h-100" alt="...">
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">Bautismo</h5>
                            <p class="card-text">Se entregan partidas de bautismo desde 2015 a 2024</p>
                            <a href="#" class="btn btn-primary" id="SolicitudDePartidaBautismo">Solicitar</a>
                            <a href="#" class="btn btn-primary" id="ValorDePartidaBautismo">Precio</a>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card h-100 justify-content-center align-items-center">
                        <div style="height: 50%; width: 50%" class="d-flex">
                            <img src="/img/vela.jpeg" class="card-img-top img-fluid arreglo-tamaño h-100" alt="...">
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">Confirmación</h5>
                            <p class="card-text">Se entregan partidas de Confirmación desde 2015 a 2024</p>
                            <a href="#" class="btn btn-primary" id="SolicitudDePartidaConfirmacion">Solicitar</a>
                            <a href="#" class="btn btn-primary" id="ValorDePartidaConfirmacion">Precio</a>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card h-100 justify-content-center align-items-center">
                        <div style="height: 50%; width: 50%" class="d-flex">
                            <img src="/img/casados.jpeg" class="card-img-top img-fluid h-100" alt="...">
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">Matrimonio</h5>
                            <p class="card-text">Se entregan partidas de Matrimonio desde 2015 a 2024</p>
                            <a href="#" class="btn btn-primary" id="SolicitudDePartidaMatrimonio">Solicitar</a>
                            <a href="#" class="btn btn-primary" id="ValorDePartidaMatrimonio">Precio</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal para precios -->
        <div class="modal fade" id="preciosModal" tabindex="-1" aria-labelledby="preciosModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="preciosModalLabel">Información de Precios</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" id="modalPreciosContent">
                        <!-- Contenido dinámico se insertará aquí -->
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
        `;

        mainContent.innerHTML = SolicitudPartidashtml;

        // Agregar event listeners para los botones de solicitud
        document.getElementById('SolicitudDePartidaBautismo')?.addEventListener('click', () => solicitarPartida('Bautismo'));
        document.getElementById('SolicitudDePartidaConfirmacion')?.addEventListener('click', () => solicitarPartida('Confirmación'));
        document.getElementById('SolicitudDePartidaMatrimonio')?.addEventListener('click', () => solicitarPartida('Matrimonio'));

        // Agregar event listeners para los botones de precio
        setupPreciosButtons();
    }

    function setupPreciosButtons() {
        const preciosData = {
            'Bautismo': {
                precio: '$30.000',
                descripcion: 'Partida de Bautismo válida para trámites legales y eclesiásticos.',
                metodoPago: 'Puede pagar en efectivo en la parroquia o por transferencia bancaria comunicandose al whatsapp.'
            },
            'Confirmacion': {
                precio: '$60.000',
                descripcion: 'Partida de Confirmación que acredita el sacramento recibido.',
                metodoPago: 'Puede pagar en efectivo en la parroquia o por transferencia bancaria comunicandose al whatsapp.'
            },
            'Matrimonio': {
                precio: '$120.000',
                descripcion: 'Partida de Matrimonio con validez legal y eclesiástica.',
                metodoPago: 'Puede pagar en efectivo en la parroquia o por transferencia bancaria comunicandose al whatsapp.'
            }
        };

        ['Bautismo', 'Confirmacion', 'Matrimonio'].forEach(tipo => {
            const button = document.getElementById(`ValorDePartida${tipo}`);
            if (button) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    showPreciosModal(tipo, preciosData[tipo]);
                });
            }
        });
    }

    function showPreciosModal(tipo, data) {
        const modalTitle = document.getElementById('preciosModalLabel');
        const modalContent = document.getElementById('modalPreciosContent');
        
        // Configurar el título del modal
        modalTitle.textContent = `Precio Partida de ${tipo}`;
        
        // Configurar el contenido del modal
        modalContent.innerHTML = `
            <div class="mb-3">
                <h6>Precio:</h6>
                <p class="fs-4 text-primary">${data.precio}</p>
            </div>
            <div class="mb-3">
                <h6>Descripción:</h6>
                <p>${data.descripcion}</p>
            </div>
            <div class="mb-3">
                <h6>Métodos de pago:</h6>
                <p>${data.metodoPago}</p>
            </div>
            <div class="text-center mt-4">
                <img src="/img/QR.png" class="img-fluid" style="max-width: 200px;" alt="Código QR para pago">
            </div>
        `;
        
        // Mostrar el modal
        const modal = new bootstrap.Modal(document.getElementById('preciosModal'));
        modal.show();
    }

    function handleInicioClick(e) {
        e.preventDefault();
        mainContent.innerHTML = contenidoInicial;
    }

    const token = localStorage.getItem('tokenSession');

    async function solicitarPartida(departureType) {
        try {
            const response = await fetch('http://localhost:3000/requestDeparture/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ departureType })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al solicitar la partida');
            }

            const data = await response.json();
            Swal.fire({
                title: 'Éxito',
                text: `Solicitud de partida de ${departureType} enviada correctamente. Para que la partida sea enviada debe pagar (parroquia, transacción) y enviar el comprobante de pago al siguiente WhatsApp.`,
                icon: 'success',
                confirmButtonText: 'Ok',
                imageUrl: '/img/QR.png',
                imageWidth: 100,
                imageHeight: 100,
                imageAlt: 'Imagen de éxito'
            });
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        }
    }

    // Asignar el event listener para los botones de solicitud de partida
    if (SolicitudPartidas) {
        SolicitudPartidas.addEventListener('click', handleGestionMisasClick);
    }

    if (MobileSolicitudpartidas) {
        MobileSolicitudpartidas.addEventListener('click', handleGestionMisasClick);
    }

    // Asignar el event listener para los botones de inicio
    if (inicioLink) {
        inicioLink.addEventListener('click', handleInicioClick);
    }
    if (MobileinicioLink) {
        MobileinicioLink.addEventListener('click', handleInicioClick);
    }
});