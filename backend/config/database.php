<?php
// 1. Lejo Angular-in të komunikojë (Lere siç është)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header('Content-Type: application/json');

// 2. Kredencialet e reja (Aiven Cloud)
$host = "mysql-207cb4ed-hotel-website.e.aivencloud.com";
$user = "avnadmin";
$pass = "AVNS_ZBdwjbdtX1VL6vAJ7hb"; // Vendos fjalëkalimin e saktë këtu
$db   = "grand_horizon";
$port = 17108; // Mos e harro portin!

// 3. Lidhja Object-Oriented (Shtojmë portin në fund)
$conn = new mysqli($host, $user, $pass, $db, $port);

// 4. Kontrolli i lidhjes
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Lidhja dështoi: " . $conn->connect_error]);
    exit();
}

$conn->set_charset("utf8mb4");

// Nëse dëshiron të testosh nëse punon, mund të heqësh komentin poshtë:
// echo json_encode(["status" => "success", "message" => "Lidhur me Aiven!"]);
?>