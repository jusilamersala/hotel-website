<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
    exit;
}

include_once '../../config/database.php';
require_once '../Email/RegisterEmail.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"));

    $name = $data->name ?? null;
    $surname = $data->surname ?? null;
    $password = $data->password ?? null;
    $confirm_password = $data->confirm_password ?? null;
    $email = $data->email ?? null;
    $role = $data->role ?? null;

    if (empty($name) || empty($surname) || empty($password) || empty($email) || empty($role)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Të gjitha fushat janë të detyrueshme!"]);
        exit;
    }

    $checkEmailSql = "SELECT user_ID FROM User WHERE email = ?";
    $checkStmt = mysqli_prepare($conn, $checkEmailSql);
    mysqli_stmt_bind_param($checkStmt, "s", $email);
    mysqli_stmt_execute($checkStmt);
    mysqli_stmt_store_result($checkStmt);

    if (mysqli_stmt_num_rows($checkStmt) > 0) {
        http_response_code(409);
        echo json_encode(["status" => "error", "message" => "Ky email është i regjistruar më parë!"]);
        exit;
    }

    $hashed_pw = password_hash($password, PASSWORD_DEFAULT);

    $token = bin2hex(random_bytes(32));

    $sql = "INSERT INTO User (name, surname, password, email, role, verification_token, is_verified) VALUES (?, ?, ?, ?, ?, ?, 0)";
    $stmt = mysqli_prepare($conn, $sql);

    if ($stmt) {
        mysqli_stmt_bind_param($stmt, "ssssss", $name, $surname, $hashed_pw, $email, $role, $token);

        if (mysqli_stmt_execute($stmt)) {

            if (Mailer::sendVerificationEmail($email, $token)) {
                http_response_code(201);
                echo json_encode([
                    "status" => "success",
                    "message" => "Regjistrimi u krye! Ju lutem kontrolloni email-in për të aktivizuar llogarinë."
                ]);
            } else {
                http_response_code(201);
                echo json_encode([
                    "status" => "warning",
                    "message" => "Përdoruesi u krijua, por emaili i verifikimit nuk u dërgua dot."
                ]);
            }

        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Gabim gjatë ruajtjes në databazë."]);
        }
    }
}
?>