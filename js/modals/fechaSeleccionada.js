// Declaración de variables
let selectedDate;
let dateFormatted;

document.addEventListener('DOMContentLoaded', function() {
  // Manejo de eventos personalizados
  document.addEventListener('dateSelected', handleDateSelected);
  
  // Cerrar modal al hacer clic en el botón cerrar
  document.getElementById('closeButton').addEventListener('click', closeModal);
  
  // Función para manejar la selección de la fecha
  function handleDateSelected(event) {
    dateFormatted = event.detail.dateFormatted;
    selectedDate = event.detail.date;
    
    // Mostrar overlay y modal con la fecha seleccionada
    toggleOverlay(true);
    toggleModal('fechaSeleccionada', true);
    disableScroll();
    
    // Mostrar la fecha seleccionada en el input y en el modal
    const formattedDate = selectedDate.toISOString().split('T')[0];
    document.getElementById('fecha').value = formattedDate;
    document.querySelector('.fechaSeleccionada h3').textContent = dateFormatted;
  }
  
  // Función para cerrar el modal de fecha
  function closeModal() {
    toggleOverlay(false);
    toggleModal('fechaSeleccionada', false);
    checkModals();
  }
  
  // Función para deshabilitar el scroll en la página
  function disableScroll() {
    document.body.style.overflow = 'hidden';
  }
  
  // Función para habilitar el scroll en la página solo si ambos modales están cerrados
  function checkModals() {
    const isAgendarModalOpen = document.getElementById('agendarModal').style.display === 'block';
    const isFechaModalOpen = document.getElementById('fechaSeleccionada').style.display === 'block';
    
    if (!isAgendarModalOpen && !isFechaModalOpen) {
      enableScroll();
    }
  }
  
  // Función para habilitar el scroll en la página
  function enableScroll() {
    document.body.style.overflow = 'auto';
  }
  
  // Función para mostrar u ocultar un modal
  function toggleModal(modalId, show) {
    document.getElementById(modalId).style.display = show ? 'block' : 'none';
  }
  
  // Función para mostrar u ocultar el overlay
  function toggleOverlay(show) {
    document.getElementById('overlay').style.display = show ? 'block' : 'none';
  }
});