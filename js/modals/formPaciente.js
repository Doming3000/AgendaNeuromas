document.addEventListener('DOMContentLoaded', function() {
  const formPaciente = document.getElementById('formPaciente');
  
  // Función para validar el rut
  function validarRut(rut) {
    let validacion = false;
    
    try {
      if ((rut.match(/-/g) || []).length !== 1 || rut.startsWith('-') || rut.endsWith('-')) {
        return false;
      }
      
      const partes = rut.split('-');
      if (partes.length !== 2) {
        return false;
      }
      
      const cuerpo = partes[0];
      let digitoVerificador = partes[1].toUpperCase();
      
      const rutAux = parseInt(cuerpo, 10);
      if (isNaN(rutAux)) {
        return false;
      }
      
      let m = 0, s = 1;
      for (let t = rutAux; t > 0; t = Math.floor(t / 10)) {
        s = (s + t % 10 * (9 - m++ % 6)) % 11;
      }
      
      const dvEsperado = s !== 0 ? String.fromCharCode(s + 47) : 'K';
      
      if (digitoVerificador === dvEsperado) {
        validacion = true;
      }
    } catch (e) {
      validacion = false;
    }
    
    return validacion;
  }
  
  // Envío del formulario
  formPaciente.addEventListener('submit', function(event) {
    // Prevenir el envío tradicional del formulario
    event.preventDefault();
    
    const formData = new FormData(formPaciente);
    
    // Llamar a la función para validar el rut
    validarRut();
    
    // Verificar que el selector tenga un valor seleccionado
    const prevision = document.getElementById('prevision').value;
    if (prevision === 'none') {
      alert('Debe completar todos los campos');
      return;
    }
    
    fetch('php/registrarPaciente.php', {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }
      return response.json();
    })
    .then(data => {
      if (data.status === "success") {
        alert('Paciente registrado exitosamente.');
        // Limpiar el formulario
        formPaciente.reset();
        
        // Emitir evento 'pacienteRegistrado'
        const pacienteRegistradoEvent = new Event('pacienteRegistrado');
        document.dispatchEvent(pacienteRegistradoEvent);
        
        // Cerrar el modal actual y abrir el modal de agendar
        toggleModal('formPaciente', false);
        toggleModal('agendarModal', true);
      } else {
        alert('Error: ' + data.message);
      }
    })
    .catch(error => {
      console.error('Error en la petición fetch:', error);
      alert('Ocurrió un error inesperado. Por favor, inténtelo de nuevo.');
    });
  });
  
  // Solo permitir números en el input de teléfono
  document.getElementById('telefono').addEventListener('input', function(e) {
    this.value = this.value.replace(/[^0-9]/g, '');
  });
  
  // Solo permitir números y guines en el input del rut
  document.getElementById('rut').addEventListener('input', function(e) {
    this.value = this.value.replace(/[^0-9kK-]/g, '');
  });
  
  // Función para mostrar u ocultar un modal
  function toggleModal(modalId, show) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = show ? 'block' : 'none';
    }
  }
});