<?php
ob_start();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE, POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../../config/database.php';

$id = $_GET['id'] ?? null;

if (!$id) {
    parse_str(file_get_contents("php://input"), $deleteVars);
    $id = $deleteVars['id'] ?? null;
}

if ($id) {
    $sql = "DELETE FROM Room WHERE room_ID = ?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "i", $id);

    if (mysqli_stmt_execute($stmt)) {
        // Fshirja ishte me sukses
        http_response_code(200);
        echo json_encode(["status" => "success", "message" => "Dhoma u fshi!"]);
    } else {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Nuk fshihet dot: " . mysqli_stmt_error($stmt)]);
    }
    mysqli_stmt_close($stmt);
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "ID mungon."]);
}

ob_end_flush();
exit();
?>