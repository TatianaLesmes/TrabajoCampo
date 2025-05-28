document.addEventListener('DOMContentLoaded', function () {
    const mainContent = document.getElementById('Principal');
    const Gestionmisas = document.getElementById('SolicitudDeMisas');
    const MobileGestionmisas = document.getElementById('MobileMisa');

    const contenidoInicial = mainContent.innerHTML;

    function handleUserMisasClick(e) {
        e.preventDefault();
        const UserMisasHTML = `
        <style>
        #calendario {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 5px;
        }
        .dia {
            border: 1px solid #dee2e6;
            padding: 10px;
            text-align: center;
            cursor: pointer;
        }
        .dia:hover {
            background-color: #f8f9fa;
        }
        .dia.disabled {
            color: #ccc;
            cursor: not-allowed;
        }
        .dia.available {
            background-color: #cce5ff;
        }
        .encabezado {
            grid-column: 1 / -1;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        .nombre-dia {
            font-weight: bold;
            background-color: #f8f9fa;
        }
        .horario-checkbox {
            margin-bottom: 10px;
        }
        .leyenda {
            display: flex;
            justify-content: center;
            margin-top: 20px;
        }
        .leyenda-item {
            display: flex;
            align-items: center;
            margin-right: 20px;
        }
        .leyenda-color {
            width: 20px;
            height: 20px;
            margin-right: 5px;
        }
    </style>
        
    <div class="container mt-3" style="overflow-y: auto; overflow-x;">
        <div class="row">
            <div>
                <button class="btn btn-primary" id="btnPreciosMisas">
                    Precios
                </button>
            </div>
            <div class="container mt-5">
                <h1 class="text-center mb-4">Calendario de Misas</h1>
                <div id="calendario" class="mb-4"></div>
                <div class="leyenda">
                    <div class="leyenda-item">
                        <div class="leyenda-color" style="background-color: #cce5ff;"></div>
                        <span>Misas disponibles</span>
                    </div>
                    <div class="leyenda-item">
                        <div class="leyenda-color" style="background-color: #fff; border: 1px solid #dee2e6;"></div>
                        <span>Sin misas disponibles</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal para mostrar horarios -->
    <div class="modal fade" id="horariosModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Horarios disponibles</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="horariosModalBody">
                    <!-- Los horarios se insertarán aquí -->
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary" id="confirmarSeleccion">Confirmar selección</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal para la intención -->
    <div class="modal fade" id="intencionModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Intención de la Misa</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="misaForm">
                        <div class="mb-3">
                            <label for="fecha" class="form-label">Fecha</label>
                            <input type="date" class="form-control" id="fecha" readonly>
                        </div>
                        <div class="mb-3">
                            <label for="hora" class="form-label">Hora</label>
                            <input type="text" class="form-control" id="hora" readonly>
                        </div>
                        <div class="mb-3">
                            <label for="intencion" class="form-label">Intención</label>
                            <textarea class="form-control" id="intencion" rows="3" required></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary" id="enviarSolicitud">Enviar Solicitud</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal para precios -->
    <div class="modal fade" id="preciosModal" tabindex="-1" aria-labelledby="preciosModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="preciosModalLabel">Precios de Misas</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="table-responsive">
                        <table class="table table-bordered">
                            <thead class="table-primary">
                                <tr>
                                    <th>Tipo de Misa</th>
                                    <th>Precio</th>
                                    <th>Descripción</th>
                                    <th>Métodos de Pago</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Misa Regular</td>
                                    <td>$20.000</td>
                                    <td>Misa común con intención general</td>
                                    <td>Efectivo o Transferencia</td>
                                </tr>
                                <tr>
                                    <td>Misa Especial</td>
                                    <td>$50.000</td>
                                    <td>Misa con intención específica y recordatorio</td>
                                    <td>Efectivo o Transferencia</td>
                                </tr>
                                <tr>
                                    <td>Misa de Aniversario</td>
                                    <td>$80.000</td>
                                    <td>Misa conmemorativa con mención especial</td>
                                    <td>Efectivo o Transferencia</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="mt-4">
                        <h6>Instrucciones para el pago:</h6>
                        <ol>
                            <li>Realice el pago por cualquiera de los métodos indicados</li>
                            <li>Envíe el comprobante al WhatsApp de la parroquia</li>
                            <li>Espere la confirmación de su solicitud</li>
                        </ol>
                    </div>
                    <div class="text-center mt-3">
                        <img src="/img/QR.png" class="img-fluid" style="max-width: 200px;" alt="Código QR para pago">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>
        `;
        mainContent.innerHTML = UserMisasHTML;
        
        // Configurar el botón de precios
        document.getElementById('btnPreciosMisas').addEventListener('click', function(e) {
            e.preventDefault();
            const preciosModal = new bootstrap.Modal(document.getElementById('preciosModal'));
            preciosModal.show();
        });
        
        SolicitarMisa();
    }

    if (Gestionmisas) {
        Gestionmisas.addEventListener('click', handleUserMisasClick);
    }
    if (MobileGestionmisas) {
        MobileGestionmisas.addEventListener('click', handleUserMisasClick);
    }
});

