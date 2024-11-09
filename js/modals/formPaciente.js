document.addEventListener('DOMContentLoaded', function() {
  const formPaciente = document.getElementById('formPaciente');
  
  formPaciente.addEventListener('submit', function(event) {
    // Prevenir el envío tradicional del formulario
    event.preventDefault();
    
    const formData = new FormData(formPaciente);
    
    // Verificar que el selector tenga un valor seleccionado
    const prevision = document.getElementById('prevision').value;
    if (prevision === 'none') {
      alert('Debe completar todos los campos');
      return;
    }
    
    fetch('php/registrarPaciente.php', {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }
      return response.json();
    })
    .then(data => {
      if (data.status === "success") {
        alert('Paciente registrado exitosamente.');
        // Limpiar el formulario
        formPaciente.reset();
        
        // Emitir evento 'pacienteRegistrado'
        const pacienteRegistradoEvent = new Event('pacienteRegistrado');
        document.dispatchEvent(pacienteRegistradoEvent);
        
        // Cerrar el modal actual y abrir el modal de agendar
        toggleModal('formPaciente', false);
        toggleModal('agendarModal', true);
      } else {
        alert('Error: ' + data.message);
      }
    })
    .catch(error => {
      console.error('Error en la petición fetch:', error);
      alert('Ocurrió un error inesperado. Por favor, inténtelo de nuevo.');
    });
  });
  
  // Función para mostrar u ocultar un modal
  function toggleModal(modalId, show) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = show ? 'block' : 'none';
    }
  }
});