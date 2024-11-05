document.addEventListener('DOMContentLoaded', function() {
  // Botón de agendar
  document.getElementById('agendarButton').addEventListener('click', openAgendarModal);
  
  // Cerrar modal y formulario
  document.getElementById('closeFormButton').addEventListener('click', closeForm);
  
  // Envío del formulario
  document.getElementById('agendarModal').addEventListener('submit', handleFormSubmit);
  
  // Función para abrir el modal de agendar
  function openAgendarModal() {
    toggleModal('fechaSeleccionada', false);
    toggleModal('agendarModal', true);
    iniciarTimePickers();
    disableScroll();
    
    // Mostrar la fecha seleccionada en el encabezado del modal
    document.querySelector('.agendarModal h3').textContent = `Agendar hora para el ${dateFormatted}`;
  }
  
  // Función para manejar el envío del formulario
  function handleFormSubmit(event) {
    event.preventDefault();
    
    const paciente = document.getElementById('paciente').value;
    const profesional = document.getElementById('profesional').value;
    
    // Verificar que los campos select no estén vacíos
    if (paciente === '' || profesional === '') {
      alert('Debe completar todos los campos');
      return;
    }
    
    const formData = new FormData(event.target);
    
    // Enviar el formulario al servidor
    fetch('php/agendarHora.php', {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (data.status === "success") {
        alert('Hora agendada con éxito');
        closeForm();
        resetTimePickers();
        
        // Emitir el evento "horaAgendada" con la fecha seleccionada
        const horaAgendadaEvent = new CustomEvent("horaAgendada", { detail: { fecha: selectedDate.toISOString().split('T')[0] } });
        document.dispatchEvent(horaAgendadaEvent);
      } else {
        alert(data.message);
      }
    })
    .catch(error => {
      console.error('Error en el fetch:', error);
      alert('Ha ocurrido un error inesperado.');
    });
  }
  
  // Función para cerrar el formulario y el modal de agendar
  function closeForm() {
    resetForms();
    resetTimePickers();
    toggleModal('agendarModal', false);
    toggleModal('fechaSeleccionada', true);
    checkModals();
    
    document.getElementById('agendarModal').reset();
  }
  
  // Función para deshabilitar el scroll en la página
  function disableScroll() {
    document.body.style.overflow = 'hidden';
  }
  
  // Función para habilitar el scroll solo si ambos modales están cerrados
  function checkModals() {
    const isAgendarModalOpen = document.getElementById('agendarModal').style.display === 'block';
    const isFechaModalOpen = document.getElementById('fechaSeleccionada').style.display === 'block';
    
    if (!isAgendarModalOpen && !isFechaModalOpen) {
      enableScroll();
    }
  }
  
  // Función para resetear los formularios y select2
  function resetForms() {
    $('#paciente').val(null).trigger('change');
    $('#profesional').val(null).trigger('change');
  }
  
  // Función para mostrar u ocultar un modal
  function toggleModal(modalId, show) {
    document.getElementById(modalId).style.display = show ? 'block' : 'none';
  }
});