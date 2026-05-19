<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

include_once '../../config/database.php';


$sql = "SELECT 
            i.invoice_ID, 
            i.amount as price, 
            i.status, 
            i.invoice_Date as check_In_Date,
            b.booking_ID, 
            u.name as user_name, 
            u.surname as user_surname,
            u.user_ID,
            r.name as room_name
        FROM Invoice i
        INNER JOIN Booking b ON i.booking_ID = b.booking_ID
        INNER JOIN User u ON b.user_ID = u.user_ID
        INNER JOIN Room r ON b.room_ID = r.room_ID
        ORDER BY i.invoice_Date DESC";

$result = mysqli_query($conn, $sql);

if ($result) {
    $invoices = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $invoices[] = $row;
    }

    echo json_encode([
        "status" => "success",
        "data" => $invoices
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Gabim në SQL: " . mysqli_error($conn)
    ]);
}
?>