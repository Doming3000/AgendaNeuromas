document.addEventListener('DOMContentLoaded', function () {
  var calendarEl = document.getElementById('calendar');
  var calendar = new FullCalendar.Calendar(calendarEl, {
    locale: 'es',
    initialView: 'timeGridWeek',
    editable: false,
    weekends: false,
    slotMinTime: '08:00:00',
    slotMaxTime: '21:00:00',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    allDaySlot: false,
    titleFormat: {
      month: 'long',
    },
    datesSet: function (info) {
      // Personaliza el título para cada vista
      let title;
      
      if (info.view.type === 'timeGridDay') {
        // Vista de un día
        const start = new Date(info.start);
        title = start.toLocaleDateString('es-ES', { month: 'long', day: 'numeric' });
      } else if (info.view.type === 'dayGridMonth') {
        // Vista mensual
        const start = new Date(info.start);
        const end = new Date(info.end);
        const midDate = new Date((start.getTime() + end.getTime()) / 2);
        title = midDate.toLocaleDateString('es-ES', { month: 'long' });
      } else {
        // Vista semanal
        const start = new Date(info.start);
        const end = new Date(info.end);
        const formatter = new Intl.DateTimeFormat('es-ES', { day: 'numeric' });
        title = `${start.toLocaleDateString('es-ES', { month: 'long' })} ${formatter.format(start)}-${formatter.format(end)}`;
      }
      
      document.querySelector('.fc-toolbar-title').innerText = title;
    },
    dayHeaderContent: function (args) {
      // Personalizar los encabezados según la vista
      if (args.view.type === 'timeGridWeek') {
        // En la vista semanal: mostrar el nombre completo del día y el número
        const weekday = args.date.toLocaleDateString('es-ES', { weekday: 'long' });
        const day = args.date.getDate();
        return `${weekday} ${day}`;
      } else if (args.view.type === 'dayGridMonth') {
        // En la vista mensual: solo mostrar el nombre completo del día
        return args.date.toLocaleDateString('es-ES', { weekday: 'long' });
      }
      return args.text;
    },
    
    // Obtener eventos del backend
    events: function(fetchInfo, successCallback, failureCallback) {
      const fechaInicio = fetchInfo.startStr;
      const fechaFin = fetchInfo.endStr;
      
      fetch(`php/obtenerHoras.php?start=${fechaInicio}&end=${fechaFin}`)
      .then(response => response.json())
      .then(data => {
        console.log('Eventos recibidos:', data);
        successCallback(data);
      })
      .catch(error => {
        console.error('Error al cargar los eventos:', error);
        failureCallback(error);
      });
    },
    
    // Cuando se hace click en una fecha:
    dateClick: function(info) {
      // Obtener la fecha actual
      var today = new Date();
      today.setHours(0, 0, 0, 0); 
      
      if (info.date < today) {
        alert("La fecha seleccionada ya pasó. Por favor, elija una fecha posterior.");
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
  window.miCalendario = calendar; 
});

// Función para actualizar el calendario
function actualizarCalendario() {
  window.miCalendario.refetchEvents();
}