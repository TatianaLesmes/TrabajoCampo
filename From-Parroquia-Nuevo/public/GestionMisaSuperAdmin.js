document.addEventListener('DOMContentLoaded', function () {
    const mainContent = document.getElementById('Principal');
    const Gestionmisas = document.getElementById('Gestionmisas');
    const MobileGestionmisas = document.getElementById('MobileGestionmisas');

    const contenidoInicial = mainContent.innerHTML;

    function handleGestionMisasClick(e) {
        e.preventDefault();
        const gestionMisasHTML = `
        <style>
        .time-slot {
            width: 100px;
            height: 50px;
            margin: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
        }
        .time-slot.selected {
            background-color: #007bff;
            color: white;
        }
        .time-slot.unavailable {
            background-color: #dc3545;
            color: white;
        }
    </style>
        
            <div class="container mt-3" style="overflow-y: auto; overflow-x;>
  <div class="row">
    <div class="col-lg-8 col-md-10 col-sm-12 mx-auto">
      <h1 class="mb-4">Programación de Misas</h1>

      <!-- Sección para agregar misas -->
      <div class="mb-3">
        <label for="datePicker" class="form-label">Seleccione la fecha:</label>
        <input type="date" class="form-control" id="datePicker">
      </div>
      <button id="confirmDate" class="btn btn-primary mb-3">Confirmar Fecha</button>

      <div id="timeSlots" class="d-none">
        <h2>Seleccione los horarios:</h2>
        <div id="timeSlotsContainer" class="d-flex flex-wrap"></div>
        <button id="saveMass" class="btn btn-success mt-3">Guardar Horarios</button>
      </div>

      <!-- Sección para eliminar misas -->
      <div id="deleteSection" class="mt-5">
        <h2>Eliminar Horarios</h2>
        <div class="mb-3">
          <label for="deleteDatePicker" class="form-label">Seleccione la fecha:</label>
          <input type="date" class="form-control" id="deleteDatePicker">
        </div>
        <button id="loadTimeSlotsToDelete" class="btn btn-primary mb-3">Cargar Horarios</button>
        <div id="timeSlotsToDelete" class="d-flex flex-wrap"></div>
        <button id="deleteSelectedSlots" class="btn btn-danger mt-3 d-none">Eliminar Seleccionados</button>
      </div>
    </div>
  </div>
</div>

        
        `;
        mainContent.innerHTML = gestionMisasHTML;
        initializeMassManagement();
    }

    if (Gestionmisas) {
        Gestionmisas.addEventListener('click', handleGestionMisasClick);
    }
    if (MobileGestionmisas) {
        MobileGestionmisas.addEventListener('click', handleGestionMisasClick);
    }
});

function initializeMassManagement() {
    const datePicker = document.getElementById('datePicker');
    const confirmDateBtn = document.getElementById('confirmDate');
    const timeSlots = document.getElementById('timeSlots');
    const timeSlotsContainer = document.getElementById('timeSlotsContainer');
    const saveMassBtn = document.getElementById('saveMass');
    const deleteDatePicker = document.getElementById('deleteDatePicker');
    const loadTimeSlotsToDeleteBtn = document.getElementById('loadTimeSlotsToDelete');
    const timeSlotsToDelete = document.getElementById('timeSlotsToDelete');
    const deleteSelectedSlotsBtn = document.getElementById('deleteSelectedSlots');

    // Establecer la fecha mínima como hoy
    const today = new Date().toISOString().split('T')[0];
    datePicker.min = today;
    deleteDatePicker.min = today;

    confirmDateBtn.addEventListener('click', function () {
        if (datePicker.value) {
            timeSlots.classList.remove('d-none');
            generateTimeSlots();
        } else {
            alert('Por favor, seleccione una fecha.');
        }
    });

    function generateTimeSlots() {
        timeSlotsContainer.innerHTML = '';
        for (let hour = 8; hour <= 18; hour++) {
            const timeSlot = document.createElement('div');
            timeSlot.className = 'time-slot btn btn-outline-primary';
            timeSlot.textContent = `${hour}:00`;
            timeSlot.addEventListener('click', function () {
                this.classList.toggle('selected');
            });
            timeSlotsContainer.appendChild(timeSlot);
        }
    }

    saveMassBtn.addEventListener('click', function () {
        const selectedDate = datePicker.value;
        const selectedSlots = Array.from(document.querySelectorAll('#timeSlotsContainer .time-slot.selected'))
            .map(slot => slot.textContent);

        if (selectedSlots.length === 0) {
            alert('Por favor, seleccione al menos un horario.');
            return;
        }

        const massData = {
            date: selectedDate,
            timeSlots: selectedSlots.map(time => ({ time, available: true }))
        };

        fetch('http://localhost:3000/massSchedule', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(massData),
        })
            .then(response => response.json())
            .then(data => {

                if(data.message){
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.message,
                    });
                }
                else{
                    console.log('Success:', data);
                    alert('Horarios guardados con éxito.');
                    datePicker.value = '';
                    timeSlots.classList.add('d-none');
                    timeSlotsContainer.innerHTML = ''; // Limpiar los horarios seleccionados
    
                }
               
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Error al guardar los horarios. Por favor, intente de nuevo.');
            });
    });

    loadTimeSlotsToDeleteBtn.addEventListener('click', function () {
        const dateToDelete = deleteDatePicker.value;
        if (!dateToDelete) {
            alert('Por favor, seleccione una fecha para cargar horarios.');
            return;
        }

        fetch(`http://localhost:3000/massSchedule/time-slots?date=${dateToDelete}`)
            .then(response => response.json())
            .then(data => {
                timeSlotsToDelete.innerHTML = '';
                if (data.timeSlots && data.timeSlots.length > 0) {
                    data.timeSlots.forEach(slot => {
                        const timeSlot = document.createElement('div');
                        timeSlot.className = 'time-slot btn btn-outline-danger';
                        timeSlot.textContent = slot.time;
                        timeSlot.addEventListener('click', function () {
                            this.classList.toggle('selected');
                        });
                        timeSlotsToDelete.appendChild(timeSlot);
                    });
                    deleteSelectedSlotsBtn.classList.remove('d-none');
                } else {
                    timeSlotsToDelete.innerHTML = '<p>No hay horarios disponibles para esta fecha.</p>';
                    deleteSelectedSlotsBtn.classList.add('d-none');
                }
            })
            .catch(error => {
                console.error('Error al cargar los horarios:', error);
                alert('Error al cargar los horarios. Por favor, intente de nuevo.');
            });
    });

    deleteSelectedSlotsBtn.addEventListener('click', function () {
        const dateToDelete = deleteDatePicker.value;
        const slotsToDelete = Array.from(document.querySelectorAll('#timeSlotsToDelete .time-slot.selected'))
            .map(slot => slot.textContent);

        if (slotsToDelete.length === 0) {
            alert('Por favor, seleccione al menos un horario para eliminar.');
            return;
        }

        fetch('http://localhost:3000/massSchedule/remove-time-slots', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ date: dateToDelete, timeSlots: slotsToDelete }),
        })
            .then(response => response.json())
            .then(data => {
                alert('Horarios seleccionados eliminados.');
                loadTimeSlotsToDeleteBtn.click(); // Recargar los horarios
            })
            .catch((error) => {
                console.error('Error al eliminar los horarios:', error);
                alert('Error al eliminar los horarios. Por favor, intente de nuevo.');
            });
    });
}
