<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE, GET");
include_once '../../config/database.php';

$id = $_GET['id'];

if ($id) {
    $sql = "DELETE FROM Room WHERE room_ID = ?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "i", $id);
    
    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(["status" => "success", "message" => "Dhoma u fshi!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Nuk fshihet dot (ka lidhje aktive)."]);
    }
}
?>