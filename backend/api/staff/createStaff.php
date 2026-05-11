<?php
    include_once '../../config/database.php';
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: POST");

    $data = json_decode(file_get_contents("php://input"), true);

    if (!empty($data['name']) && !empty($data['surname']) && !empty($data['email']) && !empty($data['role']) && !empty($data['shift'])) {
        $sql = "INSERT INTO Staff (name, surname, email, role, shift) VALUES (?, ?, ?, ?, ?)";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "sssss", $data['name'], $data['surname'], $data['email'], $data['role'], $data['shift']);
        
        if (mysqli_stmt_execute($stmt)) {
            echo json_encode(["status" => "success", "message" => "Staff created successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error: " . mysqli_stmt_error($stmt)]);
        }
        mysqli_stmt_close($stmt);
    } else {
        echo json_encode(["status" => "error", "message" => "Missing required fields"]);
    }
?>