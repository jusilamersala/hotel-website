<?php
global $conn;
include_once '../../config/database.php';

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"));

    // Përdorim variablat e sakta sipas Angularit
    $full_name = $data->full_name ?? null;
    $email = $data->email ?? null;
    $message = $data->message ?? null;

    // 1. Kontrolli për emrin
    if (empty($full_name)) {
        echo json_encode(["status" => "error", "message" => "Name is required"]);
        exit; // DUHET exit pas çdo echo që të mos vazhdojë kodin
    }

    if (!preg_match("/^[a-zA-Z-' ]*$/", $full_name)) { // Ndrequr preg_match (duhet patterni i pari)
        echo json_encode(["status" => "error", "message" => "Only letters and white space allowed"]);
        exit;
    }

    // 2. Kontrolli për emailin
    if (empty($email)) {
        echo json_encode(["status" => "error", "message" => "Email is required"]);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["status" => "error", "message" => "Invalid email format"]);
        exit;
    }

    // 3. Kontrolli për mesazhin
    if (empty($message)) {
        echo json_encode(["status" => "error", "message" => "Message is required"]);
        exit;
    }

    // 4. Insertimi në Database
    $sql = "INSERT INTO contact (full_name, email, message) VALUES (?, ?, ?)";
    $stmt = mysqli_prepare($conn, $sql);

    if ($stmt) {
        mysqli_stmt_bind_param($stmt, "sss", $full_name, $email, $message);

        if (mysqli_stmt_execute($stmt)) {
            echo json_encode(["status" => "success", "message" => "Message sent successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Database error: " . mysqli_error($conn)]);
        }
        mysqli_stmt_close($stmt);
    } else {
        echo json_encode(["status" => "error", "message" => "SQL Prepare failed"]);
    }

} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
}
?>