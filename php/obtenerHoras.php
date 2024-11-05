<?php
require_once "config.php";

// Obtener la fecha desde la solicitud
$fechaSeleccionada = $_GET["fecha"] ?? "";

// Consultar las horas mediante inner join para el día especificado, usando la columna `fecha_hora` 
$sql = "SELECT horas.hora_inicio, horas.hora_fin, pacientes.nombre_pac AS paciente, profesionales.nombre_pro AS profesional 
    FROM horas
    INNER JOIN pacientes ON horas.paciente = pacientes.id_pac
    INNER JOIN profesionales ON horas.profesional = profesionales.id_pro
    WHERE DATE(horas.fecha_hora) = ?";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode([
        "status" => "error",
        "message" => "Error en la preparación de la consulta",
    ]);
    exit();
}

$stmt->bind_param("s", $fechaSeleccionada);
$stmt->execute();

$result = $stmt->get_result();
$horas = [];

while ($row = $result->fetch_assoc()) {
    $horas[] = $row;
}

echo json_encode(["status" => "success", "horas" => $horas]);

$stmt->close();
$conn->close();