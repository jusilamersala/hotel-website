<?php
// 1. Header-at për CORS dhe Sigurinë
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Trajtimi i kërkesave OPTIONS (E detyrueshme për Angular/PUT)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
    exit;
}

include_once '../../config/database.php';

// Sigurohemi që metoda është PUT (ose POST nëse preferon ashtu në Angular)
if ($_SERVER['REQUEST_METHOD'] !== 'PUT' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Metoda e palejuar."]);
    exit;
}

// 2. Marrja dhe dekodimi i të dhënave
$data = json_decode(file_get_contents("php://input"));

if (!$data || empty($data->room_ID)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "ID e dhomës mungon ose të dhënat janë të pavlefshme!"]);
    exit;
}

// 3. Sanitization dhe Validimi
$room_ID = intval($data->room_ID);
$name = htmlspecialchars(strip_tags(trim($data->name)));
$room_type_ID = intval($data->room_type_ID);
$floor = intval($data->floor);
$description = htmlspecialchars(strip_tags($data->description));
$price = floatval($data->price);
$capacity = intval($data->capacity);
$availability = htmlspecialchars(strip_tags($data->availability));

// Kontrolli për vlera negative/zero
if ($price <= 0 || $capacity <= 0) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Çmimi dhe kapaciteti duhet të jenë pozitivë."]);
    exit;
}

try {
    // 4. Përgatitja e Query-t
    $sql = "UPDATE Room SET name=?, room_type_ID=?, floor=?, description=?, price=?, capacity=?, availability=? WHERE room_ID=?";
    $stmt = mysqli_prepare($conn, $sql);

    if ($stmt) {
        // "siisdisi" -> string, int, int, string, double, int, string, int
        mysqli_stmt_bind_param($stmt, "siisdisi", 
            $name, 
            $room_type_ID, 
            $floor, 
            $description, 
            $price, 
            $capacity, 
            $availability, 
            $room_ID
        );

        if (mysqli_stmt_execute($stmt)) {
            // Kontrollojmë nëse u bë ndonjë ndryshim (affected_rows)
            // Shënim: affected_rows mund të jetë 0 nëse dërgon të njëjtat të dhëna që janë tashmë në DB
            http_response_code(200);
            echo json_encode(["status" => "success", "message" => "Dhoma u përditësua me sukses!"]);
        } else {
            throw new Exception(mysqli_stmt_error($stmt));
        }
        mysqli_stmt_close($stmt);
    } else {
        throw new Exception("SQL prepare failed.");
    }

} catch (mysqli_sql_exception $e) {
    http_response_code(409); // Conflict (psh. FK invalid ose emër i dublikuar)
    echo json_encode(["status" => "error", "message" => "Gabim në databazë: Kontrolloni lidhjet e të dhënave."]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Gabim i serverit: " . $e->getMessage()]);
}

mysqli_close($conn);
?>