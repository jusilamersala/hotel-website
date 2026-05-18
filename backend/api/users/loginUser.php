<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
    exit;
}

include_once '../../config/database.php';

$data = json_decode(file_get_contents("php://input"));
$email = $data->email ?? null;
$password = $data->password ?? null;

if ($email && $password) {
    $sql = "SELECT user_ID, name, surname, password, email, role, is_verified FROM User WHERE email = ?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "s", $email);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    if ($user = mysqli_fetch_assoc($result)) {
        if (password_verify($password, $user['password'])) {

            if ($user['is_verified'] == 0) {
                http_response_code(403);
                echo json_encode([
                    "status" => "error",
                    "message" => "Llogaria juaj nuk është aktivizuar. Ju lutem kontrolloni email-in!"
                ]);
                exit;
            }

            echo json_encode([
                "status" => "success",
                "message" => "Login i suksesshëm!",
                "user" => [
                    "id" => $user['user_ID'],
                    "name" => $user['name'],
                    "email"=>$user['email'],
                    "role" => $user['role']
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "Fjalëkalimi i gabuar!"]);
        }
    } else {
        http_response_code(404);
        echo json_encode(["status" => "error", "message" => "Përdoruesi nuk ekziston!"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Ju lutem plotësoni email-in dhe fjalëkalimin."]);
}
?>