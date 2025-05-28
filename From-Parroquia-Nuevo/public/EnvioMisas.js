document.addEventListener('DOMContentLoaded', function () {
    const mainContent = document.getElementById('Principal');
    const inicioLink = document.getElementById('inicioLink');
    const envioMisasLink = document.getElementById('AceptarMisas');
    const mobileEnvioMisasLink = document.getElementById('MobileAceptarMisas');

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
                <h5 class="text-center mb-3">Misas Pendientes</h5>
                <table class="table table-striped table-bordered" id ="tablaPendientes">
                    <thead>
                        <tr>
                            <th scope="col">Nombre</th>
                            <th scope="col">Apellido</th>
            
                            <th scope="col">Fecha</th>
                            <th scope="col">Hora</th>
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
                                <h5 class="modal-title" id="exampleModalLabel">Misas confirmadas </h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <!-- Título de la tabla en el modal -->
                               
                                <div class="table-responsive">
                                    <table class="table" id ="tablaEnviadas" >
                                        <thead>
                                            <tr>
                                                <th scope="col">Nombre</th>
                                                <th scope="col">Apellido</th>
                                                <th scope="col">Fecha</th>
                                                <th scope="col">Hora</th>
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
            cargarMisaPendientes();
            // Añadir un event listener para cargar las partidas enviadas cuando se abra el modal
            document.getElementById('exampleModal').addEventListener('show.bs.modal', cargarMisaEnviadas);
        }, 0);
    }

    if (envioMisasLink) {
        envioMisasLink.addEventListener('click', handleEnvioPartidaClick);
    }

    if (mobileEnvioMisasLink) {
        mobileEnvioMisasLink.addEventListener('click', handleEnvioPartidaClick);
    }

    // ... (resto del código existente)

    const token = localStorage.getItem('tokenSession');

    // ... (cualquier otra funcionalidad que necesites)
});


function cargarMisaPendientes() {
    fetch('http://localhost:3000/requestMass/earring', {
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
                <td>${formatDateForDisplay(partida.date)}</td>
                <td>${partida.time}</td>
                <td>${partida.status}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="enviarMisa('${partida._id}')">
                        Confirmar
                    </button>
                </td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="EliminarMisa('${partida._id}')">
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

function cargarMisaEnviadas() {
    fetch('http://localhost:3000/requestMass/confirmed', {
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
                <td>${formatDateForDisplay(partida.date)}</td>
                <td>${partida.time}</td>
                <td>${partida.status}</td>
                
               
            `;
                tbody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error al cargar las partidas enviadas:', error);
        });
}
function formatDateForDisplay(isoString) {
    const options = { 
        timeZone: 'UTC', 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
    };
    return new Date(isoString).toLocaleDateString('es-ES', options);
}
function enviarMisa(partidaId) {
    console.log('Intentando enviar partida con ID:', partidaId);
    fetch(`http://localhost:3000/requestMass/confirm/${partidaId}`, {
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
                    throw new Error(err.message || `Error al enviar la Misa. Estado: ${response.status}`);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Misa enviada exitosamente:', data);
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'La Misa Es aceptada correctamente',
            }).then(() => {
                cargarMisaPendientes();
                cargarMisaEnviadas();
            });
        })
        .catch(error => {
            console.error('Error detallado al enviar la Misa:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Ocurrió un error al enviar la Misa',
            });
        });
}


function EliminarMisa(partidaId) {
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
            console.log('Intentando eliminar Misa con ID:', partidaId);
            fetch(`http://localhost:3000/requestMass/${partidaId}`, {
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
                        throw new Error(err.message || `Error al eliminar la Misa. Estado: ${response.status}`);
                    });
                }
                return response.json();
            }).then(data => {
                console.log('Misa eliminada exitosamente:', data);
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: data.message || 'La solicitud de misa fue eliminada correctamente',
                }).then(() => {
                    cargarMisaPendientes();
                    cargarMisaEnviadas();
                });
            }).catch(error => {
                console.error('Error detallado al eliminar la partida:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.message || 'Ocurrió un error al eliminar la Misa',
                });
            });
      }
   });
}
