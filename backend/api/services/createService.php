<?php
    include_once '../../config/database.php';

    header("Content-Type: application/json");

    if($_SERVER["REQUEST_METHOD"] == "POST"){
        $data = json_decode(file_get_contents("php://input"));

        $service_Type = $data->service_Type ?? null;
        $service_Price = $data->service_Price ?? null;    
        
        $sql = "INSERT INTO Services (service_Type, service_Price) VALUES (?, ?)";
        $stmt = mysqli_prepare($conn, $sql);
        
        mysqli_stmt_bind_param($stmt, "ss", $service_Type, $service_Price);

        if (mysqli_stmt_execute($stmt)) {
            echo json_encode(["status" => "success", "message" => "Service created succesfuly"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Something went wrong"]);
        }
        
        mysqli_stmt_close($stmt);
    } else {
        echo json_encode(["status" => "error", "message" => "Something went wrong "]);
    }

?>