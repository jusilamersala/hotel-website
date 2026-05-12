<?php
    include_once '../../config/database.php';
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: POST");

    $data = json_decode(file_get_contents("php://input"), true);

    if (!empty($data['room_Type_ID']) && !empty($data['name']) && !empty($data['floor']) && !empty($data['description']) && !empty($data['price'])) {
        $sql = "INSERT INTO Room (room_Type_ID, name, floor, description, price, availability) VALUES (?, ?, ?, ?, ?, 'Available')";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "isisd", $data['room_Type_ID'], $data['name'], $data['floor'], $data['description'], $data['price']);
        
        if (mysqli_stmt_execute($stmt)) {
            echo json_encode(["status" => "success", "message" => "Room created successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error: " . mysqli_stmt_error($stmt)]);
        }
        mysqli_stmt_close($stmt);
    } else {
        echo json_encode(["status" => "error", "message" => "Missing required fields"]);
    }
?>