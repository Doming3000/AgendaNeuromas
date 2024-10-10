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
        alert("Esta fecha ya pasó. Seleccione una fecha posterior.");
      } else {
        // Crear una fecha en el formato deseado
        var formatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
        var dateFormatted = info.date.toLocaleDateString('es-ES', formatOptions);
        
        // Emitir un evento personalizado con la fecha real (info.date) y el formato
        document.dispatchEvent(new CustomEvent('dateSelected', { detail: { date: info.date, dateFormatted } }));
      }
    }
  });
  calendar.render();
});