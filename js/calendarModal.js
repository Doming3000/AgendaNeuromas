document.addEventListener('DOMContentLoaded', function() {
  // Variable para almacenar la fecha seleccionada
  let selectedDate;
  
  // Escuchar el evento personalizado 'dateSelected' para mostrar el modal con la fecha seleccionada
  document.addEventListener('dateSelected', function(event) {
    const dateFormatted = event.detail.dateFormatted;
    selectedDate = event.detail.date;
    
    // Mostrar overlay y modal con la fecha seleccionada
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('fechaSeleccionada').style.display = 'block';
    
    // Añadir clase para evitar la interacción con el fondo
    document.body.classList.add('no-interaction');
    
    // Mostrar la fecha seleccionada en el input y en el modal
    const formattedDate = selectedDate.toISOString().split('T')[0];
    document.getElementById('fecha').value = formattedDate;
    document.querySelector('.fechaSeleccionada h3').textContent = dateFormatted;
  });
  
  // Cerrar modal de fecha seleccionada
  document.getElementById('closeButton').addEventListener('click', function() {
    closeModal();
  });
  
  // Abrir formulario para agendar una hora
  document.getElementById('agendarButton').addEventListener('click', function() {
    document.getElementById('fechaSeleccionada').style.display = 'none';
    document.getElementById('agendarModal').style.display = 'block';
  });
  
  // Cerrar formulario de agendar
  document.getElementById('closeFormButton').addEventListener('click', function() {
    closeForm();
  });
  
  // Manejar el envío del formulario de agendar usando fetch
  document.getElementById('agendarModal').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const formData = new FormData(this);
    
    // Enviar los datos del formulario al servidor
    fetch('php/agendarHora.php', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      // Comprobar la respuesta del servidor
      if (data.status === "success") {
        alert('Hora agendada con éxito');
        closeForm();
      } else {
        alert('Ha ocurrido un error al agendar la hora');
      }
    })
    .catch(error => {
      alert('Ha ocurrido un error al agendar la hora');
    });
  });
  
  // Función para cerrar el modal de fecha seleccionada
  function closeModal() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('fechaSeleccionada').style.display = 'none';
    document.body.classList.remove('no-interaction');
  }
  
  // Función para cerrar el formulario de agendar
  function closeForm() {
    document.getElementById('agendarModal').style.display = 'none';
    document.getElementById('fechaSeleccionada').style.display = 'block';
    document.getElementById('agendarModal').reset();
  }
});