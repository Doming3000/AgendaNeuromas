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
    // Enviar respuesta JSON en caso de error de conexión
    echo json_encode(["status" => "error", "message" => "Conexión fallida: " . $conn->connect_error]);
    exit;
}

// Recibir los datos del formulario
$hora_inicio = $_POST['horaInicio'] ?? null;
$hora_fin = $_POST['horaFin'] ?? null;
$fecha = $_POST['fecha'] ?? null;

// Validar que los datos no estén vacíos
if (empty($hora_inicio) || empty($hora_fin) || empty($fecha)) {
    echo json_encode(["status" => "error", "message" => "Error: Falta la hora de inicio u hora de fin."]);
    exit;
}

// Convertir las horas a minutos desde la medianoche para validarlas
function convertirHoraAMinutos($hora) {
    list($horas, $minutos) = explode(':', $hora);
    return $horas * 60 + $minutos;
}

$minutos_inicio = convertirHoraAMinutos($hora_inicio);
$minutos_fin = convertirHoraAMinutos($hora_fin);

// Verificar que la hora de inicio sea anterior a la hora de fin
if ($minutos_inicio >= $minutos_fin) {
    echo json_encode(["status" => "error", "message" => "Error: La hora de inicio debe ser anterior a la hora de fin."]);
    exit;
}

// Insertar los datos en la tabla 'horas'
$sql = "INSERT INTO horas (fecha_hora, hora_inicio, hora_fin) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);

// Verificar si la preparación de la consulta fue exitosa
if ($stmt === false) {
    echo json_encode(["status" => "error", "message" => "Error en la preparación de la consulta: " . $conn->error]);
    exit;
}

// Vincular los parámetros y ejecutar la consulta
$stmt->bind_param("sss", $fecha, $hora_inicio, $hora_fin);
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