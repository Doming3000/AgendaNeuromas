document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('agendarButton').addEventListener('click', function() {
    
    fetchPacientes();
    fetchProfesionales();
    
    // Mostrar el modal de agendar
    toggleModal('agendarModal', true);
  });
  
  // Función para obtener los pacientes de la base de datos
  function fetchPacientes() {
    fetch('php/obtenerPacientes.php')
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        const pacientes = data.pacientes;
        const pacienteSelect = document.getElementById('paciente');
        
        // Limpiar las opciones existentes, excepto la primera
        pacienteSelect.innerHTML = '<option value="none" disabled selected>Seleccione una opción</option>';
        
        // Agregar cada paciente como una opción en el select
        pacientes.forEach(paciente => {
          const option = document.createElement('option');
          option.value = paciente.id;
          option.textContent = paciente.nombre;
          pacienteSelect.appendChild(option);
        });
      } else {
        console.error('Error al obtener los pacientes:', data.message);
      }
    })
    .catch(error => {
      console.error('Error en la petición de pacientes:', error);
    });
  }
  
  // Función para obtener los profesionales de la base de datos
  function fetchProfesionales() {
    fetch('php/obtenerProfesionales.php')
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        const profesionales = data.profesionales;
        const profesionalSelect = document.getElementById('profesional');
        
        // Limpiar las opciones existentes, excepto la primera
        profesionalSelect.innerHTML = '<option value="none" disabled selected>Seleccione una opción</option>';
        
        // Agregar cada profesional como una opción en el select
        profesionales.forEach(profesional => {
          const option = document.createElement('option');
          option.value = profesional.id;
          option.textContent = profesional.nombre;
          profesionalSelect.appendChild(option);
        });
      } else {
        console.error('Error al obtener los profesionales:', data.message);
      }
    })
    .catch(error => {
      console.error('Error en la petición de profesionales:', error);
    });
  }
  
  // Función para controlar la visibilidad de los modales
  function toggleModal(modalId, show) {
    document.getElementById(modalId).style.display = show ? 'block' : 'none';
  }
});