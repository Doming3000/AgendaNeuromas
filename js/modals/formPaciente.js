document.addEventListener("DOMContentLoaded", function() {
  // Seleccionar el elemento 'addPaciente' usando su ID
  const addPacienteButton = document.getElementById("addPaciente");
  
  // Escuchar el evento click por medio de un listener
  addPacienteButton.addEventListener("click", function() {
    alert("Evento escuchado, alerta mostrada");
  });
});

// document.addEventListener('DOMContentLoaded', function() {
//   const formPaciente = document.getElementById('formPaciente');

//   formPaciente.addEventListener('submit', function(event) {
//     event.preventDefault();  // Prevenir el envío tradicional del formulario

//     const formData = new FormData(formPaciente);

//     fetch('php/registrarPaciente.php', {
//       method: 'POST',
//       body: formData
//     })
//     .then(response => {
  //       if (!response.ok) {
//         throw new Error('Error en la respuesta del servidor');
//       }
//       return response.json();  // Parsear la respuesta JSON
//     })
//     .then(data => {
  //       if (data.status === "success") {
//         alert('Paciente registrado exitosamente.');
//         formPaciente.reset();  // Limpiar el formulario
//       } else {
//         alert('Error: ' + data.message);
//       }
//     })
//     .catch(error => {
  //       console.error('Error en la petición fetch:', error);
//       alert('Ocurrió un error inesperado. Por favor, inténtelo de nuevo.');
//     });
//   });

//   // Cerrar el formulario con el botón cancelar
//   // const closeButton = document.getElementById('closeFormButton');
//   // closeButton.addEventListener('click', function() {
//   //   formPaciente.reset();  // Limpiar el formulario
//   //   alert('El formulario ha sido cancelado.');
//   // });
// });