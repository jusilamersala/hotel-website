<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../../config/database.php';

$data = json_decode(file_get_contents("php://input"));

// 1. Validimi
if (empty($data->room_Type_ID) || !isset($data->price) || empty($data->capacity)) {
    http_response_code(400);
    echo json_encode([
        "status"  => "error",
        "message" => "Tipi dhe çmimi janë të detyrueshme."
    ]);
    exit;
}

if ($data->price <= 0 || $data->capacity <= 0) {
    http_response_code(400);
    echo json_encode([
        "status"  => "error",
        "message" => "Çmimi dhe kapaciteti duhet të jenë pozitivë."
    ]);
    exit;
}

// 2. Merr emrin e tipit nga Room_Type
$query_type = "SELECT type FROM Room_Type WHERE room_Type_ID = ?";
$stmt_type  = mysqli_prepare($conn, $query_type);
mysqli_stmt_bind_param($stmt_type, "i", $data->room_Type_ID);
mysqli_stmt_execute($stmt_type);
$res_type  = mysqli_stmt_get_result($stmt_type);
$type_data = mysqli_fetch_assoc($res_type);
mysqli_stmt_close($stmt_type);

if (!$type_data) {
    http_response_code(404);
    echo json_encode([
        "status"  => "error",
        "message" => "Tipi i dhomës nuk u gjet."
    ]);
    exit;
}

// 3. Merr vlerat
$room_Type_ID = intval($data->room_Type_ID);
$floor        = isset($data->floor)       ? intval($data->floor)       : 0;
$description  = isset($data->description) ? $data->description         : '';
$image_url    = isset($data->image_url)   ? $data->image_url           : '';
$capacity     = intval($data->capacity);
$price        = floatval($data->price);
$availability = isset($data->availability) ? $data->availability : 'Available';

// 4. INSERT fillimisht pa emër
$sql  = "INSERT INTO Room 
         (room_Type_ID, name, floor, description, image_url, capacity, price, availability) 
         VALUES (?, '', ?, ?, ?, ?, ?, ?)";
$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "iissdis",
    $room_Type_ID,
    $floor,
    $description,
    $image_url,
    $capacity,
    $price,
    $availability
);

if (mysqli_stmt_execute($stmt)) {

    // 5. Merr room_ID të ri
    $new_room_ID = mysqli_insert_id($conn);

    // 6. Gjenero emrin automatik: "Single 201"
    $room_number = ($new_room_ID < 10) ? "0" . $new_room_ID : $new_room_ID;
    $name        = $type_data['type'] . " " . $floor . $room_number;

    // 7. UPDATE emrin
    $update = "UPDATE Room SET name = ? WHERE room_ID = ?";
    $stmt2  = mysqli_prepare($conn, $update);
    mysqli_stmt_bind_param($stmt2, "si", $name, $new_room_ID);
    mysqli_stmt_execute($stmt2);
    mysqli_stmt_close($stmt2);

    http_response_code(201);
    echo json_encode([
        "status"  => "success",
        "message" => "Dhoma u shtua me sukses!",
        "room_ID" => $new_room_ID,
        "name"    => $name
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "status"  => "error",
        "message" => "Gabim: " . mysqli_error($conn)
    ]);
}

mysqli_stmt_close($stmt);
exit();
?>