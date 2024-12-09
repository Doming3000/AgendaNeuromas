<?php
require_once "config.php";

// Obtener los parámetros de fecha desde la solicitud
$fechaSeleccionada = $_GET["fecha"] ?? "";
$fechaInicio = $_GET["start"] ?? "";
$fechaFin = $_GET["end"] ?? "";

// Inicializar el array de respuesta
$eventos = [];

// Consulta SQL para obtener las horas de la tabla horas
$sql = "SELECT horas.id_hora, horas.hora_inicio, horas.hora_fin, 
               pacientes.nombre_pac AS paciente, 
               profesionales.nombre_pro AS profesional, 
               horas.fecha_hora AS fecha 
        FROM horas
        INNER JOIN pacientes ON horas.paciente = pacientes.id_pac
        INNER JOIN profesionales ON horas.profesional = profesionales.id_pro
        WHERE (? <> '' AND DATE(horas.fecha_hora) = ?) 
           OR (? <> '' AND ? <> '' AND DATE(horas.fecha_hora) BETWEEN ? AND ?)";

// Preparar la consulta
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode([
        "status" => "error",
        "message" => "Error en la preparación de la consulta",
    ]);
    exit();
}

// Asignar parámetros para la consulta
$stmt->bind_param("ssssss", $fechaSeleccionada, $fechaSeleccionada, $fechaInicio, $fechaFin, $fechaInicio, $fechaFin);
$stmt->execute();
$result = $stmt->get_result();

// Procesar los resultados
while ($row = $result->fetch_assoc()) {
    $start = $row['fecha'] . 'T' . $row['hora_inicio'];
    $end = $row['fecha'] . 'T' . $row['hora_fin'];
    
    // Estructura del evento
    $evento = [
        'id' => $row['id_hora'],
        'title' => $row['profesional'],
        'start' => $start,
        'end' => $end,
        'allDay' => false
    ];
    
    // Si se pidió una fecha específica, agregamos los datos al array de horas, de lo contrario, es para el calendario
    if (!empty($fechaSeleccionada)) {
        $eventos[] = [
            'hora_inicio' => $row['hora_inicio'],
            'hora_fin' => $row['hora_fin'],
            'paciente' => $row['paciente'],
            'profesional' => $row['profesional']
        ];
    } else {
        $eventos[] = $evento;
    }
}

// Enviar respuesta
if (!empty($fechaSeleccionada)) {
    echo json_encode(["status" => "success", "horas" => $eventos]);
} else {
    echo json_encode($eventos);
}

$stmt->close();
$conn->close();
?>