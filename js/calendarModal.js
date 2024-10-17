// Variables globales para almacenar la fecha seleccionada y la fecha formateada
let selectedDate;
let dateFormatted;

document.addEventListener('DOMContentLoaded', function() {
  
  // Manejo de eventos personalizados
  document.addEventListener('dateSelected', handleDateSelected);
  
  // Manejo de botones de interacción
  document.getElementById('closeButton').addEventListener('click', closeModal);
  document.getElementById('agendarButton').addEventListener('click', openAgendarModal);
  document.getElementById('closeFormButton').addEventListener('click', closeForm);
  
  // Manejo del envío del formulario
  document.getElementById('agendarModal').addEventListener('submit', handleFormSubmit);
  
  // Funciones para manejo de eventos
  function handleDateSelected(event) {
    // Actualizar las variables globales
    dateFormatted = event.detail.dateFormatted;
    selectedDate = event.detail.date;
    
    // Mostrar overlay y modal con la fecha seleccionada
    toggleOverlay(true);
    toggleModal('fechaSeleccionada', true);
    
    // Añadir clase para evitar la interacción con el fondo
    document.body.classList.add('no-interaction');
    
    // Mostrar la fecha seleccionada en el input y en el modal
    const formattedDate = selectedDate.toISOString().split('T')[0];
    document.getElementById('fecha').value = formattedDate;
    document.querySelector('.fechaSeleccionada h3').textContent = dateFormatted;
  }
  
  function openAgendarModal() {
    toggleModal('fechaSeleccionada', false);
    toggleModal('agendarModal', true);
    
    document.querySelector('.agendarModal h3').textContent = `Agendar hora para el ${dateFormatted}`;
  }
  
  function handleFormSubmit(event) {
    event.preventDefault();
    
    const paciente = document.getElementById('paciente').value;
    const profesional = document.getElementById('profesional').value;
    
    // Comprobar si los select están "vacios"
    if (paciente === 'none' || profesional === 'none') {
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
        // Mostrar mensaje de error del servidor
        alert(data.message);
      }
    })
    .catch(error => {
      console.error('Error en el fetch:', error);
      alert('Ha ocurrido un error inesperado. Consulte la consola para más detalles.');
    });
  }
  
  // Funciones de control de modales y formularios
  function closeModal() {
    toggleOverlay(false);
    toggleModal('fechaSeleccionada', false);
    document.body.classList.remove('no-interaction');
  }
  
  function closeForm() {
    toggleModal('agendarModal', false);
    toggleModal('fechaSeleccionada', true);
    document.getElementById('agendarModal').reset();
  }
  
  // Funciones auxiliares
  function toggleOverlay(show) {
    document.getElementById('overlay').style.display = show ? 'block' : 'none';
  }
  
  function toggleModal(modalId, show) {
    document.getElementById(modalId).style.display = show ? 'block' : 'none';
  }
});