<?php
include_once '../../config/database.php';

header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET");

// Kontrollojmë nëse ka një ID në URL (p.sh. getService.php?id=5)
$id = $_GET['id'] ?? null;

if (!empty($id)) {
    // --- RASTI 1: Marrja e një shërbimi specifik ---
    // Përditësuam kolonat: service_Name, service_Description, is_Included
    $sql = "SELECT service_ID, service_Name, service_Description, service_Price, is_Included FROM Services WHERE service_ID = ?";
    
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "i", $id);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    
    $service = mysqli_fetch_assoc($result);

    if ($service) {
        echo json_encode(["status" => "success", "data" => $service]);
    } else {
        echo json_encode(["status" => "error", "message" => "Ky shërbim nuk u gjet në sistem."]);
    }
    mysqli_stmt_close($stmt);

} else {
    $sql = "SELECT service_ID, service_Name, service_Description, service_Price, is_Included FROM Services";
    $result = mysqli_query($conn, $sql);

    if ($result) {
        $services = mysqli_fetch_all($result, MYSQLI_ASSOC);
        
        if (count($services) > 0) {
            echo json_encode(["status" => "success", "data" => $services]);
        } else {
            echo json_encode(["status" => "success", "data" => [], "message" => "Nuk ka shërbime të regjistruara për momentin."]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Ndodhi një gabim gjatë leximit të të dhënave: " . mysqli_error($conn)]);
    }
}
?>