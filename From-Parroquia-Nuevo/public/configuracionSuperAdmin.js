document.addEventListener('DOMContentLoaded', function () {
    const mainContent = document.getElementById('Principal');
    const configuracionLink = document.getElementById('configSuperAdmin');
    const inicioLink = document.getElementById('inicioLink');
    const mobileinicioLink = document.getElementById('MobileinicioLink');


    const contenidoInicial = `
        <div class="container px-5 my-5 text-center">
            <img src="/img/parroquiaSantaMaria.png" class="img-fluid" alt="">
           
             
        </div>
    `;



    async function handleConfigClick(e) {
        e.preventDefault();




        try {
            const response = await fetch(`http://localhost:3000/user/data`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al obtener los datos del perfil');
            }

            const data = await response.json();


            console.log('Datos del perfil:', data);

            const configHTML = `
                <div class="container px-5 my-5 text-center">
                    <h1>Perfil</h1>
                    
                    <div class="container">
                        <div class="main-body">
                            <div class="row gutters-sm">
                                <div class="col-md-4 mb-3">
                                    <div class="card">
                                        <div class="card-body">
                                            <div class="d-flex flex-column align-items-center text-center">
                                                <img src="${data.avatarUrl || 'https://bootdey.com/img/Content/avatar/avatar7.png'}" alt="Admin" class="rounded-circle" width="150">
                                                <div class="mt-3">
                                                    <h4>${data.name}</h4>
                            
                                                 </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-md-8">
                                    <div class="card mb-3">
                                        <div class="card-body">
                                            <div class="row">
                                                <div class="col-sm-3">
                                                    <h6 class="mb-0">Nombre</h6>
                                                </div>
                                                <div class="col-sm-9 text-secondary">
                                                    ${data.name}
                                                </div>
                                                <hr>
                                                <div class="col-sm-3">
                                                    <h6 class="mb-0">Apellido</h6>
                                                </div>
                                                <div class="col-sm-9 text-secondary">
                                                    ${data.lastName}
                                                </div>
                                                <hr>
                                                <div class="col-sm-3">
                                                    <h6 class="mb-0">N° de documento</h6>
                                                </div>
                                                <div class="col-sm-9 text-secondary">
                                                    ${data.documentNumber}
                                                </div>
                                                <hr>

                                                <div class="col-sm-3">
                                                    <h6 class="mb-0">Rol</h6>
                                                </div>
                                                <div class="col-sm-9 text-secondary">
                                                    ${data.role}
                                                </div>
                                            </div>
                                            <hr>
                                            <div class="row">
                                                <div class="col-sm-3">
                                                    <h6 class="mb-0">Email</h6>
                                                </div>
                                                <div class="col-sm-9 text-secondary">
                                                    ${data.mail}
                                                </div>
                                            </div>
                                            <hr>
                                           
                                        
                                           
                                            <hr>
                                            <div class="row">
                                                  <div class="col-sm-12">
                                                   <button id="editButton" class="btn btn-info">Edit</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            mainContent.innerHTML = configHTML;

            // Añadir funcionalidad al botón después de que el contenido se haya insertado
            const editButton = document.getElementById('editButton');
            if (editButton) {
                editButton.addEventListener('click', function () {
                    Swal.fire({
                        title: 'Edit Profile',
                        html: `
                <input id="swal-input1" class="swal2-input" placeholder="Name" value="${data.name}">
                <input id="swal-input2" class="swal2-input" placeholder="Last Name" value="${data.lastName}">
                <input id="swal-input3" class="swal2-input" placeholder="Email" value="${data.mail}">
                <input id="swal-input4" class="swal2-input" placeholder="Document Number" value="${data.documentNumber}">
            `,
                        focusConfirm: false,
                        preConfirm: () => {
                            return {
                                name: document.getElementById('swal-input1').value,
                                lastName: document.getElementById('swal-input2').value,
                                mail: document.getElementById('swal-input3').value,
                                documentNumber: document.getElementById('swal-input4').value
                            };
                        }
                    }).then((result) => {
                        if (result.isConfirmed) {
                            const updatedData = result.value;
                            fetch(`http://localhost:3000/user/${data._id}`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                },
                                body: JSON.stringify(updatedData)
                            })
                                .then(response => {
                                    if (!response.ok) {
                                        return response.json().then(errorData => {
                                            throw new Error(errorData.error || 'Error al actualizar los datos del perfil');
                                        });
                                    }
                                    return response.json();
                                })
                                .then(result => {
                                    console.log('Datos actualizados:', result);
                                    Swal.fire({
                                        title: 'Success',
                                        text: 'Profile updated successfully!',
                                        icon: 'success',
                                        confirmButtonText: 'Ok'
                                    }).then(() => {
                                        handleConfigClick(); // Recargar los datos actualizados
                                    });
                                })
                                .catch(error => {
                                    console.error('Error al actualizar datos del perfil:', error);
                                    Swal.fire({
                                        title: 'Error',
                                        text: error.message,
                                        icon: 'error',
                                        confirmButtonText: 'Ok'
                                    });
                                });
                        }
                    });
                });
            }



        } catch (error) {
            console.error('Error al obtener datos del perfil:', error);
            Swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        }
    }


    function handleInicioClick(e) {
        e.preventDefault();
        mainContent.innerHTML = contenidoInicial;
    }

    const token = localStorage.getItem('tokenSession'); // Obtener el token de autorización

    console.log(token);

    if (configuracionLink) {
        configuracionLink.addEventListener('click', handleConfigClick);
    }



    if (mobileinicioLink) {
        mobileinicioLink.addEventListener('click', handleConfigClick);
    }



    if (inicioLink) {
        inicioLink.addEventListener('click', handleInicioClick);
    }


});