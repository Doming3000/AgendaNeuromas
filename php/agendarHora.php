<?php
require_once 'config.php';

// Recibir los datos del formulario
$hora_inicio = $_POST['horaInicio'] ?? null;
$hora_fin = $_POST['horaFin'] ?? null;
$fecha = $_POST['fecha'] ?? null;
$paciente_id = $_POST['paciente'] ?? null;
$profesional_id = $_POST['profesional'] ?? null;

// Validación de campos requeridos
if (empty($hora_inicio) || empty($hora_fin) || empty($fecha) || empty($paciente_id) || empty($profesional_id)) {
    echo json_encode(["status" => "error", "message" => "Debe completar todos los campos"]);
    exit;
}

// Convertir horas a minutos para validar
function convertirHoraAMinutos($hora) {
    list($horas, $minutos) = explode(':', $hora);
    return $horas * 60 + $minutos;
}

$minutos_inicio = convertirHoraAMinutos($hora_inicio);
$minutos_fin = convertirHoraAMinutos($hora_fin);

// Verificar que la hora de inicio sea anterior a la de fin
if ($minutos_inicio >= $minutos_fin) {
    echo json_encode(["status" => "error", "message" => "La hora de inicio debe ser anterior a la de fin."]);
    exit;
}

// Verificar conflictos de horario
$sql_conflicto = "SELECT * FROM horas WHERE profesional = ? AND fecha_hora = ? AND ((hora_inicio <= ? AND hora_fin > ?) OR (hora_inicio < ? AND hora_fin >= ?))";

$stmt_conflicto = $conn->prepare($sql_conflicto);

if ($stmt_conflicto === false) {
    echo json_encode(["status" => "error", "message" => "Error en la consulta de conflicto: " . $conn->error]);
    exit;
}

$stmt_conflicto->bind_param("ssssss", $profesional_id, $fecha, $hora_inicio, $hora_inicio, $hora_fin, $hora_fin);
$stmt_conflicto->execute();
$result_conflicto = $stmt_conflicto->get_result();

if ($result_conflicto->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "Conflicto de horario: El profesional estará ocupado durante este tiempo."]);
    $stmt_conflicto->close();
    $conn->close();
    exit;
}

// Insertar la cita si no hay conflictos
$sql_insert = "INSERT INTO horas (fecha_hora, hora_inicio, hora_fin, paciente, profesional) 
               VALUES (?, ?, ?, ?, ?)";
$stmt_insert = $conn->prepare($sql_insert);

if ($stmt_insert === false) {
    echo json_encode(["status" => "error", "message" => "Error en la consulta de inserción: " . $conn->error]);
    exit;
}

$stmt_insert->bind_param("sssss", $fecha, $hora_inicio, $hora_fin, $paciente_id, $profesional_id);
$stmt_insert->execute();

if ($stmt_insert->affected_rows > 0) {
    echo json_encode(["status" => "success", "message" => "Hora agendada con éxito."]);
} else {
    echo json_encode(["status" => "error", "message" => "Error al agendar la hora: " . $stmt_insert->error]);
}

// Cerrar las conexiones
$stmt_insert->close();
$conn->close();