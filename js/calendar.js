document.addEventListener('DOMContentLoaded', function() {
  var calendarEl = document.getElementById('calendar');
  var calendar = new FullCalendar.Calendar(calendarEl, {
    locale: 'es',
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    // Cuando se hace click en una fecha:
    dateClick: function(info) {
      
      // Obtener la fecha actual
      var today = new Date();
      today.setHours(0, 0, 0, 0); 
      
      if (info.date < today) {
        alert("Esta fecha ya pasó.")
        return; 
      }
      
      // Crear una fecha en el formato deseado
      var formatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
      var dateFormatted = info.date.toLocaleDateString('es-ES', formatOptions);
      
      // Mostrar el modal personalizado y el overlay
      document.getElementById('overlay').style.display = 'block';
      document.getElementById('horaModal').style.display = 'block';
      
      // Agregar clase para evitar interacción con el fondo
      document.body.classList.add("no-interaction");
      
      // Actualizar el título del modal con la fecha seleccionada
      document.querySelector('.horaModal h3').textContent = 'Agendar hora para el ' + dateFormatted;
    }
  });
  calendar.render();
  
  // Cerrar el modal al hacer clic en el botón "Aceptar"
  document.getElementById('horaModal').addEventListener('submit', function(event) {
    event.preventDefault();
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('horaModal').style.display = 'none';
    
    // Remover la clase para habilitar la interacción del fondo
    document.body.classList.remove("no-interaction");
    
    // Reiniciar el formulario
    document.getElementById("horaModal").reset();
  });
});