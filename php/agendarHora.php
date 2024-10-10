<?php
// Datos de conexión a MySQL
$servername = "localhost";
$username = "root";
$password = "";
$database = "agendaneuromas";

// Crear la conexión
$conn = new mysqli($servername, $username, $password, $database);

// Verificar la conexión
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Conexión fallida: " . $conn->connect_error]);
    exit;
}

// Recibir los datos del formulario
$hora = $_POST['hora'];
$fecha = $_POST['fecha'];

// Validar que los datos no estén vacíos
if (empty($hora) || empty($fecha)) {
    echo json_encode(["status" => "error", "message" => "Error: falta la fecha o la hora."]);
    exit;
}

// Insertar los datos en la tabla
$sql = "INSERT INTO horas (fecha_hora, hora_hora) VALUES (?, ?)";
$stmt = $conn->prepare($sql);

// Verificar si la preparación de la consulta fue exitosa
if ($stmt === false) {
    echo json_encode(["status" => "error", "message" => "Error en la preparación de la consulta: " . $conn->error]);
    exit;
}

// Vincular los parámetros y ejecutar la consulta
$stmt->bind_param("ss", $fecha, $hora);
$stmt->execute();

// Verificar si la consulta fue exitosa
if ($stmt->affected_rows > 0) {
    echo json_encode(["status" => "success", "message" => "Hora agendada con éxito."]);
} else {
    echo json_encode(["status" => "error", "message" => "Error al agendar la hora: " . $stmt->error]);
}

// Cerrar la conexión
$stmt->close();
$conn->close();
?>