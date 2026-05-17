<?php
    header("Access-Control-Allow-Origin: http://localhost:4200");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Content-Type: application/json");

    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit; }

    include_once '../../config/database.php';

    $data = json_decode(file_get_contents("php://input"));

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $id = $data->room_type_id ?? null;
        $type = $data->type ?? null;
        $description = $data->description ?? null;

        // Validimet
        if (empty($id) || empty($type)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "ID dhe Type janë të detyrueshme!"]);
            exit;
        }

        $sql = "UPDATE Room_Type SET type = ?, description = ? WHERE room_type_id = ?";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "ssi", $type, $description, $id);

        if (mysqli_stmt_execute($stmt)) {
            echo json_encode(["status" => "success", "message" => "Lloji i dhomës u përditësua!"]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Gabim gjatë update-it."]);
        }
    }
?>