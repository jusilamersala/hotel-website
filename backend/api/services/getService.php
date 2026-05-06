<?php
 include_once '../../config/database.php';
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");

    // Kontrollojmë nëse ka një ID në URL (p.sh. getService.php?id=5)
    $id = $_GET['id'] ?? null;

    if (!empty($id)) {
        // --- RASTI 1: Marrja e një përdoruesi specifik ---
        $sql = "SELECT service_ID, service_Type, service_Price  FROM Services WHERE service_ID = ?";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "i", $id);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        
        $service = mysqli_fetch_assoc($result);

        if ($service) {
            echo json_encode(["status" => "success", "data" => $service]);
        } else {
            echo json_encode(["status" => "error", "message" => "Service not found!"]);
        }
        mysqli_stmt_close($stmt);

    } else {
        // --- RASTI 2: Marrja e të gjithë përdoruesve ---
        $sql = "SELECT service_ID, service_type,service_price FROM Services";
        $result = mysqli_query($conn, $sql);

        if ($result) {
            $services = mysqli_fetch_all($result, MYSQLI_ASSOC);
            echo json_encode(["status" => "success", "data" => $services]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gabim gjatë leximit: " . mysqli_error($conn)]);
        }
    }
?>