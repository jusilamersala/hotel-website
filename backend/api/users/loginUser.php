<?php
// Header-at e CORS (si te regjistrimi)
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Content-Type: application/json");

include_once '../../config/database.php';

$data = json_decode(file_get_contents("php://input"));
$email = $data->email ?? null;
$password = $data->password ?? null;

if ($email && $password) {
    // 1. Kërko përdoruesin sipas email-it
    $sql = "SELECT user_ID, name,surname,password,email, role FROM User WHERE email = ?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "s", $email);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    if ($user = mysqli_fetch_assoc($result)) {
        // 2. Verifiko nëse password-i i shkruar përputhet me Hash-in në DB
        if (password_verify($password, $user['password'])) {
            echo json_encode([
                "status" => "success",
                "message" => "Login i suksesshëm!",
                "user" => [
                    "id" => $user['user_ID'],
                    "name" => $user['name'],
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
}
?>