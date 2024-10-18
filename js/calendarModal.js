// Declaración de variables
let selectedDate;
let dateFormatted;

document.addEventListener('DOMContentLoaded', function() {
  
  // Manejo de eventos personalizados
  document.addEventListener('dateSelected', handleDateSelected);
  
  // Manejo de botones de interacción
  document.getElementById('closeButton').addEventListener('click', closeModal);
  document.getElementById('agendarButton').addEventListener('click', openAgendarModal);
  document.getElementById('closeFormButton').addEventListener('click', closeForm);
  
  // Envío del formulario
  document.getElementById('agendarModal').addEventListener('submit', handleFormSubmit);
  
  // Funciones para manejo de eventos
  function handleDateSelected(event) {
    dateFormatted = event.detail.dateFormatted;
    selectedDate = event.detail.date;
    
    // Mostrar overlay y modal con la fecha seleccionada
    toggleOverlay(true);
    toggleModal('fechaSeleccionada', true);
    
    // Mostrar la fecha seleccionada en el input y en el modal
    const formattedDate = selectedDate.toISOString().split('T')[0];
    document.getElementById('fecha').value = formattedDate;
    document.querySelector('.fechaSeleccionada h3').textContent = dateFormatted;
  }
  
  // Función para manejar la apertura del modal para agendar
  function openAgendarModal() {
    toggleModal('fechaSeleccionada', false);
    toggleModal('agendarModal', true);
    
    document.querySelector('.agendarModal h3').textContent = `Agendar hora para el ${dateFormatted}`;
  }
  
  // Manejar el envío del formulario de agendar
  function handleFormSubmit(event) {
    event.preventDefault();
    
    const paciente = document.getElementById('paciente').value;
    const profesional = document.getElementById('profesional').value;
    
    // Comprobar que los selects no estén vacíos
    if (paciente === '' || profesional === '') {
      alert('Debe completar todos los campos');
      return;
    }
    
    const formData = new FormData(this);
    
    // Enviar los datos del formulario al servidor
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
      } else {
        alert(data.message);
      }
    })
    .catch(error => {
      console.error('Error en el fetch:', error);
      alert('Ha ocurrido un error inesperado.');
    });
  }
  
  // Funciones de control de modales y formularios
  function closeModal() {
    toggleOverlay(false);
    toggleModal('fechaSeleccionada', false);
  }
  
  function closeForm() {
    resetForms();
    resetTimePickers();
    
    document.getElementById('agendarModal').reset();
    toggleModal('agendarModal', false);
    toggleModal('fechaSeleccionada', true);
  }
  
  function resetForms() {
    $('#paciente').val(null).trigger('change');
    $('#profesional').val(null).trigger('change');
  }
  
  // Funciones auxiliares
  function toggleOverlay(show) {
    document.getElementById('overlay').style.display = show ? 'block' : 'none';
  }
  
  function toggleModal(modalId, show) {
    document.getElementById(modalId).style.display = show ? 'block' : 'none';
  }
});