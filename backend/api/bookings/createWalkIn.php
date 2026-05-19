<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
    exit;
}

include_once '../../config/database.php';

$data = json_decode(file_get_contents("php://input"));

$check_In_Date    = $data->check_In_Date    ?? null;
$check_Out_Date   = $data->check_Out_Date   ?? null;
$price            = isset($data->price)         ? (int)$data->price         : null; 
$status           = $data->status           ?? 'Confirmed';

if (!$check_In_Date || !$check_Out_Date || !$price) {
    http_response_code(400);
    echo json_encode([
        "status"  => "error",
        "message" => "Të dhënat janë të paplota (Datat dhe Çmimi)."
    ]);
    exit;
}

try {
    // 1. Gjejmë automatikisht ID-në e një përdoruesi ekzistues
    $userQuery = "SELECT user_ID FROM User LIMIT 1";
    $userResult = mysqli_query($conn, $userQuery);
    $userRow = mysqli_fetch_assoc($userResult);
    
    if (!$userRow) {
        throw new Exception("Nuk u gjet asnjë përdorues në tabelën User.");
    }
    $user_ID = (int)$userRow['user_ID'];

    // 2. Gjejmë automatikisht ID-në e një dhome ekzistuese
    $roomQuery = "SELECT room_ID FROM Room LIMIT 1";
    $roomResult = mysqli_query($conn, $roomQuery);
    $roomRow = mysqli_fetch_assoc($roomResult);
    
    if (!$roomRow) {
        throw new Exception("Nuk u gjet asnjë dhomë në tabelën Room.");
    }
    $room_ID = (int)$roomRow['room_ID'];


    // 3. Hoqëm fushat problematike të shërbimeve, duke lënë vetëm kolonat bazë që ekzistojnë 100%
    $sql = "INSERT INTO Booking 
            (user_ID, room_ID, check_In_Date, check_Out_Date, total_price, status) 
            VALUES (?, ?, ?, ?, ?, ?)";

    $stmt = mysqli_prepare($conn, $sql);
    
    if (!$stmt) {
        throw new Exception("Gabim në SQL: " . mysqli_error($conn));
    }
    
    // i = int, s = string
    // user_ID(i), room_ID(i), check_In_Date(s), check_Out_Date(s), total_price(i), status(s)
    mysqli_stmt_bind_param($stmt, "iissis", 
        $user_ID, 
        $room_ID, 
        $check_In_Date, 
        $check_Out_Date, 
        $price, 
        $status
    );

    if (mysqli_stmt_execute($stmt)) {
        http_response_code(201);
        echo json_encode([
            "status"  => "success",
            "message" => "Klienti Walk-In u regjistrua me sukses!"
        ]);
    } else {
        throw new Exception(mysqli_stmt_error($stmt));
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status"  => "error",
        "message" => "Gabim i brendshëm: " . $e->getMessage()
    ]);
}

mysqli_close($conn);
?>