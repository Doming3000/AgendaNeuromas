<?php
require_once 'config.php';

// Consulta para obtener los nombres de los profesionales
$sql = "SELECT id_pro, nombre_pro FROM profesionales";
$result = $conn->query($sql);

$profesionales = [];
if ($result->num_rows > 0) {
    // Obtener los resultados y guardarlos en un array
    while ($row = $result->fetch_assoc()) {
        $profesionales[] = ['id' => $row['id_pro'], 'nombre' => $row['nombre_pro']];
    }
    // Devolver los profesionales en formato JSON
    echo json_encode(['status' => 'success', 'profesionales' => $profesionales]);
} else {
    // No se encontraron profesionales
    echo json_encode(['status' => 'error', 'message' => 'No se encontraron profesionales']);
}

// Cerrar la conexión
$conn->close();