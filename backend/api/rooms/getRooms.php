<?php
    include_once '../../config/database.php';
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");

    $id = $_GET['id'] ?? null;

    if (!empty($id)) {
        $sql = "SELECT r.room_ID, r.name, r.floor, r.description, r.price, r.availability, rt.type as room_type FROM Room r JOIN Room_Type rt ON r.room_Type_ID = rt.room_Type_ID WHERE r.room_ID = ?";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "i", $id);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        
        $room = mysqli_fetch_assoc($result);

        if ($room) {
            echo json_encode(["status" => "success", "data" => $room]);
        } else {
            echo json_encode(["status" => "error", "message" => "Room not found!"]);
        }
        mysqli_stmt_close($stmt);
    } else {
        $sql = "SELECT r.room_ID, r.name, r.floor, r.description, r.price, r.availability, rt.type as room_type FROM Room r JOIN Room_Type rt ON r.room_Type_ID = rt.room_Type_ID";
        $result = mysqli_query($conn, $sql);

        if ($result) {
            $rooms = mysqli_fetch_all($result, MYSQLI_ASSOC);
            echo json_encode(["status" => "success", "data" => $rooms]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error: " . mysqli_error($conn)]);
        }
    }
?>