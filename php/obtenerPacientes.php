<?php
// Incluir el archivo de configuración con los datos de conexión
require_once 'config.php';

// Consulta para obtener los nombres de los pacientes
$sql = "SELECT id_pac, nombre_pac FROM pacientes";
$result = $conn->query($sql);

$pacientes = [];
if ($result->num_rows > 0) {
    // Obtener los resultados y guardarlos en un array
    while ($row = $result->fetch_assoc()) {
        $pacientes[] = ['id' => $row['id_pac'], 'nombre' => $row['nombre_pac']];
    }
    // Devolver los pacientes en formato JSON
    echo json_encode(['status' => 'success', 'pacientes' => $pacientes]);
} else {
    // No se encontraron pacientes
    echo json_encode(['status' => 'error', 'message' => 'No se encontraron pacientes']);
}

// Cerrar la conexión
$conn->close();