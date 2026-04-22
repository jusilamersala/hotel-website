<?php
    include_once '../../config/database.php';

    header("Content-Type: application/json");

    if($_SERVER["REQUEST_METHOD"] == "POST"){
        $data = json_decode(file_get_contents("php://input"));

        $name = $data->name ?? null;
        $surname = $data->surname ?? null;
        $password = $data->password ?? null;
        $email = $data->email ?? null;
        $role = $data->role ?? null;
        
        $hashed_pw = password_hash($password, PASSWORD_DEFAULT);

        $sql = "INSERT INTO User (name, surname, password, email,  role) VALUES (?, ?, ?, ?, ?)";
        $stmt = mysqli_prepare($conn, $sql);
        
        mysqli_stmt_bind_param($stmt, "sssss", $name, $surname, $hashed_pw, $email, $role);

        if (mysqli_stmt_execute($stmt)) {
            echo json_encode(["status" => "success", "message" => "User created succesfuly"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Something went wrong"]);
        }
        
        mysqli_stmt_close($stmt);
    } else {
        echo json_encode(["status" => "error", "message" => "Something went wrong "]);
    }
    
?>