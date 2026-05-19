<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: GET");

// Fikim shfaqjen e gabimeve si HTML që të mos bllokojmë Angularin, i kapim me try-catch
ini_set('display_errors', 0);
error_reporting(E_ALL);

include_once '../../config/database.php';

$id = $_GET['id'] ?? null;

try {
    if (!empty($id)) {
        // 1. Marrja e një rezervimi specifik
        $sql = "SELECT 
                    b.booking_ID,
                    b.user_ID,
                    b.room_ID,
                    b.status,
                    b.check_In_Date,
                    b.check_Out_Date,
                    b.total_price,
                    u.name,
                    u.surname,
                    r.name AS room_name
                FROM Booking b
                JOIN User u ON b.user_ID = u.user_ID
                JOIN Room r ON b.room_ID = r.room_ID
                WHERE b.booking_ID = ?";

        $stmt = mysqli_prepare($conn, $sql);
        if (!$stmt) {
            throw new Exception("Gabim në përgatitjen e Query 1: " . mysqli_error($conn));
        }
        mysqli_stmt_bind_param($stmt, "i", $id);
        mysqli_stmt_execute($stmt);
        $result  = mysqli_stmt_get_result($stmt);
        $booking = mysqli_fetch_assoc($result);

        echo json_encode(["status" => "success", "data" => $booking]);
        if ($stmt) mysqli_stmt_close($stmt);

    } else {
        // 2. Marrja e të gjitha rezervimeve aktive (Heqëm kolonat e dyshimta si total_nights, phone, created_at)
        $sql = "SELECT 
                    b.booking_ID,
                    b.user_ID,
                    b.room_ID,
                    b.status,
                    b.check_In_Date,
                    b.check_Out_Date,
                    b.total_price,
                    u.name,
                    u.surname,
                    r.name AS room_name
                FROM Booking b
                JOIN User u ON b.user_ID = u.user_ID
                JOIN Room r ON b.room_ID = r.room_ID
                WHERE b.status != 'Cancelled'
                ORDER BY b.booking_ID DESC";

        $result = mysqli_query($conn, $sql);

        if (!$result) {
            throw new Exception("Gabim në ekzekutimin e Query 2: " . mysqli_error($conn));
        }

        $bookings = mysqli_fetch_all($result, MYSQLI_ASSOC);
        echo json_encode(["status" => "success", "data" => $bookings]);
    }
} catch (Exception $e) {
    // Nëse ndodh gabim, kthejmë JSON të saktë që Angular ta printojë në Console e të mos dështojë me "<br />"
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Gabim nga Databaza: " . $e->getMessage()
    ]);
}
mysqli_close($conn);
?>