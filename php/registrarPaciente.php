<?php
require_once 'config.php';

// Validación de datos del formulario (asumiendo método POST)
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Sanitización de los datos para prevenir inyecciones de SQL
    $nombre = $conn->real_escape_string(trim($_POST["nombre"]));
    $rut = $conn->real_escape_string(trim($_POST["rut"]));
    $correo = $conn->real_escape_string(trim($_POST["correo"]));
    $telefono = $conn->real_escape_string(trim($_POST["telefono"]));
    $prevision = $conn->real_escape_string(trim($_POST["prevision"]));
    
    // Validar campos obligatorios
    if (empty($nombre) || empty($rut) || empty($correo) || empty($telefono) || empty($prevision)) {
        echo json_encode(["status" => "error", "message" => "Por favor, complete todos los campos."]);
        exit;
    }
    
    // Comprobar si el RUT ya está registrado
    $sql_check_rut = "SELECT * FROM pacientes WHERE rut_pac = '$rut'";
    $result = $conn->query($sql_check_rut);
    
    if ($result->num_rows > 0) {
        echo json_encode(["status" => "error", "message" => "El RUT ya está registrado."]);
        exit;
    }
    
    // Insertar nuevo paciente
    $sql = "INSERT INTO pacientes (nombre_pac, rut_pac, correo_pac, telefono_pac, prevision_pac) 
            VALUES ('$nombre', '$rut', '$correo', '$telefono', '$prevision')";
    
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["status" => "success", "message" => "Paciente registrado exitosamente."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error al registrar el paciente: " . $conn->error]);
    }
}

// Cerrar la conexión
$conn->close();
?>