<?php
ob_start(); // ← SHTO këtë si rresht i parë
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../../config/database.php';

// ❌ Para: type_name dhe room_type_ID
// ✅ Pas: type dhe room_Type_ID (sipas tabelës suaj)
$sql = "SELECT room_Type_ID, type FROM Room_Type";
$result = mysqli_query($conn, $sql);

$types = [];

if ($result && mysqli_num_rows($result) > 0) {
    while($row = mysqli_fetch_assoc($result)) {
        $types[] = $row;
    }
}

echo json_encode([
    "status" => "success",
    "data"   => $types
]);
ob_end_flush();
exit();
?>