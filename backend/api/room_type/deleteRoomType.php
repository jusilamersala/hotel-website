<?php
    header("Access-Control-Allow-Origin: http://localhost:4200");
    header("Access-Control-Allow-Methods: DELETE, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Content-Type: application/json");

    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit; }

    include_once '../../config/database.php';

    // Marrim ID ose nga URL ose nga Body
    $data = json_decode(file_get_contents("php://input"));
    $id = $data->room_type_id ?? ($_GET['id'] ?? null);

    if (!$id) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "ID nuk u gjet."]);
        exit;
    }

    $sql = "DELETE FROM Room_Type WHERE room_type_id = ?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "i", $id);

    try {
        if (mysqli_stmt_execute($stmt)) {
            if (mysqli_stmt_affected_rows($stmt) > 0) {
                echo json_encode(["status" => "success", "message" => "Lloji i dhomës u fshi."]);
            } else {
                http_response_code(404);
                echo json_encode(["status" => "error", "message" => "Nuk u gjet asnjë rekord me këtë ID."]);
            }
        }
    } catch (mysqli_sql_exception $e) {
        http_response_code(400);
        // Ky është error-i tipik kur tabela prind ka të dhëna në tabela fëmijë
        echo json_encode(["status" => "error", "message" => "Nuk mund të fshihet! Ky lloj dhome është i lidhur me dhoma ose rezervime aktive."]);
    }
?>