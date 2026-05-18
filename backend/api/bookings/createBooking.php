<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Trajtimi i kërkesës OPTIONS (CORS Preflight)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
    exit;
}

include_once '../../config/database.php';

// Marrja e të dhënave nga Angular
$data = json_decode(file_get_contents("php://input"));

$user_ID        = $data->user_ID        ?? null;
$room_ID        = $data->room_ID        ?? null;
$check_in       = $data->check_in       ?? null;
$check_out      = $data->check_out      ?? null;
$total_nights   = $data->total_nights   ?? null;
$total_price    = $data->total_price    ?? null;
$phone          = $data->phone          ?? null;
$payment_method = $data->payment_method ?? 'cash';
// Shërbimet ekstra që vijnë si string nga Angular
$extra_services = $data->services       ?? ''; 

// 1. Kontrolli i fushave të detyrueshme
if (!$user_ID || !$room_ID || !$check_in || !$check_out || !$phone) {
    http_response_code(400);
    echo json_encode([
        "status"  => "error",
        "message" => "Të dhënat janë të paplota."
    ]);
    exit;
}

// Nisim transaksionin për siguri maksimale
mysqli_begin_transaction($conn);

try {
    // 2. Kontrollo nëse dhoma është e lirë për këto data
    $checkAvail = "SELECT booking_ID FROM Booking 
                   WHERE room_ID = ? 
                   AND status != 'Cancelled'
                   AND (check_In_Date < ? AND check_Out_Date > ?)";
    
    $stmt = mysqli_prepare($conn, $checkAvail);
    mysqli_stmt_bind_param($stmt, "iss", $room_ID, $check_out, $check_in);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    if (mysqli_fetch_assoc($result)) {
        throw new Exception("Dhoma është e zënë në këto data.");
    }

    // 3. Krijojmë rezervimin në tabelën Booking
    // Shtova kolonën 'services' nëse e ke në tabelë, nëse jo mund ta heqësh
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
    mysqli_stmt_execute($stmt2);

    // 4. Marrim ID-në e rezervimit të sapokrijuar
    $booking_ID = mysqli_insert_id($conn);

    // 5. Krijojmë faturën automatikisht në tabelën Invoice
    $invoiceSql = "INSERT INTO Invoice (booking_ID, invoice_Date, status, amount) 
                   VALUES (?, CURDATE(), 'Pending', ?)";
    $invoiceStmt = mysqli_prepare($conn, $invoiceSql);
    mysqli_stmt_bind_param($invoiceStmt, "id", $booking_ID, $total_price);
    mysqli_stmt_execute($invoiceStmt);

    // 6. Përditësojmë disponueshmërinë e dhomës
    $updateRoom = "UPDATE Room SET availability = 'Occupied' WHERE room_ID = ?";
    $stmt3 = mysqli_prepare($conn, $updateRoom);
    mysqli_stmt_bind_param($stmt3, "i", $room_ID);
    mysqli_stmt_execute($stmt3);

    // Nëse çdo gjë shkoi mirë, ruajmë ndryshimet përfundimisht
    mysqli_commit($conn);

    http_response_code(201);
    echo json_encode([
        "status"  => "success",
        "message" => "Rezervimi dhe fatura u krijuan me sukses!"
    ]);

} catch (Exception $e) {
    // Në rast gabimi, anulojmë të gjitha veprimet (Rollback)
    mysqli_rollback($conn);
    http_response_code(500);
    echo json_encode([
        "status"  => "error",
        "message" => $e->getMessage()
    ]);
}

mysqli_close($conn);
?>