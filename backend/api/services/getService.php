<?php
// 1. Header-at për të lejuar Angular (CORS)
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// 2. Trajtimi i kërkesave OPTIONS (Preflight) që dërgon browser-i
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 3. Lidhja me databazën
// Sigurohu që kjo rrugë është e saktë në raport me folderin 'services'
include_once '../../config/database.php';

// Kontrollojmë nëse po kërkohet një shërbim specifik apo të gjithë
$id = $_GET['id'] ?? null;

if (!empty($id)) {
    // --- MARRJA E NJË SHËRBIMI SPECIFIK ---
    $sql = "SELECT service_ID, service_Name, service_Description, service_Price, is_Included 
            FROM Services 
            WHERE service_ID = ?";
    
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "i", $id);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $service = mysqli_fetch_assoc($result);

    if ($service) {
        echo json_encode([
            "status" => "success", 
            "data" => $service
        ]);
    } else {
        http_response_code(404);
        echo json_encode([
            "status" => "error", 
            "message" => "Ky shërbim nuk u gjet."
        ]);
    }
    mysqli_stmt_close($stmt);

} else {
    // --- MARRJA E TË GJITHA SHËRBIMEVE ---
    $sql = "SELECT service_ID, service_Name, service_Description, service_Price, is_Included 
            FROM Services";
    $result = mysqli_query($conn, $sql);

    if ($result) {
        $services = mysqli_fetch_all($result, MYSQLI_ASSOC);
        
        echo json_encode([
            "status" => "success",
            "data" => $services
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "status" => "error",
            "message" => "Gabim gjatë leximit: " . mysqli_error($conn)
        ]);
    }
}
?>