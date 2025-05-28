document.addEventListener('DOMContentLoaded', function () {
    const mainContent = document.getElementById('Principal');
    const inicioLink = document.getElementById('inicioLink');
    const envioPartidaLink = document.getElementById('EnvioPartida');
    const mobileEnvioPartidaLink = document.getElementById('MobileEnvioPartida');

    function handleEnvioPartidaClick(e) {
        e.preventDefault();
        const partidasPendientesHtml = `
        <div class="container mt-4" style="overflow-y: auto; overflow-x;" >
            <div>
                <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    Abrir Modal
                </button>
            </div>
            <div class="table-responsive mt-4" >
                <h5 class="text-center mb-3">Partidas Pendientes</h5>
                <table class="table table-striped table-bordered" id ="tablaPendientes">
                    <thead>
                        <tr>
                            <th scope="col">Nombre</th>
                            <th scope="col">Apellido</th>
                            <th scope="col">Tipo de partida</th>
                            <th scope="col">Fecha</th>
                            <th scope="col">Estado</th>
                            <th scope="col">Enviar</th>
                            <th scope="col">Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Aquí puedes añadir las filas de la tabla -->
                    </tbody>
                </table>
            </div>
        </div>
        
        <!-- Modal -->
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
           <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Partidas enviadas</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <!-- Título de la tabla en el modal -->
                                <h5 class="mb-3">Partidas enviadas al correo electrónico</h5>
                                <div class="table-responsive">
                                    <table class="table" id ="tablaEnviadas" >
                                        <thead>
                                            <tr>
                                                <th scope="col">Nombre</th>
                                                <th scope="col">Apellido</th>
                                                <th scope="col">Tipo de partida</th>
                                                <th scope="col">Fecha</th>
                                                <th scope="col">Estado</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <!-- Aquí puedes añadir las filas de la tabla -->
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                            </div>
                        </div>
                    </div>
        </div>
        `;

        mainContent.innerHTML = partidasPendientesHtml;
        setTimeout(() => {
            cargarPartidasPendientes();
            // Añadir un event listener para cargar las partidas enviadas cuando se abra el modal
            document.getElementById('exampleModal').addEventListener('show.bs.modal', cargarPartidasEnviadas);
        }, 0);
    }

    if (envioPartidaLink) {
        envioPartidaLink.addEventListener('click', handleEnvioPartidaClick);
    }

    if (mobileEnvioPartidaLink) {
        mobileEnvioPartidaLink.addEventListener('click', handleEnvioPartidaClick);
    }

    // ... (resto del código existente)

    const token = localStorage.getItem('tokenSession');

    // ... (cualquier otra funcionalidad que necesites)
});


function cargarPartidasPendientes() {
    fetch('http://localhost:3000/requestDeparture/earring', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('tokenSession')}`
        },
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.message || 'Error al cargar las partidas pendientes');
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Partidas pendientes cargadas:', data);
            const tbody = document.querySelector('#tablaPendientes tbody');
            tbody.innerHTML = ''; // Limpia cualquier contenido previo

            data.forEach(partida => {
                const row = document.createElement('tr');
                row.innerHTML = `
                <td>${partida.applicant.name}</td>
                <td>${partida.applicant.lastName}</td>
                <td>${partida.departureType}</td>
                <td>${partida.requestDate}</td>
                <td>${partida.status}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="enviarPartida('${partida._id}')">
                        Enviar
                    </button>
                </td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="EliminarPartida('${partida._id}')">
                        Eliminar
                    </button>
                </td>
            `;
                tbody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error al cargar las partidas pendientes:', error);

        });
}

function cargarPartidasEnviadas() {
    fetch('http://localhost:3000/requestDeparture/sent', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('tokenSession')}`
        },
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.message || 'Error al cargar las partidas enviadas');
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Partidas enviadas cargadas:', data);
            const tbody = document.querySelector('#tablaEnviadas tbody');
            tbody.innerHTML = ''; // Limpia cualquier contenido previo

            data.forEach(partida => {
                const row = document.createElement('tr');
                row.innerHTML = `
                <td>${partida.applicant.name}</td>
                <td>${partida.applicant.lastName}</td>
                <td>${partida.departureType}</td>
                <td>${new Date(partida.requestDate).toLocaleDateString()}</td>
                <td>${partida.status}</td>
            `;
                tbody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error al cargar las partidas enviadas:', error);
        });
}


function enviarPartida(partidaId) {
    console.log('Intentando enviar partida con ID:', partidaId);
    fetch(`http://localhost:3000/requestDeparture/send/${partidaId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('tokenSession')}`
        },
    })
        .then(response => {
            console.log('Respuesta recibida:', response);
            if (!response.ok) {
                return response.json().then(err => {
                    console.error('Error en la respuesta:', err);
                    throw new Error(err.message || `Error al enviar la partida. Estado: ${response.status}`);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Partida enviada exitosamente:', data);
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'La partida fue enviada correctamente',
            }).then(() => {
                cargarPartidasPendientes();
                cargarPartidasEnviadas();
            });
        })
        .catch(error => {
            console.error('Error detallado al enviar la partida:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Ocurrió un error al enviar la partida',
            });
        });
}
function EliminarPartida(partidaId) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esta acción!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {   
            if (result.isConfirmed) {
                // Si el usuario confirma, proceder con la eliminación
                console.log('Intentando eliminar partida con ID:', partidaId);
                fetch(`http://localhost:3000/requestDeparture/${partidaId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('tokenSession')}`
                    },
                
            }).then(response => {
                console.log('Respuesta recibida:', response);
                if (!response.ok) {
                    return response.json().then(err => {
                        console.error('Error en la respuesta:', err);
                        throw new Error(err.message || `Error al eliminar la partida. Estado: ${response.status}`);
                    });
                }
                return response.json();
            }).then(data => {
                console.log('Partida eliminada exitosamente:', data);
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: data.message || 'La partida fue eliminada correctamente',
                }).then(() => {
                    cargarPartidasPendientes();
                    cargarPartidasEnviadas();
                });
            }).catch(error => {
            console.error('Error detallado al eliminar la partida:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Ocurrió un error al eliminar la partida',
            });
        });
    }
    });
}