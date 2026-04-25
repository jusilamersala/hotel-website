<?php
    include_once '../../config/database.php';
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: DELETE");

    $id = $_GET['id'] ?? null;

    if (!empty($id)) {
        $sql = "DELETE FROM Room WHERE room_ID = ?";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "i", $id);
        
        if (mysqli_stmt_execute($stmt)) {
            echo json_encode(["status" => "success", "message" => "Room deleted successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error: " . mysqli_stmt_error($stmt)]);
        }
        mysqli_stmt_close($stmt);
    } else {
        echo json_encode(["status" => "error", "message" => "Missing ID"]);
    }
?>