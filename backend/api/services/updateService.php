<?php
include_once '../../config/database.php';
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: PUT, POST");

$data = json_decode(file_get_contents("php://input"));

if ($_SERVER["REQUEST_METHOD"] == "POST" || $_SERVER["REQUEST_METHOD"] == "PUT") {
    
    $id = $data->service_ID ?? null;
    $service_type = $data->service_Type ?? null;
    $service_Price = $data->service_Price ?? null;
   

    if (!empty($id)) {
        $sql = "UPDATE Services SET service_Type = ?, service_Price = ? WHERE service_ID = ?";
        
        if ($stmt = mysqli_prepare($conn, $sql)) {
            mysqli_stmt_bind_param($stmt, "ssi", $service_type, $service_Price, $id);

            if (mysqli_stmt_execute($stmt)) {
                echo json_encode(["status" => "success", "message" => "Service updated!"]);
            } else {
                echo json_encode(["status" => "error", "message" => "Error: " . mysqli_error($conn)]);
            }
            mysqli_stmt_close($stmt);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Service ID is required for update."]);
    }
}
?>