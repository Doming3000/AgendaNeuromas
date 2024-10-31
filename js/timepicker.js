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
  
  // Referencia para mostrar la duración
  const duracionSesion = document.getElementById('duracionSesion');
  
  function generarOpcionesDeHora(timeDropdown, selectedTimeDisplay, hiddenTimeInput) {
    // Limpiar el menú desplegable para evitar la duplicación de opciones
    timeDropdown.innerHTML = ""; 
    
    // Obtener fecha y hora actuales
    const now = new Date();
    
    let startHour = 8;
    let startMinute = 0;
    
    // Verificar si la fecha seleccionada es hoy
    const isToday = selectedDate &&
    selectedDate.getDate() === now.getDate() &&
    selectedDate.getMonth() === now.getMonth() &&
    selectedDate.getFullYear() === now.getFullYear();
    
    // Si es hoy, ajusta la hora de inicio al siguiente múltiplo de 15 minutos
    if (isToday && now.getHours() >= 8) {
      startHour = now.getHours();
      startMinute = Math.ceil(now.getMinutes() / 15) * 15;
      
      // Ajuste si startMinute llega a 60
      if (startMinute === 60) {
        startHour += 1;
        startMinute = 0;
      }
    }
    
    // Generar opciones de horas desde la hora de inicio calculada
    for (let hora = startHour; hora <= 21; hora++) {
      for (let minuto = (hora === startHour ? startMinute : 0); minuto < 60; minuto += 15) {
        if (hora === 21 && minuto > 0) break; // Limitar a 21:00 horas como máximo
        
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
  function toggleMenu(timePicker, timeDropdown) {
    timePicker.classList.toggle('active');
    
    if (timePicker.classList.contains('active')) {
      // Reinicia el scroll del menú al abrirlo
      timeDropdown.scrollTop = 0;
    }
  }
  
  // Función para cerrar el menú desplegable
  function cerrarMenu(timePicker) {
    timePicker.classList.remove('active');
  }
  
  // Función para calcular la duración entre dos horas
  function calcularDuracion() {
    const horaInicio = hiddenTimeInputInicio.value;
    const horaFin = hiddenTimeInputFin.value;
    
    // Evitar calcular los valores si no se han seleccionado ambos
    if (!horaInicio || !horaFin) {
      return;
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
  
  // Eventos de clic para abrir los time pickers y resetear scroll
  timePickerInicio.addEventListener('click', function() {
    toggleMenu(timePickerInicio, timeDropdownInicio);
  });
  
  timePickerFin.addEventListener('click', function() {
    toggleMenu(timePickerFin, timeDropdownFin);
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
  
  // Función para inicializar time pickers al abrir el modal
  function iniciarTimePickers() {
    generarOpcionesDeHora(timeDropdownInicio, selectedTimeDisplayInicio, hiddenTimeInputInicio);
    generarOpcionesDeHora(timeDropdownFin, selectedTimeDisplayFin, hiddenTimeInputFin);
  }
  
  // Resetear los valores de hora cuando se cierra el formulario
  closeFormButton.addEventListener('click', resetTimePickers);
  
  // Exportar funciones a nivel global
  window.iniciarTimePickers = iniciarTimePickers;
  window.resetTimePickers = resetTimePickers;
});