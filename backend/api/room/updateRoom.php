<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, POST");
header("Content-Type: application/json");
include_once '../../config/database.php';

$data = json_decode(file_get_contents("php://input"));

if (empty($data->room_ID)) {
    echo json_encode(["status" => "error", "message" => "ID e dhomës mungon!"]);
    exit;
}

$sql = "UPDATE Room SET name=?, room_type_ID=?, floor=?, description=?, price=?, capacity=?, availability=? WHERE room_ID=?";
$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "siisdisi", 
    $data->name, $data->room_type_ID, $data->floor, $data->description, 
    $data->price, $data->capacity, $data->availability, $data->room_ID
);

if (mysqli_stmt_execute($stmt)) {
    echo json_encode(["status" => "success", "message" => "Dhoma u përditësua!"]);
} else {
    echo json_encode(["status" => "error", "message" => mysqli_error($conn)]);
}
?>