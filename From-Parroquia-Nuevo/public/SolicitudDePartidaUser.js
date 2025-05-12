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
                <div class="col ">
                    <div class="card h-100 justify-content-center align-items-center">
                        <div style="height: 50%;  width: 50%" class="d-flex ">
                        
                            <img src="/img/bautismo.jpeg" class="card-img-top img-fluid  h-100" alt="...">
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">Bautismo</h5>
                            <p class="card-text">Se entregan partidas de bautismo desde 2015 a 2024</p>
                            <a href="#" class="btn btn-primary" id="SolicitudDePartidaBautismo">Solicitar</a>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card h-100 justify-content-center align-items-center">
                        <div style="height: 50%;  width: 50%" class="d-flex ">
                            <img src="/img/vela.jpeg" class="card-img-top img-fluid arreglo-tamaño h-100" alt="...">
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">Confirmación</h5>
                            <p class="card-text">Se entregan partidas de Confirmación desde 2015 a 2024</p>
                            <a href="#" class="btn btn-primary" id="SolicitudDePartidaConfirmacion">Solicitar</a>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card h-100 justify-content-center align-items-center">
                        <div style="height: 50%;  width: 50%" class="d-flex ">
                            <img src="/img/casados.jpeg" class="card-img-top img-fluid  h-100" alt="...">
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">Matrimonio</h5>
                            <p class="card-text">Se entregan partidas de Matrimonio desde 2015 a 2024</p>
                            <a href="#" class="btn btn-primary" id="SolicitudDePartidaMatrimonio">Solicitar</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;

        mainContent.innerHTML = SolicitudPartidashtml;

        // Agregar event listeners para los botones de solicitud
        document.getElementById('SolicitudDePartidaBautismo').addEventListener('click', () => solicitarPartida('Baptism'));
        document.getElementById('SolicitudDePartidaConfirmacion').addEventListener('click', () => solicitarPartida('Confirmation'));
        document.getElementById('SolicitudDePartidaMatrimonio').addEventListener('click', () => solicitarPartida('Marriage'));
    }

    function handleInicioClick(e) {
        e.preventDefault();
        mainContent.innerHTML = contenidoInicial;
    }

    const token = localStorage.getItem('tokenSession');
    console.log(token);

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
                text: `Solicitud de partida de ${departureType} enviada correctamente`,
                text:"Para que la partida sea enviada debe pagar (parroquia, transacción) y enviar el vaucher de pago al siguiente whatsApp",
                icon: 'success',
                confirmButtonText: 'Ok',
                imageUrl: '/img/QR.png', // Reemplaza con la URL de tu imagen
                imageWidth: 100,  // Ajusta el tamaño según sea necesario
                imageHeight: 100, // Ajusta el tamaño según sea necesario
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
