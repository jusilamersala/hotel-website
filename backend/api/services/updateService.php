<?php
include_once '../../config/database.php';

header("Content-Type: application/json");
// Lejojmë PUT për update sipas standardeve REST, por edhe POST për siguri
header("Access-Control-Allow-Methods: PUT, POST, OPTIONS");

$data = json_decode(file_get_contents("php://input"));

if ($_SERVER["REQUEST_METHOD"] == "POST" || $_SERVER["REQUEST_METHOD"] == "PUT") {
    
    // Marrim të dhënat e reja
    $id = $data->service_ID ?? null;
    $name = $data->service_Name ?? null;
    $description = $data->service_Description ?? null;
    $price = $data->service_Price ?? null;
    $is_included = isset($data->is_Included) ? (int)$data->is_Included : 0;

    // 1. Validimi: ID është e detyrueshme për update
    if (empty($id) || !is_numeric($id)) {
        echo json_encode(["status" => "error", "message" => "ID-ja e shërbimit është e detyrueshme për të kryer ndryshime."]);
        exit;
    }

    // 2. Validimi: Kontrollojmë nëse fushat e tjera nuk janë bosh
    if (empty($name) || empty($description)) {
        echo json_encode(["status" => "error", "message" => "Emri dhe përshkrimi nuk mund të lihen bosh."]);
        exit;
    }

    // 3. Validimi: Kontrollojmë çmimin
    if (!is_numeric($price) || $price < 0) {
        echo json_encode(["status" => "error", "message" => "Ju lutem vendosni një çmim të vlefshëm."]);
        exit;
    }

    // SQL UPDATE me kolonat e reja
    $sql = "UPDATE Services SET service_Name = ?, service_Description = ?, service_Price = ?, is_Included = ? WHERE service_ID = ?";
    
    if ($stmt = mysqli_prepare($conn, $sql)) {
        // "ssdii" -> string, string, double, integer, integer (për ID-në në fund)
        mysqli_stmt_bind_param($stmt, "ssdii", $name, $description, $price, $is_included, $id);

        if (mysqli_stmt_execute($stmt)) {
            // Kontrollojmë nëse u bë vërtet ndonjë ndryshim
            if (mysqli_stmt_affected_rows($stmt) >= 0) {
                echo json_encode(["status" => "success", "message" => "Të dhënat e shërbimit u përditësuan me sukses!"]);
            } else {
                echo json_encode(["status" => "error", "message" => "Nuk u bë asnjë ndryshim në të dhëna."]);
            }
        } else {
            echo json_encode(["status" => "error", "message" => "Gabim gjatë përditësimit: " . mysqli_error($conn)]);
        }
        mysqli_stmt_close($stmt);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Metodë e paautorizuar."]);
}
?>