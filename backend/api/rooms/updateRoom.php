<?php
    include_once '../../config/database.php';
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: PUT");

    $data = json_decode(file_get_contents("php://input"), true);
    $id = $_GET['id'] ?? null;

    if (!empty($id) && !empty($data['room_Type_ID']) && !empty($data['name']) && !empty($data['floor']) && !empty($data['description']) && !empty($data['price']) && !empty($data['availability'])) {
        $sql = "UPDATE Room SET room_Type_ID = ?, name = ?, floor = ?, description = ?, price = ?, availability = ? WHERE room_ID = ?";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "isisdsi", $data['room_Type_ID'], $data['name'], $data['floor'], $data['description'], $data['price'], $data['availability'], $id);
        
        if (mysqli_stmt_execute($stmt)) {
            echo json_encode(["status" => "success", "message" => "Room updated successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error: " . mysqli_stmt_error($stmt)]);
        }
        mysqli_stmt_close($stmt);
    } else {
        echo json_encode(["status" => "error", "message" => "Missing required fields or ID"]);
    }
?>