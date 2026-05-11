<?php
    include_once '../../config/database.php';
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: PUT");

    $data = json_decode(file_get_contents("php://input"), true);
    $id = $_GET['id'] ?? null;

    if (!empty($id) && !empty($data['name']) && !empty($data['surname']) && !empty($data['email']) && !empty($data['role']) && !empty($data['shift'])) {
        $sql = "UPDATE Staff SET name = ?, surname = ?, email = ?, role = ?, shift = ? WHERE staff_ID = ?";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "sssssi", $data['name'], $data['surname'], $data['email'], $data['role'], $data['shift'], $id);
        
        if (mysqli_stmt_execute($stmt)) {
            echo json_encode(["status" => "success", "message" => "Staff updated successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error: " . mysqli_stmt_error($stmt)]);
        }
        mysqli_stmt_close($stmt);
    } else {
        echo json_encode(["status" => "error", "message" => "Missing required fields or ID"]);
    }
?>