<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
    exit;
}

include_once '../../config/database.php';

$id = $_GET['id'] ?? null;

if (empty($id)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Mungon ID."]);
    exit;
}


$deleteInvoice = "DELETE FROM Invoice WHERE booking_ID = ?";
$stmt_invoice  = mysqli_prepare($conn, $deleteInvoice);
mysqli_stmt_bind_param($stmt_invoice, "i", $id);
mysqli_stmt_execute($stmt_invoice);
mysqli_stmt_close($stmt_invoice);

// 1. Merr room_ID para se të fshijë — për të kthyer availability
$getRoom = "SELECT room_ID FROM Booking WHERE booking_ID = ?";
$stmt0   = mysqli_prepare($conn, $getRoom);
mysqli_stmt_bind_param($stmt0, "i", $id);
mysqli_stmt_execute($stmt0);
$result  = mysqli_stmt_get_result($stmt0);
$booking = mysqli_fetch_assoc($result);

if (!$booking) {
    http_response_code(404);
    echo json_encode(["status" => "error", "message" => "Rezervimi nuk u gjet."]);
    exit;
}

$room_ID = $booking['room_ID'];

// 2. Fshi booking-un
$sql  = "DELETE FROM Booking WHERE booking_ID = ?";
$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "i", $id);

if (mysqli_stmt_execute($stmt)) {

    // 3. Kthe dhomën në Available
    $updateRoom = "UPDATE Room SET availability = 'Available' WHERE room_ID = ?";
    $stmt2      = mysqli_prepare($conn, $updateRoom);
    mysqli_stmt_bind_param($stmt2, "i", $room_ID);
    mysqli_stmt_execute($stmt2);

    echo json_encode([
        "status"  => "success",
        "message" => "Rezervimi u fshi me sukses."
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "status"  => "error",
        "message" => "Gabim: " . mysqli_stmt_error($stmt)
    ]);
}

mysqli_stmt_close($stmt);
?>