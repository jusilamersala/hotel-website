<?php
    // Header-at e nevojshëm për CORS
    header("Access-Control-Allow-Origin: http://localhost:4200");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    header("Content-Type: application/json");



    // KJO ËSHTË PJESA QË MUNGON: Trajtimi i kërkesës OPTIONS
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        http_response_code(204);
        exit;
    }

    include_once '../../config/database.php';

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $data = json_decode(file_get_contents("php://input"));

        $name = $data->name ?? null;
        $surname = $data->surname ?? null;
        $password = $data->password ?? null;
        $confirm_password = $data->confirm_password ?? null; // Variabla e re
        $email = $data->email ?? null;
        $role = $data->role ?? null;

        if (empty($name) || empty($surname) || empty($password) || empty($email) || empty($role)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Të gjitha fushat janë të detyrueshme!"]);
            exit;
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Formati i email-it nuk është i rregullt!"]);
            exit;
        }

        if ($password !== $confirm_password) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Fjalëkalimet nuk përputhen!"]);
            exit;
        }

        if (strlen($password) < 6) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Fjalëkalimi duhet të jetë të paktën 6 karaktere!"]);
            exit;
        }

        $checkEmailSql = "SELECT user_ID FROM User WHERE email = ?";
        $checkStmt = mysqli_prepare($conn, $checkEmailSql);
        
        if ($checkStmt) {
            mysqli_stmt_bind_param($checkStmt, "s", $email);
            mysqli_stmt_execute($checkStmt);
            mysqli_stmt_store_result($checkStmt);

            // Nëse numri i rreshtave është më i madh se 0, emaili ekziston
            if (mysqli_stmt_num_rows($checkStmt) > 0) {
                http_response_code(409); // 409 Conflict
                echo json_encode(["status" => "error", "message" => "Ky email është i regjistruar më parë!"]);
                mysqli_stmt_close($checkStmt);
                exit;
            }
            mysqli_stmt_close($checkStmt);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Gabim në verifikimin e email-it."]);
            exit;
        }

        $hashed_pw = password_hash($password, PASSWORD_DEFAULT);

        $sql = "INSERT INTO User (name, surname, password, email, role) VALUES (?, ?, ?, ?, ?)";
        $stmt = mysqli_prepare($conn, $sql);
        
        if ($stmt) {
            mysqli_stmt_bind_param($stmt, "sssss", $name, $surname, $hashed_pw, $email, $role);

            if (mysqli_stmt_execute($stmt)) {
                http_response_code(201); 
                echo json_encode(["status" => "success", "message" => "Përdoruesi u krijua me sukses!"]);
            } else {
                http_response_code(500);
                echo json_encode(["status" => "error", "message" => "Gabim gjatë ruajtjes në databazë."]);
            }
            mysqli_stmt_close($stmt);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "SQL Error: Përgatitja e kërkesës dështoi."]);
        }
    } else {
        http_response_code(405);
        echo json_encode(["status" => "error", "message" => "Metodë e palejuar."]);
    }
?>