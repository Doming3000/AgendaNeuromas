<?php
// Incluir el archivo de configuración de la base de datos
require_once 'config.php';

// Recibir los datos del formulario
$hora_inicio = $_POST['horaInicio'] ?? null;
$hora_fin = $_POST['horaFin'] ?? null;
$fecha = $_POST['fecha'] ?? null;
$paciente_id = $_POST['paciente'] ?? null;
$profesional_id = $_POST['profesional'] ?? null;

// Validar que los datos no estén vacíos
if (empty($hora_inicio) || empty($hora_fin) || empty($fecha) || $paciente_id === 'none' || $profesional_id === 'none') {
    // Enviar solo el mensaje de error sin prefijo
    echo json_encode(["status" => "error", "message" => "Debe completar todos los campos"]);
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

// Insertar los datos en la tabla 'horas' con los IDs de paciente y profesional
$sql = "INSERT INTO horas (fecha_hora, hora_inicio, hora_fin, paciente, profesional) 
        VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);

if ($stmt === false) {
    echo json_encode(["status" => "error", "message" => "Error en la preparación de la consulta: " . $conn->error]);
    exit;
}

// Vincular los parámetros y ejecutar la consulta
$stmt->bind_param("sssss", $fecha, $hora_inicio, $hora_fin, $paciente_id, $profesional_id);
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