<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: GET");

include_once '../../config/database.php';

$id = $_GET['id'] ?? null;

if (!empty($id)) {
    $sql = "SELECT 
                b.booking_ID,
                b.user_ID,
                b.room_ID,
                b.booking_Date,
                b.status,
                b.check_In_Date,
                b.check_Out_Date,
                b.total_nights,
                b.total_price,
                b.phone,
                b.payment_method,
                b.booking_Date,
                u.name,
                u.surname,
                u.email,
                r.name AS room_name,
                r.price AS room_price,
                r.image_url,
                r.floor,
                r.capacity
            FROM Booking b
            JOIN User u ON b.user_ID = u.user_ID
            JOIN Room r ON b.room_ID = r.room_ID
            WHERE b.booking_ID = ?";

    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "i", $id);
    mysqli_stmt_execute($stmt);
    $result  = mysqli_stmt_get_result($stmt);
    $booking = mysqli_fetch_assoc($result);

    if ($booking) {
        echo json_encode(["status" => "success", "data" => $booking]);
    } else {
        http_response_code(404);
        echo json_encode(["status" => "error", "message" => "Rezervimi nuk u gjet!"]);
    }
    mysqli_stmt_close($stmt);

} else {
    // Merr të gjitha bookings
    $sql = "SELECT 
                b.booking_ID,
                b.user_ID,
                b.room_ID,
                b.booking_Date,
                b.status,
                b.check_In_Date,
                b.check_Out_Date,
                b.total_nights,
                b.total_price,
                b.phone,
                b.payment_method,
                b.booking_Date,
                u.name,
                u.surname,
                u.email,
                r.name AS room_name,
                r.price AS room_price,
                r.image_url,
                r.floor,
                r.capacity
            FROM Booking b
            JOIN User u ON b.user_ID = u.user_ID
            JOIN Room r ON b.room_ID = r.room_ID
            ORDER BY b.booking_Date DESC";

    $result = mysqli_query($conn, $sql);

    if ($result) {
        $bookings = mysqli_fetch_all($result, MYSQLI_ASSOC);
        echo json_encode(["status" => "success", "data" => $bookings]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => mysqli_error($conn)]);
    }
}
?>