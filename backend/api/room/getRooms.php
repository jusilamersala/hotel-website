<?php
// 1. Header-at për CORS dhe Formatimin
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Trajtimi i kërkesave OPTIONS (Preflight)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
    exit;
}

include_once '../../config/database.php';

// 2. Kontrolli i lidhjes me Databazën
if (!$conn) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Lidhja me databazën dështoi."]);
    exit;
}

try {
    // 3. Query për marrjen e të dhënave
    // Këshillë: Mund të përdorësh JOIN nëse dëshiron të marrësh emrin e Room_Type në vend të ID-së
    $sql = "SELECT * FROM Room ORDER BY room_ID DESC"; 
    $result = mysqli_query($conn, $sql);

    if ($result) {
        $rooms = [];

        // 4. Përpunimi i rreshtave
        while($row = mysqli_fetch_assoc($result)) {
            // Sigurohemi që numrat të kthehen si numra (PHP i kthen shpesh si string nga DB)
            $row['room_ID'] = (int)$row['room_ID'];
            $row['room_type_ID'] = (int)$row['room_type_ID'];
            $row['price'] = (float)$row['price'];
            $row['capacity'] = (int)$row['capacity'];
            $row['floor'] = (int)$row['floor'];
            
            $rooms[] = $row;
        }

        // 5. Përgjigjja e suksesshme
        http_response_code(200);
        // Kthejmë një objekt me status për konsistencë në Angular
        echo json_encode([
            "status" => "success",
            "count" => count($rooms),
            "data" => $rooms
        ]);

    } else {
        throw new Exception(mysqli_error($conn));
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error", 
        "message" => "Gabim gjatë marrjes së të dhënave: " . $e->getMessage()
    ]);
} finally {
    mysqli_close($conn);
}
?>