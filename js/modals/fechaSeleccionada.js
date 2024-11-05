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
    
    // Mostrar la fecha seleccionada en el input y en el modal
    const formattedDate = selectedDate.toISOString().split('T')[0];
    document.getElementById('fecha').value = formattedDate;
    document.querySelector('.fechaSeleccionada h3').textContent = dateFormatted;
    
    // Llamar a la función para obtener y mostrar las horas
    obtenerhoras(formattedDate);
  }
  
  // Función para obtener las horas de la fecha seleccionada
  function obtenerhoras(fechaSeleccionada) {
    const horaContainer = document.querySelector('.horaContainer');
    
    // Mostrar un mensaje de carga mientras se obtienen las horas
    horaContainer.innerHTML = '<p>Cargando horas...</p>';
    
    fetch(`php/obtenerHoras.php?fecha=${fechaSeleccionada}`)
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success' && data.horas && data.horas.length > 0) {
        // Limpiar el contenedor antes de agregar nuevas horas
        horaContainer.innerHTML = '';
        
        data.horas.forEach(hora => {
          // Formatear la hora de inicio y fin en formato HH:MM
          const horaInicioFormatted = hora.hora_inicio.slice(0, 5);
          const horaFinFormatted = hora.hora_fin.slice(0, 5);
          
          const horaElement = document.createElement('span');
          horaElement.textContent = `${horaInicioFormatted} - ${horaFinFormatted} | Paciente: ${hora.paciente} | Profesional: ${hora.profesional}`;
          horaContainer.appendChild(horaElement);
        });
      } else {
        // Mensaje si no hay horas agendadas para hoy
        horaContainer.innerHTML = '<p>No tienes nada para este día</p>';
      }
      
      // Mostrar overlay y modal solo después de cargar las horas
      toggleOverlay(true);
      toggleModal('fechaSeleccionada', true);
      disableScroll();
    })
    .catch(error => {
      console.error('Error al obtener las horas:', error);
      horaContainer.innerHTML = '<p>Error al cargar las horas.</p>';
    });
  }
  
  document.addEventListener('horaAgendada', function(event) {
    const fechaAgendada = event.detail.fecha;
    obtenerhoras(fechaAgendada);
  });
  
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