// Función para abrir el formulario y mostrar el overlay
function openForm() {
  document.getElementById("formPaciente").style.display = "block";
  document.getElementById("overlay").style.display = "block";
  
  document.body.classList.add("no-interaction");
}

// Función para cerrar el formulario y ocultar el overlay
function closeForm() {
  document.getElementById("formPaciente").style.display = "none";
  document.getElementById("overlay").style.display = "none";
  
  // Remover la clase para habilitar la interacción del fondo
  document.body.classList.remove("no-interaction");
  
  // Reiniciar el formulario
  document.getElementById("formPaciente").reset();
}

// Función para validar el RUT
function validarRut(rut) {
  let validacion = false;
  
  try {
    // Validar formato básico del RUT (debe tener un guión y no empezar/terminar con él)
    if ((rut.match(/-/g) || []).length !== 1 || rut.startsWith('-') || rut.endsWith('-')) {
      return false;
    }
    
    // Separar cuerpo del RUT y dígito verificador
    const partes = rut.split('-');
    if (partes.length !== 2) {
      return false;
    }
    
    const cuerpo = partes[0];
    let digitoVerificador = partes[1].toUpperCase();
    
    // Convertir el cuerpo a número
    const rutAux = parseInt(cuerpo, 10);
    if (isNaN(rutAux)) {
      return false;
    }
    
    // Algoritmo para calcular el dígito verificador esperado
    let m = 0, s = 1;
    for (let t = rutAux; t > 0; t = Math.floor(t / 10)) {
      s = (s + t % 10 * (9 - m++ % 6)) % 11;
    }
    
    const dvEsperado = s !== 0 ? String.fromCharCode(s + 47) : 'K';
    
    // Comparar el dígito verificador ingresado con el calculado
    if (digitoVerificador === dvEsperado) {
      validacion = true;
    }
  } catch (e) {
    validacion = false;
  }
  
  return validacion;
}

// Solo permitir números en input de teléfono
document.getElementById('telefono').addEventListener('input', function(e) {
  this.value = this.value.replace(/[^0-9]/g, '');
});

// Ejecutar una vez que el documento esté completamente cargado
document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("formPaciente").addEventListener("submit", function(event) {
    event.preventDefault();
    
    const formData = new FormData(this);
    const rut = document.getElementById("rut").value;
    const prevision = document.getElementById("prevision").value;
    
    // Validar el RUT ingresado
    if (!validarRut(rut)) {
      alert("RUT no válido. Por favor, ingrese un RUT válido.");
      return false;
    }
    
    // Verificar si se seleccionó una previsión válida
    else if (prevision === "none") {
      alert("Debe seleccionar una previsión.");
      return;
    }
    
    // Si todo es válido, enviar el formulario al servidor
    fetch("php/procesar.php", {
      method: "POST",
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      // Manejar la respuesta del servidor
      if (data.status === "success") {
        Swal.fire({
          icon: 'success',
          title: 'Paciente registrado',
          text: data.message
        });
        
        closeForm();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.message
        });
      }
    })
    .catch(error => {
      // Manejo de errores en la solicitud
      console.error("Error en la solicitud:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al registrar el paciente.'
      });
    });
  });
});