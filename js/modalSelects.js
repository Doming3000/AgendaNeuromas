document.addEventListener('DOMContentLoaded', function() {
  // Inicializa select2 para los selectores al cargar la página
  initializeSelect2('paciente');
  initializeSelect2('profesional');
  
  // Al hacer clic en el botón de agendar, se resetean los formularios y se cargan los datos necesarios
  document.getElementById('agendarButton').addEventListener('click', function() {
    // Llamadas a funciones para actualizar opciones
    fetchPacientes();
    fetchProfesionales();
    
    // Llamar a funciones tras escuchar evento de paciente registrado
    document.addEventListener('pacienteRegistrado', fetchPacientes);
    
    // Abrir el modal de agendar
    toggleModal('agendarModal', true);
  });
  
  // Función para inicializar select2 (sin destrucción)
  function initializeSelect2(selectId) {
    $(`#${selectId}`).select2({
      placeholder: "Seleccione una opción",
      width: '100%'
    });
  }
  
  // Función para limpiar y actualizar el select con nuevas opciones
  function updateSelectOptions(selectElement, options) {
    // Limpiar opciones actuales
    selectElement.innerHTML = '';
    
    // Agrega una opción de marcador de posición
    const placeholderOption = document.createElement('option');
    placeholderOption.value = '';
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    placeholderOption.textContent = "Seleccione una opción";
    selectElement.appendChild(placeholderOption);
    
    // Agrega las nuevas opciones
    options.forEach(optionData => {
      const option = document.createElement('option');
      option.value = optionData.id;
      option.textContent = optionData.nombre;
      selectElement.appendChild(option);
    });
    
    // Refresca select2 para reflejar los cambios
    $(`#${selectElement.id}`).trigger('change');
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