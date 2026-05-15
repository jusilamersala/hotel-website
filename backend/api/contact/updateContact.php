<?php
global $conn;
include_once '../../config/database.php';
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: PUT, POST");

$data = json_decode(file_get_contents("php://input"));

if ($_SERVER["REQUEST_METHOD"] == "POST" || $_SERVER["REQUEST_METHOD"] == "PUT") {

    $id = $data->id ?? null;
    $full_name = $data->full_name ?? null;
    $email = $data->email ?? null;
    $message = $data->message ?? null;

    if (!empty($id)) {
        $sql = "UPDATE contact SET full_name = ?,email = ?,message = ? WHERE id = ?";

        if ($stmt = mysqli_prepare($conn, $sql)) {
            mysqli_stmt_bind_param($stmt, "sssi", $full_name,$email,$message, $id);

            if (mysqli_stmt_execute($stmt)) {
                echo json_encode(["status" => "success", "message" => "Message Updated!"]);
            } else {
                echo json_encode(["status" => "error", "message" => "Error: " . mysqli_error($conn)]);
            }
            mysqli_stmt_close($stmt);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Message ID required for updates."]);
    }
}
?>