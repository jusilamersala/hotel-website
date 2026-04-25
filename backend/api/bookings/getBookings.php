<?php
    include_once '../../config/database.php';
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");

    $id = $_GET['id'] ?? null;

    if (!empty($id)) {
        $sql = "SELECT b.booking_ID, b.user_ID, b.room_ID, b.booking_Date, b.status, b.check_In_Date, b.check_Out_Date, u.name, u.surname, u.email, r.name as room_name FROM Booking b JOIN User u ON b.user_ID = u.user_ID JOIN Room r ON b.room_ID = r.room_ID WHERE b.booking_ID = ?";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "i", $id);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        
        $booking = mysqli_fetch_assoc($result);

        if ($booking) {
            echo json_encode(["status" => "success", "data" => $booking]);
        } else {
            echo json_encode(["status" => "error", "message" => "Booking not found!"]);
        }
        mysqli_stmt_close($stmt);
    } else {
        $sql = "SELECT b.booking_ID, b.user_ID, b.room_ID, b.booking_Date, b.status, b.check_In_Date, b.check_Out_Date, u.name, u.surname, u.email, r.name as room_name FROM Booking b JOIN User u ON b.user_ID = u.user_ID JOIN Room r ON b.room_ID = r.room_ID";
        $result = mysqli_query($conn, $sql);

        if ($result) {
            $bookings = mysqli_fetch_all($result, MYSQLI_ASSOC);
            echo json_encode(["status" => "success", "data" => $bookings]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error: " . mysqli_error($conn)]);
        }
    }
?>