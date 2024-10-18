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
  
  // Referencia para mostrar la duración
  const duracionSesion = document.getElementById('duracionSesion');
  
  // Función para generar las opciones de horas (de 08:00 a 21:00, cada 15 minutos)
  function generarOpcionesDeHora(timeDropdown, selectedTimeDisplay, hiddenTimeInput) {
    for (let hora = 8; hora <= 21; hora++) {
      for (let minuto = 0; minuto < 60; minuto += 15) {
        if (hora === 21 && minuto > 0) break; // Limitar a 21:00 horas máximo
        
        const horaFormateada = hora.toString().padStart(2, '0');
        const minutoFormateado = minuto.toString().padStart(2, '0');
        const opcion = document.createElement('div');
        opcion.classList.add('time-option');
        opcion.textContent = `${horaFormateada}:${minutoFormateado}`;
        
        // Evento para seleccionar la hora
        opcion.addEventListener('click', function() {
          selectedTimeDisplay.textContent = `${horaFormateada}:${minutoFormateado}`;
          hiddenTimeInput.value = `${horaFormateada}:${minutoFormateado}`;
          cerrarMenu(timeDropdown);
          calcularDuracion();
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
  
  // Función para calcular la duración entre dos horas
  function calcularDuracion() {
    const horaInicio = hiddenTimeInputInicio.value;
    const horaFin = hiddenTimeInputFin.value;
    
    if (!horaInicio || !horaFin) {
      return; // No se calculan los valores si no se han seleccionado ambos
    }
    
    const [horaInicioHoras, horaInicioMinutos] = horaInicio.split(':').map(Number);
    const [horaFinHoras, horaFinMinutos] = horaFin.split(':').map(Number);
    
    const totalMinutosInicio = (horaInicioHoras * 60) + horaInicioMinutos;
    const totalMinutosFin = (horaFinHoras * 60) + horaFinMinutos;
    
    // Si la hora de inicio es mayor que la de fin, no mostrar nada
    if (totalMinutosInicio >= totalMinutosFin) {
      duracionSesion.style.display = 'none';
      return;
    }
    
    const duracionMinutos = totalMinutosFin - totalMinutosInicio;
    const horas = Math.floor(duracionMinutos / 60);
    const minutos = duracionMinutos % 60;
    
    let mensaje = 'La sesión durará ';
    if (horas > 0) {
      mensaje += `${horas} hora${horas > 1 ? 's' : ''}`;
    }
    if (minutos > 0 || horas === 0) {
      if (horas > 0) {
        mensaje += ' y ';
      }
      mensaje += `${minutos} minuto${minutos > 1 ? 's' : ''}`;
    }
    
    // Actualiza el texto del elemento <p>
    duracionSesion.textContent = mensaje;
    duracionSesion.style.display = 'block';
  }
  
  // Función para resetear los valores de los time pickers
  function resetTimePickers() {
    hiddenTimeInputInicio.value = '';
    hiddenTimeInputFin.value = '';
    selectedTimeDisplayInicio.textContent = '--:--';
    selectedTimeDisplayFin.textContent = '--:--';
    duracionSesion.style.display = 'none';
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
  closeFormButton.addEventListener('click', resetTimePickers);
  
  // Exportar la función de reset
  window.resetTimePickers = resetTimePickers;
});