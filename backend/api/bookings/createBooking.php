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

$data           = json_decode(file_get_contents("php://input"));
$user_ID        = $data->user_ID        ?? null;
$room_ID        = $data->room_ID        ?? null;
$check_in       = $data->check_in       ?? null;
$check_out      = $data->check_out      ?? null;
$total_nights   = $data->total_nights   ?? null;
$total_price    = $data->total_price    ?? null;
$phone          = $data->phone          ?? null;
$payment_method = $data->payment_method ?? 'cash';

// 1. Kontrollo fushat
if (!$user_ID || !$room_ID || !$check_in || !$check_out || !$phone) {
    http_response_code(400);
    echo json_encode([
        "status"  => "error",
        "message" => "Plotësoni të gjitha fushat."
    ]);
    exit;
}

// 2. Kontrollo nëse dhoma është e lirë
$checkAvail = "SELECT booking_ID FROM Booking 
               WHERE room_ID = ? 
               AND status != 'Cancelled'
               AND (check_In_Date < ? AND check_Out_Date > ?)";
$stmt = mysqli_prepare($conn, $checkAvail);
mysqli_stmt_bind_param($stmt, "iss", $room_ID, $check_out, $check_in);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

if (mysqli_fetch_assoc($result)) {
    http_response_code(409);
    echo json_encode([
        "status"  => "error",
        "message" => "Dhoma është e zënë në datat e zgjedhura."
    ]);
    exit;
}

// 3. Krijo Booking
$sql = "INSERT INTO Booking 
        (user_ID, room_ID, booking_Date, check_In_Date, check_Out_Date,
         total_nights, total_price, phone, payment_method, status) 
        VALUES (?, ?, CURDATE(), ?, ?, ?, ?, ?, ?, 'Pending')";

$stmt2 = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt2, "iissidss",
    $user_ID,
    $room_ID,
    $check_in,
    $check_out,
    $total_nights,
    $total_price,
    $phone,
    $payment_method
);

if (mysqli_stmt_execute($stmt2)) {

    // 4. Merr booking_ID të ri
    $booking_ID = mysqli_insert_id($conn);

    // 5. Krijo Invoice automatikisht
    $invoiceSql = "INSERT INTO Invoice 
                   (booking_ID, invoice_Date, status, amount, payment_method) 
                   VALUES (?, CURDATE(), 'Pending', ?, ?)";
    $invoiceStmt = mysqli_prepare($conn, $invoiceSql);
    mysqli_stmt_bind_param($invoiceStmt, "ids",
        $booking_ID,
        $total_price,
        $payment_method
    );
    mysqli_stmt_execute($invoiceStmt);

    // 6. Ndrysho availability të dhomës
    $updateRoom = "UPDATE Room SET availability = 'Occupied' WHERE room_ID = ?";
    $stmt3 = mysqli_prepare($conn, $updateRoom);
    mysqli_stmt_bind_param($stmt3, "i", $room_ID);
    mysqli_stmt_execute($stmt3);

    http_response_code(201);
    echo json_encode([
        "status"  => "success",
        "message" => "Rezervimi u krye me sukses!"
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "status"  => "error",
        "message" => "Ndodhi një gabim: " . mysqli_error($conn)
    ]);
}
?>