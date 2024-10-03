<?php
// Datos de conexión a MySQL en XAMPP
$servername = "localhost";
$username = "root";
$password = "";
$database = "agendaneuromas";

// Crear la conexión
$conn = new mysqli($servername, $username, $password, $database);

// Verificar la conexión
if ($conn->connect_error) {
    // Devolver respuesta JSON en caso de error de conexión
    echo json_encode(["status" => "error", "message" => "Conexión fallida: " . $conn->connect_error]);
    exit;
}

// Recibir los datos del formulario
$nombre = $_POST['nombre'];
$rut = $_POST['rut'];
$correo = $_POST['correo'];
$telefono = $_POST['telefono'];
$prevision = $_POST['prevision'];

// Validar que los datos estén completos (puedes agregar más validaciones)
if (empty($nombre) || empty($rut) || empty($correo) || empty($telefono) || empty($prevision)) {
    echo json_encode(["status" => "error", "message" => "Por favor, complete todos los campos."]);
    exit;
}

// Insertar datos en la tabla `pacientes`
$sql = "INSERT INTO pacientes (nombre_pac, rut_pac, correo_pac, telefono_pac, prevision_pac) 
        VALUES ('$nombre', '$rut', '$correo', '$telefono', '$prevision')";

// Ejecutar la consulta y verificar el resultado
if ($conn->query($sql) === TRUE) {
    // Devolver respuesta de éxito en formato JSON
    echo json_encode(["status" => "success", "message" => "Paciente registrado con éxito"]);
} else {
    // Devolver respuesta de error en caso de fallo en la consulta
    echo json_encode(["status" => "error", "message" => "Error: " . $conn->error]);
}

// Cerrar la conexión
$conn->close();
?>