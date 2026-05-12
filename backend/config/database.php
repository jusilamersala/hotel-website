<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header('Content-Type: application/json');

$host = "localhost";
$user = "root";
$pass = ""; 
$db   = "grand_horizon";
$port = 3306; 

$conn = new mysqli($host, $user, $pass, $db, $port);

if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Lidhja dështoi: " . $conn->connect_error]);
    exit();
}

$conn->set_charset("utf8mb4");
?>