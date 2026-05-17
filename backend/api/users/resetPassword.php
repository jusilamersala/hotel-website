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
$email        = $data->email        ?? null;
$new_password = $data->new_password ?? null;
$confirm      = $data->confirm      ?? null;

// 1. Kontrollo nëse fushat janë plotësuar
if (!$email || !$new_password || !$confirm) {
    http_response_code(400);
    echo json_encode([
        "status"  => "error",
        "message" => "Ju lutem plotësoni të gjitha fushat."
    ]);
    exit;
}

// 2. Kontrollo nëse passwordet përputhen
if ($new_password !== $confirm) {
    http_response_code(400);
    echo json_encode([
        "status"  => "error",
        "message" => "Fjalëkalimet nuk përputhen."
    ]);
    exit;
}

// 3. Kontrollo nëse email ekziston në DB
$check = "SELECT user_ID FROM User WHERE email = ? LIMIT 1";
$stmt  = mysqli_prepare($conn, $check);
mysqli_stmt_bind_param($stmt, "s", $email);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

if (!mysqli_fetch_assoc($result)) {
    http_response_code(404);
    echo json_encode([
        "status"  => "error",
        "message" => "Ky email nuk ekziston në sistem."
    ]);
    exit;
}

// 4. Hashi i password-it të ri
$hashed = password_hash($new_password, PASSWORD_DEFAULT);

// 5. UPDATE në databazë
$update = "UPDATE User SET password = ? WHERE email = ?";
$stmt2  = mysqli_prepare($conn, $update);
mysqli_stmt_bind_param($stmt2, "ss", $hashed, $email);

if (mysqli_stmt_execute($stmt2)) {
    http_response_code(200);
    echo json_encode([
        "status"  => "success",
        "message" => "Fjalëkalimi u ndryshua me sukses!"
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "status"  => "error",
        "message" => "Ndodhi një gabim. Provoni përsëri."
    ]);
}
?>