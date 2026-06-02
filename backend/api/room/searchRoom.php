<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';

$checkin  = isset($_GET['checkin']) ? $_GET['checkin'] : null;
$checkout = isset($_GET['checkout']) ? $_GET['checkout'] : null;
$capacity = isset($_GET['capacity']) ? (int)$_GET['capacity'] : 1;

if (!$checkin || !$checkout) {
    echo json_encode(["message" => "Ju lutem zgjidhni datat."]);
    exit;
}

$sql = "SELECT * FROM Room r 
        WHERE r.capacity = ? 
        AND NOT EXISTS (
            SELECT 1 FROM Booking b 
            WHERE b.room_id = r.room_id 
            AND b.status != 'Cancelled'
            AND b.check_In_Date < ? 
            AND b.check_Out_Date > ?
        )";

try {
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("iss", $capacity, $checkout, $checkin);
    $stmt->execute();
    $result = $stmt->get_result();

    $rooms = [];
    while($row = $result->fetch_assoc()) {
        $rooms[] = $row;
    }

    echo json_encode($rooms);
} catch (mysqli_sql_exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>