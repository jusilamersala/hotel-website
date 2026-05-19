<?php
ob_start();
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../../config/database.php';

$room_ID = null;
if (!empty($_GET['id'])) {
    $room_ID = intval($_GET['id']);
}

$data = json_decode(file_get_contents("php://input"));

if ($data && empty($room_ID) && !empty($data->room_ID)) {
    $room_ID = intval($data->room_ID);
}

if (!$room_ID) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "ID e dhomës mungon!"]);
    exit;
}

// 1. MARRIM TË DHËNAT EKZISTUESE TË DHOMËS NGA DATABAZA SI SIGURIM
$query_current = "SELECT * FROM Room WHERE room_ID = ?";
$stmt_curr = mysqli_prepare($conn, $query_current);
mysqli_stmt_bind_param($stmt_curr, "i", $room_ID);
mysqli_stmt_execute($stmt_curr);
$res_curr = mysqli_stmt_get_result($stmt_curr);
$current_room = mysqli_fetch_assoc($res_curr);
mysqli_stmt_close($stmt_curr);

if (!$current_room) {
    http_response_code(404);
    echo json_encode(["status" => "error", "message" => "Dhoma nuk u gjet!"]);
    exit;
}

// Përcaktojmë vlerat bazë
$room_Type_ID = (!empty($data->room_Type_ID)) ? intval($data->room_Type_ID) : intval($current_room['room_Type_ID']);
$floor = (isset($data->floor) && $data->floor !== '') ? intval($data->floor) : intval($current_room['floor']);
$description = (isset($data->description) && $data->description !== '') ? $data->description : $current_room['description'];
$price = (isset($data->price) && $data->price !== '') ? floatval($data->price) : floatval($current_room['price']);
$capacity = (isset($data->capacity) && $data->capacity !== '') ? intval($data->capacity) : intval($current_room['capacity']);
$availability = (isset($data->availability) && $data->availability !== '')
    ? $data->availability
    : $current_room['availability'];

// 2. LOGJIKA E RE: MARRIM EMRI NGA TABELA E TIPI TË DHOMËS PËRMES F_KEY
$name = $current_room['name']; // Vlerë rezerve në rast dështimi
$query_type = "SELECT type FROM Room_Type WHERE room_Type_ID = ?";
$stmt_type = mysqli_prepare($conn, $query_type);
if ($stmt_type) {
    mysqli_stmt_bind_param($stmt_type, "i", $room_Type_ID);
    mysqli_stmt_execute($stmt_type);
    $res_type = mysqli_stmt_get_result($stmt_type);
    $type_data = mysqli_fetch_assoc($res_type);
    mysqli_stmt_close($stmt_type);

    if ($type_data) {
        $room_number = ($room_ID < 10) ? "0" . $room_ID : $room_ID;
        $name = $type_data['type'] . " " . $floor . $room_number;
    }
}

// 3. KRYEJMË UPDATE-IN ME EMRI E RI AUTOMATIK
$sql = "UPDATE Room SET name=?, room_Type_ID=?, floor=?, description=?, price=?, capacity=?, availability=? WHERE room_ID=?";
$stmt = mysqli_prepare($conn, $sql);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Gabim në SQL: " . mysqli_error($conn)]);
    exit;
}

mysqli_stmt_bind_param($stmt, "siisdisi",
    $name,
    $room_Type_ID,
    $floor,
    $description,
    $price,
    $capacity,
    $availability,
    $room_ID
);

if (mysqli_stmt_execute($stmt)) {
    http_response_code(200);
    echo json_encode(["status" => "success", "message" => "Dhoma u përditësua me emrin automatik!"]);
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => mysqli_stmt_error($stmt)]);
}

mysqli_stmt_close($stmt);
ob_end_flush();
exit();
?>