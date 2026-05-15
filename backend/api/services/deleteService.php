<?php
include_once '../../config/database.php';
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: DELETE, POST");

    $data = json_decode(file_get_contents("php://input"));

    $id = $data->service_ID ?? $_GET['id'] ?? null;

    if ($_SERVER["REQUEST_METHOD"] == "DELETE" || $_SERVER["REQUEST_METHOD"] == "POST") {

        if (!empty($id)) {
            $sql = "DELETE FROM Services WHERE service_ID = ?";
            
            $stmt = mysqli_prepare($conn, $sql);
            mysqli_stmt_bind_param($stmt, "i", $id); 

            if (mysqli_stmt_execute($stmt)) {
                if (mysqli_stmt_affected_rows($stmt) > 0) {
                    echo json_encode(["status" => "success", "message" => "Service deleted!"]);
                } else {
                    echo json_encode(["status" => "error", "message" => "Service not found"]);
                }
            } else {
                echo json_encode(["status" => "error", "message" => "Error: " . mysqli_error($conn)]);
            }

            mysqli_stmt_close($stmt);
        } else {
            echo json_encode(["status" => "error", "message" => "Service ID is missing"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Error!"]);
    }
?>