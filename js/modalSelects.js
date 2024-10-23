document.addEventListener('DOMContentLoaded', function() {
  // Al hacer clic en el botón de agendar, se resetean los formularios y se cargan los datos necesarios
  document.getElementById('agendarButton').addEventListener('click', function() {
    // Llamadas a funciones
    fetchPacientes();
    fetchProfesionales();
    
    // Abrir el modal de agendar
    toggleModal('agendarModal', true);
  });
  
  // Función para inicializar select2
  function initializeSelect2(selectId) {
    $(`#${selectId}`).select2({
      placeholder: "Seleccione una opción",
      allowClear: false,
    });
  }
  
  // Función para limpiar y actualizar select con nuevas opciones
  function updateSelectOptions(selectElement, options) {
    selectElement.innerHTML = '';
    const placeholderOption = document.createElement('option');
    placeholderOption.value = '';
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    selectElement.appendChild(placeholderOption);
    
    options.forEach(optionData => {
      const option = document.createElement('option');
      option.value = optionData.id;
      option.textContent = optionData.nombre;
      selectElement.appendChild(option);
    });
    
    // Verificar si select2 ya está inicializado
    const selectId = selectElement.id;
    if ($(`#${selectId}`).hasClass('select2-hidden-accessible')) {
      $(`#${selectId}`).select2('destroy');
    }
    
    initializeSelect2(selectId);
  }
  
  // Función para obtener la lista de pacientes desde el servidor
  function fetchPacientes() {
    fetch('php/obtenerPacientes.php')
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        const pacienteSelect = document.getElementById('paciente');
        updateSelectOptions(pacienteSelect, data.pacientes);
      } else {
        console.error('Error al obtener los pacientes:', data.message);
      }
    })
    .catch(error => {
      console.error('Error en la petición de pacientes:', error);
    });
  }
  
  // Función para obtener la lista de profesionales desde el servidor
  function fetchProfesionales() {
    fetch('php/obtenerProfesionales.php')
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        const profesionalSelect = document.getElementById('profesional');
        updateSelectOptions(profesionalSelect, data.profesionales);
      } else {
        console.error('Error al obtener los profesionales:', data.message);
      }
    })
    .catch(error => {
      console.error('Error en la petición de profesionales:', error);
    });
  }
  
  // Función para mostrar u ocultar un modal
  function toggleModal(modalId, show) {
    document.getElementById(modalId).style.display = show ? 'block' : 'none';
  }
});