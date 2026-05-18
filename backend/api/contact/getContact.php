<?php
global $conn;
include_once '../../config/database.php';
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET");

$id = $_GET['id'] ?? null;

if (!empty($id)) {
    $sql = "SELECT id, full_name, email, message FROM contact WHERE id = ?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "i", $id);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    $contact = mysqli_fetch_assoc($result);

    if ($contact) {
        echo json_encode(["status" => "success", "data" => $contact]);
    } else {
        echo json_encode(["status" => "error", "message" => "User not found!"]);
    }
    mysqli_stmt_close($stmt);

} else {
    $sql = "SELECT id,full_name, email, message FROM contact";
    $result = mysqli_query($conn, $sql);

    if ($result) {
        $contacts = mysqli_fetch_all($result, MYSQLI_ASSOC);
        echo json_encode(["status" => "success", "data" => $contacts]);
    } else {
        echo json_encode(["status" => "error", "message" => "Gabim gjatë leximit: " . mysqli_error($conn)]);
    }
}
?>