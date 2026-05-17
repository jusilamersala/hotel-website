<?php
// 1. Header-at e detyrueshëm - Shto localhost:4200 për siguri më të lartë
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Trajto kërkesën "Preflight" të Angular (Browser-i e dërgon para POST)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
    exit;
}

include_once '../../config/database.php';

// Sigurohu që po vjen kërkesë POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Metoda nuk lejohet."]);
    exit;
}

$data = json_decode(file_get_contents("php://input"));

if (!$data) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Të dhëna të pavlefshme JSON."]);
    exit;
}

// 2. Validimi i fushave të detyrueshme dhe Sanitization (Pastrimi)
$name = isset($data->name) ? htmlspecialchars(strip_tags(trim($data->name))) : null;
$room_type_ID = isset($data->room_type_ID) ? intval($data->room_type_ID) : null;
$price = isset($data->price) ? floatval($data->price) : null;
$capacity = isset($data->capacity) ? intval($data->capacity) : null;
$floor = isset($data->floor) ? intval($data->floor) : 0;
$description = isset($data->description) ? htmlspecialchars(strip_tags($data->description)) : "";
$image_url = isset($data->image_url) ? filter_var($data->image_url, FILTER_SANITIZE_URL) : "";

if (empty($name) || empty($room_type_ID) || $price === null || empty($capacity)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Ju lutem plotësoni të gjitha fushat e detyrueshme!"]);
    exit;
}

// 3. Validimi i vlerave logjike
if ($price <= 0 || $capacity <= 0) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Çmimi dhe kapaciteti duhet të jenë numra pozitivë!"]);
    exit;
}

// 4. Ekzekutimi me Try-Catch
try {
    $sql = "INSERT INTO Room (room_type_ID, name, floor, description, image_url, capacity, price, availability) 
            VALUES (?, ?, ?, ?, ?, ?, ?, 'Available')";

    $stmt = mysqli_prepare($conn, $sql);

    if ($stmt) {
        // Kontrollo tipet e lidhjes (i-int, s-string, d-double)
        // Kujdes: Sigurohu që renditja këtu përputhet fiks me renditjen në SQL sipër
        mysqli_stmt_bind_param($stmt, "isisisd", 
            $room_type_ID, 
            $name, 
            $floor, 
            $description, 
            $image_url, 
            $capacity, 
            $price
        );

        if (mysqli_stmt_execute($stmt)) {
            http_response_code(201);
            echo json_encode([
                "status" => "success", 
                "message" => "Dhoma u krijua me sukses!",
                "id" => mysqli_insert_id($conn) // Kthe ID-në e re nëse i duhet Angularit
            ]);
        } else {
            throw new Exception(mysqli_error($conn));
        }
        mysqli_stmt_close($stmt);
    } else {
        throw new Exception("SQL prepare failed.");
    }

} catch (mysqli_sql_exception $e) {
    http_response_code(409); // Conflict (p.sh. emër dhome i dublikuar)
    echo json_encode(["status" => "error", "message" => "Gabim në databazë: Mund të jetë shkelur një rregull (FK ose Unique)."]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Gabim i serverit."]);
}

mysqli_close($conn);
?>