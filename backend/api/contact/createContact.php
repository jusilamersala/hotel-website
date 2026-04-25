<?php
global $conn;
include_once '../../config/database.php';
    header("Content-Type: application/json");
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    if($_SERVER["REQUEST_METHOD"] == "POST"){
        $data = json_decode(file_get_contents("php://input"));

         $full_name=$data->full_name ?? null;
         $email=$data->email ?? null;
         $message=$data->message ?? null;

         //Kontroller per emrin
         if(empty($name)){
             echo json_encode(["status"=>"error","message"=>"Name is required"]);
         }

        if (!preg_match($name,"/^[a-zA-Z-' ]*$/")) {
            echo json_encode(["status"=>"error","message"=>"Only letters and white space allowed"]);
        }

         //Kontroller per formatin e emailit admin@gmail.com
        if (empty($email)) {
            echo json_encode(["status" => "error", "message" => "Email is required"]);
            exit;
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            echo json_encode(["status" => "error", "message" => "Invalid email format"]);
            exit;
        }

        //Kontroller per mesazhin
        if(empty($message)){
            echo json_encode(["status" => "error", "message" => "Message is required"]);
        }


        $sql = "INSERT INTO contact (full_name,email,message) VALUES (?, ?, ?)";
        $stmt = mysqli_prepare($conn, $sql);

        mysqli_stmt_bind_param($stmt, "sss", $full_name,$email,$message);

        if (mysqli_stmt_execute($stmt)) {
            echo json_encode(["status" => "success", "message" => "Message sent successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Something went wrong"]);
        }

        mysqli_stmt_close($stmt);
        } else {
            echo json_encode(["status" => "error", "message" => "Something went wrong "]);
        }

?>