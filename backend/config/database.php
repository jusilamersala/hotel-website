<?php
// 1. Lejo Angular-in të komunikojë me këtë Backend
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header('Content-Type: application/json');

// 2. Kredencialet (Ndrysho fjalëkalimin me atë që ke në MySQL tënd)
$host = "localhost";
$user = "root";
$pass = "Ina29/*-qay+";
$db   = "grand_horizon"; // Emri që krijove në PhpStorm

// 3. Lidhja Object-Oriented
$conn = new mysqli($host, $user, $pass, $db);

// 4. Kontrolli i lidhjes
if ($conn->connect_error) {
    // Kthejmë error në format JSON që Angular ta kuptojë
    echo json_encode(["status" => "error", "message" => "Lidhja dështoi: " . $conn->connect_error]);
    exit();
}

// Opsionale: Sigurohemi që karakteret shqip (ë, ç) të ruhen saktë
$conn->set_charset("utf8mb4");
?>