// Resto del código de SolicitarMisa() permanece igual...
function SolicitarMisa() {
    const calendarioEl = document.getElementById('calendario');
    let mesActual = new Date().getMonth();
    let añoActual = new Date().getFullYear();

    function generarCalendario(año, mes) {
        calendarioEl.innerHTML = '';
            const primerDia = new Date(año, mes, 1);
            const ultimoDia = new Date(año, mes + 1, 0);
            const diasEnMes = ultimoDia.getDate();

            const encabezado = document.createElement('div');
            encabezado.classList.add('encabezado');
            encabezado.innerHTML = `
                <button id="mesAnterior" class="btn btn-outline-primary" ${mes === new Date().getMonth() && año === new Date().getFullYear() ? 'disabled' : ''}>&lt;</button>
                <h2 class="mb-0">${new Date(año, mes).toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                <button id="mesSiguiente" class="btn btn-outline-primary">&gt;</button>
            `;
            calendarioEl.appendChild(encabezado);

            const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
            diasSemana.forEach(dia => {
                const diaEl = document.createElement('div');
                diaEl.classList.add('dia', 'nombre-dia');
                diaEl.textContent = dia;
                calendarioEl.appendChild(diaEl);
            });

            for (let i = 0; i < primerDia.getDay(); i++) {
                const diaEl = document.createElement('div');
                diaEl.classList.add('dia');
                calendarioEl.appendChild(diaEl);
            }

            const hoy = new Date();
            for (let i = 1; i <= diasEnMes; i++) {
                const diaEl = document.createElement('div');
                diaEl.classList.add('dia');
                diaEl.textContent = i;
                const fechaDia = new Date(año, mes, i);
                if (fechaDia < hoy) {
                    diaEl.classList.add('disabled');
                } else {
                    diaEl.addEventListener('click', () => mostrarHorarios(año, mes, i));
                    verificarDisponibilidad(año, mes, i, diaEl);
                }
                calendarioEl.appendChild(diaEl);
            }

            document.getElementById('mesAnterior').addEventListener('click', () => cambiarMes(-1));
            document.getElementById('mesSiguiente').addEventListener('click', () => cambiarMes(1));
    }

    function verificarDisponibilidad(año, mes, dia, diaEl) {
        const fecha = `${año}-${(mes + 1).toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
        fetch(`http://localhost:3000/massSchedule/time-slots?date=${fecha}`)
            .then(response => response.json())
            .then(data => {
                if (data.timeSlots && data.timeSlots.some(slot => slot.available)) {
                    diaEl.classList.add('available');
                } else {
                    diaEl.classList.remove('available');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                diaEl.classList.remove('available');
            });
    }

    function cambiarMes(delta) {
        mesActual += delta;
        if (mesActual > 11) {
            mesActual = 0;
            añoActual++;
        } else if (mesActual < 0) {
            mesActual = 11;
            añoActual--;
        }
        generarCalendario(añoActual, mesActual);
    }

    function mostrarHorarios(año, mes, dia) {
        const fecha = `${año}-${(mes + 1).toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
        console.log('Fecha seleccionada por el usuario (formato YYYY-MM-DD):', fecha);
            
            fetch(`http://localhost:3000/massSchedule/time-slots?date=${fecha}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('No se encontraron horarios');
                    }
                    return response.json();
                })
                .then(data => {
                    const horariosModalBody = document.getElementById('horariosModalBody');
                    horariosModalBody.innerHTML = '';
                    
                    if (data.timeSlots && data.timeSlots.length > 0) {
                        data.timeSlots.forEach(slot => {
                            if (slot.available) {
                                const horarioEl = document.createElement('div');
                                horarioEl.classList.add('horario-checkbox');
                                horarioEl.innerHTML = `
                                    <input type="radio" id="${slot.time}" name="horario" value="${slot.time}">
                                    <label for="${slot.time}">${slot.time}</label>
                                `;
                                horariosModalBody.appendChild(horarioEl);
                            }
                        });
                    } else {
                        horariosModalBody.textContent = 'No hay misas disponibles para este día.';
                    }
                    
                    const modal = new bootstrap.Modal(document.getElementById('horariosModal'));
                    modal.show();

                    // Guardar la fecha seleccionada
                    document.getElementById('fecha').value = fecha;
                })
                .catch(error => {
                    console.error('Error al obtener horarios:', error);
                    const horariosModalBody = document.getElementById('horariosModalBody');
                    horariosModalBody.textContent = 'No hay misas disponibles para este día.';
                    const modal = new bootstrap.Modal(document.getElementById('horariosModal'));
                    modal.show();
                });
    }

    // Inicializar el calendario
    generarCalendario(añoActual, mesActual);

    // Configurar los event listeners
    document.getElementById('confirmarSeleccion').addEventListener('click', function() {
        const horarioSeleccionado = document.querySelector('input[name="horario"]:checked');
        if (horarioSeleccionado) {
            document.getElementById('hora').value = horarioSeleccionado.value;
            bootstrap.Modal.getInstance(document.getElementById('horariosModal')).hide();
            const intencionModal = new bootstrap.Modal(document.getElementById('intencionModal'));
            intencionModal.show();
        } else {
            alert('Por favor, selecciona un horario.');
        }
    });

    document.getElementById('enviarSolicitud').addEventListener('click', function() {
        const fecha = document.getElementById('fecha').value;
        const hora = document.getElementById('hora').value;
        const intencion = document.getElementById('intencion').value;
        console.log('Fecha seleccionada por el usuario (formato YYYY-MM-DD):', fecha);
        if (!intencion) {
            alert('Por favor, ingresa la intención de la misa.');
            return;
        }

        fetch('http://localhost:3000/requestMass', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('tokenSession')}`
            },
            body: JSON.stringify({
                date: fecha,
                time: hora,
                intention: intencion
            }),
        })
        .then(response => response.json())
        .then(data => {
            Swal.fire({
                title: 'Éxito',
                html: 'Solicitud de misa enviada correctamente<br>Para aprobar esta solicitud debe comunicarse al siguiente whatsApp y hacer el pago respectivo.',
                icon: 'success',
                confirmButtonText: 'Ok',
                imageUrl: '/img/QR.png', // Reemplaza con la URL de tu imagen
                imageWidth: 100,  // Ajusta el tamaño según sea necesario
                imageHeight: 100, // Ajusta el tamaño según sea necesario
                imageAlt: 'Imagen de éxito'
            });
            document.getElementById('misaForm').reset();
            bootstrap.Modal.getInstance(document.getElementById('intencionModal')).hide();
            generarCalendario(añoActual, mesActual);
        })
        .catch((error) => {
            console.error('Error:', error);
            Swal.fire({
                title: 'Error',
                text: 'Error al enviar la solicitud de misa',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        });
    });
}