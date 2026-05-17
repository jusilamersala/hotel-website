<?php
    header("Access-Control-Allow-Origin: http://localhost:4200");
    header("Content-Type: application/json");

    include_once '../../config/database.php';

    // Kontrollojmë nëse ka një ID në URL (p.sh. getRoomType.php?id=1)
    $id = isset($_GET['id']) ? intval($_GET['id']) : null;

    if ($id) {
        $sql = "SELECT * FROM Room_Type WHERE room_type_id = ?";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "i", $id);
    } else {
        $sql = "SELECT * FROM Room_Type";
        $stmt = mysqli_prepare($conn, $sql);
    }

    if (mysqli_stmt_execute($stmt)) {
        $result = mysqli_stmt_get_result($stmt);
        $data = mysqli_fetch_all($result, MYSQLI_ASSOC);
        echo json_encode(["status" => "success", "data" => $data]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Dështoi marrja e të dhënave."]);
    }
?>