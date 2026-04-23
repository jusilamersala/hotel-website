<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header('Content-Type: application/json');

$host = "mysql-207cb4ed-hotel-website.e.aivencloud.com";
$user = "avnadmin";
$pass = "AVNS_ZBdwjbdtX1VL6vAJ7hb"; 
$db   = "grand_horizon";
$port = 17108; 

$conn = new mysqli($host, $user, $pass, $db, $port);

if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Lidhja dështoi: " . $conn->connect_error]);
    exit();
}

$conn->set_charset("utf8mb4");
?>