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
    // Configuración del evento cuando se hace clic en una fecha
    dateClick: function(info) {
      //Alerta de SweetAlert
      Swal.fire({
        title: 'Fecha seleccionada',
        text: 'Has hecho clic en la fecha: ' + info.dateStr,
        icon: 'info',
        confirmButtonText: 'Cerrar'
      });
    },
    events: [
      // Espacio para eventos
    ]
  });
  calendar.render();
});