<?php
include_once '../../config/database.php';
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: PUT, POST");

$data = json_decode(file_get_contents("php://input"));

if ($_SERVER["REQUEST_METHOD"] == "POST" || $_SERVER["REQUEST_METHOD"] == "PUT") {
    
    $id = $data->user_ID ?? null;
    $name = $data->name ?? null;
    $surname = $data->surname ?? null;
    $email = $data->email ?? null;
    $role = $data->role ?? null;

    if (!empty($id)) {
        $sql = "UPDATE User SET name = ?, surname = ?, email = ?, role = ? WHERE user_ID = ?";
        
        if ($stmt = mysqli_prepare($conn, $sql)) {
            mysqli_stmt_bind_param($stmt, "ssssi", $name, $surname, $email, $role, $id);

            if (mysqli_stmt_execute($stmt)) {
                echo json_encode(["status" => "success", "message" => "User updated!"]);
            } else {
                echo json_encode(["status" => "error", "message" => "Error: " . mysqli_error($conn)]);
            }
            mysqli_stmt_close($stmt);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "User ID is required for update."]);
    }
}
?>