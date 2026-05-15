<?php
    // Header-at e nevojshëm për CORS
    header("Access-Control-Allow-Origin: http://localhost:4200");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    header("Content-Type: application/json");

    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        http_response_code(204);
        exit;
    }

    include_once '../../config/database.php';

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $data = json_decode(file_get_contents("php://input"));

        $type = $data->type ?? null;
        $description = $data->description ?? null;

        if (empty($type) || empty($description) ) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Të gjitha fushat janë të detyrueshme!"]);
            exit;
        }

        $sql = "INSERT INTO Room_Type (type, description) VALUES (?, ?)";
        $stmt = mysqli_prepare($conn, $sql);
        
        if ($stmt) {
            mysqli_stmt_bind_param($stmt, "ss", $type, $description);

            if (mysqli_stmt_execute($stmt)) {
                http_response_code(201); 
                echo json_encode(["status" => "success", "message" => "Lloji i dhomes u krijua me sukses!"]);
            } else {
                http_response_code(500);
                echo json_encode(["status" => "error", "message" => "Gabim gjatë ruajtjes në databazë."]);
            }
            mysqli_stmt_close($stmt);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "SQL Error: Përgatitja e kërkesës dështoi."]);
        }
    } else {
        http_response_code(405);
        echo json_encode(["status" => "error", "message" => "Metodë e palejuar."]);
    }
?>