function listarHorasDeHoy() {
  const horarioContainer = document.querySelector('.horarioContainer');
  
  // Obtener la fecha actual en formato YYYY-MM-DD
  const hoy = new Date();
  const fechaActual = hoy.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  
  // Mostrar un mensaje de carga mientras se obtienen las horas
  horarioContainer.innerHTML = '<p>Consultando horas para el día de hoy...</p>';
  
  // Realizar solicitud al servidor
  fetch(`php/obtenerHoras.php?fecha=${fechaActual}`)
  .then(response => response.json())
  .then(data => {
    if (data.status === 'success' && data.horas && data.horas.length > 0) {
      // Limpiar el contenedor antes de agregar nuevas horas
      horarioContainer.innerHTML = '';
      
      // Agregar cada hora como un elemento dentro del contenedor
      data.horas.forEach(hora => {
        // Formatear las horas en formato HH:MM
        const horaInicioFormatted = hora.hora_inicio.slice(0, 5);
        const horaFinFormatted = hora.hora_fin.slice(0, 5);
        
        // Crear elemento para mostrar la hora
        const horaElement = document.createElement('div');
        horaElement.className = 'hora-item';
        horaElement.textContent = `${horaInicioFormatted} - ${horaFinFormatted} | Paciente: ${hora.paciente} | Profesional: ${hora.profesional}`;
        
        horarioContainer.appendChild(horaElement);
      });
    } else {
      // Si no hay horas para hoy
      horarioContainer.innerHTML = '<p>No tienes nada para hoy.</p>';
    }
  })
  .catch(error => {
    console.error('Error al obtener las horas del día:', error);
    horarioContainer.innerHTML = '<p>Ha ocurrido un error al cargar las horas.</p>';
  });
}

// Llamar a la función automáticamente al cargar la página
document.addEventListener('DOMContentLoaded', listarHorasDeHoy);