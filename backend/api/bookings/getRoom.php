<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Content-Type: application/json");

include_once '../../config/database.php';

$room_ID = $_GET['id'] ?? null;

if (!$room_ID) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Mungon ID."]);
    exit;
}

$sql  = "SELECT * FROM Room WHERE room_ID = ? LIMIT 1";
$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "i", $room_ID);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$room   = mysqli_fetch_assoc($result);

if ($room) {
    echo json_encode($room);
} else {
    http_response_code(404);
    echo json_encode(["status" => "error", "message" => "Dhoma nuk u gjet."]);
}
?>
