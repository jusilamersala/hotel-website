<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';

// 1. Merr të dhënat nga kërkesa
$data = json_decode(file_get_contents("php://input"));

// 2. Validimi fillestar: Kontrollojmë nëse fushat janë bosh
if (
    empty($data->name) || 
    empty($data->room_type_ID) || 
    !isset($data->price) || 
    empty($data->capacity)
) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Ju lutem plotësoni të gjitha fushat e detyrueshme!"]);
    exit;
}

// 3. Validimi i vlerave (p.sh. çmimi nuk mund të jetë negativ)
if ($data->price <= 0 || $data->capacity <= 0) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Çmimi dhe kapaciteti duhet të jenë numra pozitivë!"]);
    exit;
}

// 4. Përgatitja e Query-t me Prepared Statements (Mbron nga SQL Injection)
$sql = "INSERT INTO Room (room_type_ID, name, floor, description, image_url, capacity, price, availability) 
        VALUES (?, ?, ?, ?, ?, ?, ?, 'Available')";

$stmt = mysqli_prepare($conn, $sql);

if ($stmt) {
    // Lidhim parametrat (i - integer, s - string, d - double/float)
    mysqli_stmt_bind_param($stmt, "isisisd", 
        $data->room_type_ID, 
        $data->name, 
        $data->floor, 
        $data->description, 
        $data->image_url, 
        $data->capacity, 
        $data->price
    );

    if (mysqli_stmt_execute($stmt)) {
        http_response_code(201);
        echo json_encode(["status" => "success", "message" => "Dhoma u krijua me sukses!"]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Gabim gjatë ekzekutimit: " . mysqli_error($conn)]);
    }
    mysqli_stmt_close($stmt);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Gabim në përgatitjen e databazës."]);
}
?>