<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
    exit;
}

include_once '../../config/database.php';

$data = json_decode(file_get_contents("php://input"), true);
$id   = $_GET['id'] ?? null;

if (empty($id)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Mungon ID."]);
    exit;
}

// Merr fushat që duhen përditësuar
$status         = $data['status']         ?? null;
$check_in       = $data['check_In_Date']  ?? null;
$check_out      = $data['check_Out_Date'] ?? null;
$total_nights   = $data['total_nights']   ?? null;
$total_price    = $data['total_price']    ?? null;
$phone          = $data['phone']          ?? null;
$payment_method = $data['payment_method'] ?? null;

// Duhet të ketë të paktën një fushë
if (!$status && !$check_in && !$check_out && !$phone && !$payment_method) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Nuk ka asnjë fushë për të përditësuar."]);
    exit;
}

// Ndërto query dinamike bazuar në fushat e dërguara
$fields = [];
$types  = "";
$values = [];

if ($status) {
    $fields[] = "status = ?";
    $types   .= "s";
    $values[] = $status;

    // Nëse status → Confirmed, ndrysho Room në Occupied
    // Nëse status → Cancelled, kthe Room në Available
}

if ($check_in) {
    $fields[] = "check_In_Date = ?";
    $types   .= "s";
    $values[] = $check_in;
}

if ($check_out) {
    $fields[] = "check_Out_Date = ?";
    $types   .= "s";
    $values[] = $check_out;
}

if ($total_nights) {
    $fields[] = "total_nights = ?";
    $types   .= "i";
    $values[] = $total_nights;
}

if ($total_price) {
    $fields[] = "total_price = ?";
    $types   .= "d";
    $values[] = $total_price;
}

if ($phone) {
    $fields[] = "phone = ?";
    $types   .= "s";
    $values[] = $phone;
}

if ($payment_method) {
    $fields[] = "payment_method = ?";
    $types   .= "s";
    $values[] = $payment_method;
}

// Shto ID në fund
$types   .= "i";
$values[] = $id;

$sql  = "UPDATE Booking SET " . implode(", ", $fields) . " WHERE booking_ID = ?";
$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, $types, ...$values);

if (mysqli_stmt_execute($stmt)) {

    // Ndrysho availability të dhomës bazuar në status
    if ($status) {
        $availability = match($status) {
            'Confirmed'  => 'Occupied',
            'Cancelled'  => 'Available',
            default      => null
        };

        if ($availability) {
            // Merr room_ID
            $getRoom = "SELECT room_ID FROM Booking WHERE booking_ID = ?";
            $stmt2   = mysqli_prepare($conn, $getRoom);
            mysqli_stmt_bind_param($stmt2, "i", $id);
            mysqli_stmt_execute($stmt2);
            $result  = mysqli_stmt_get_result($stmt2);
            $booking = mysqli_fetch_assoc($result);

            if ($booking) {
                $updateRoom = "UPDATE Room SET availability = ? WHERE room_ID = ?";
                $stmt3      = mysqli_prepare($conn, $updateRoom);
                mysqli_stmt_bind_param($stmt3, "si", $availability, $booking['room_ID']);
                mysqli_stmt_execute($stmt3);
            }
        }
    }

    echo json_encode([
        "status"  => "success",
        "message" => "Rezervimi u përditësua me sukses."
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