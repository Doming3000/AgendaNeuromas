document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("formPaciente").addEventListener("submit", function(event) {
    event.preventDefault();
    
    const formData = new FormData(this);
    const prevision = document.getElementById("prevision").value;
    
    // Comrpobar si la previsión no está seleccionada
    if (prevision === "none") {
      Swal.fire({
        icon: 'warning',
        title: 'Previsión inválida',
        text: 'Por favor, seleccione una opción válida en la previsión.'
      });
      return;
    }
    
    // Continuar con el envío de datos si todo está correcto
    fetch("php/procesar.php", {
      method: "POST",
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      console.log("Respuesta recibida:", data);
      if (data.status === "success") {
        Swal.fire({
          icon: 'success',
          title: 'Paciente registrado',
          text: data.message
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.message
        });
      }
    })
    .catch(error => {
      console.error("Error en la solicitud:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al registrar el paciente.'
      });
    });
  });
});