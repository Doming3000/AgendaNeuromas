document.addEventListener("DOMContentLoaded", function() {
  // Referencias para la hora de inicio
  const timePickerInicio = document.getElementById('customTimePickerInicio');
  const selectedTimeDisplayInicio = document.getElementById('selectedTimeDisplayInicio');
  const timeDropdownInicio = document.getElementById('timeDropdownInicio');
  const hiddenTimeInputInicio = document.getElementById('horaInicio');
  
  // Referencias para la hora de fin
  const timePickerFin = document.getElementById('customTimePickerFin');
  const selectedTimeDisplayFin = document.getElementById('selectedTimeDisplayFin');
  const timeDropdownFin = document.getElementById('timeDropdownFin');
  const hiddenTimeInputFin = document.getElementById('horaFin');
  
  // Botón de cierre del formulario
  const closeFormButton = document.getElementById('closeFormButton');
  const agendarModal = document.getElementById('agendarModal');
  
  // Función para generar las opciones de horas (de 08:00 a 21:00, cada 15 minutos)
  function generarOpcionesDeHora(timeDropdown, selectedTimeDisplay, hiddenTimeInput) {
    for (let hora = 8; hora <= 21; hora++) {
      for (let minuto = 0; minuto < 60; minuto += 15) {
        if (hora === 21 && minuto > 0) break;
        
        const horaFormateada = hora.toString().padStart(2, '0');
        const minutoFormateado = minuto.toString().padStart(2, '0');
        const opcion = document.createElement('div');
        opcion.classList.add('time-option');
        opcion.textContent = `${horaFormateada}:${minutoFormateado}`;
        
        // Evento para seleccionar la hora
        opcion.addEventListener('click', function() {
          selectedTimeDisplay.textContent = `${horaFormateada}:${minutoFormateado}`; // Mostrar hora seleccionada
          hiddenTimeInput.value = `${horaFormateada}:${minutoFormateado}`;
          cerrarMenu(timeDropdown);
        });
        
        // Añadir opción al menú desplegable
        timeDropdown.appendChild(opcion);
      }
    }
  }
  
  // Función para alternar la visibilidad del menú desplegable
  function toggleMenu(timePicker) {
    timePicker.classList.toggle('active');
  }
  
  // Función para cerrar el menú desplegable
  function cerrarMenu(timePicker) {
    timePicker.classList.remove('active');
  }
  
  // Eventos de clic para abrir los time pickers
  timePickerInicio.addEventListener('click', function() {
    toggleMenu(timePickerInicio);
  });
  
  timePickerFin.addEventListener('click', function() {
    toggleMenu(timePickerFin);
  });
  
  // Cerrar los menús si se hace clic fuera de ellos
  document.addEventListener('click', function(event) {
    if (!timePickerInicio.contains(event.target)) {
      cerrarMenu(timePickerInicio);
    }
    if (!timePickerFin.contains(event.target)) {
      cerrarMenu(timePickerFin);
    }
  });
  
  // Generar las opciones de hora para ambos time pickers
  generarOpcionesDeHora(timeDropdownInicio, selectedTimeDisplayInicio, hiddenTimeInputInicio);
  generarOpcionesDeHora(timeDropdownFin, selectedTimeDisplayFin, hiddenTimeInputFin);
  
  // Resetear los valores de hora cuando se cierra el formulario
  closeFormButton.addEventListener('click', function() {
    hiddenTimeInputInicio.value = '';
    hiddenTimeInputFin.value = '';
    selectedTimeDisplayInicio.textContent = '--:--';
    selectedTimeDisplayFin.textContent = '--:--';
  });
});

// Error encontrado, en caso de éxito, no se limpian los valores.