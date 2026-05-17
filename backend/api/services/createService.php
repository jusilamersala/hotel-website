<?php
    include_once '../../config/database.php';

    header("Content-Type: application/json");

    if($_SERVER["REQUEST_METHOD"] == "POST"){
        $data = json_decode(file_get_contents("php://input"));

        // Marrim të dhënat nga JSON
        $name = $data->service_Name ?? null;
        $description = $data->service_Description ?? null;
        $price = $data->service_Price ?? null;
        $is_included = isset($data->is_Included) ? (int)$data->is_Included : 0;

        // 1. Validimi: Kontrollojmë nëse fushat kryesore janë bosh
        if (empty($name) || empty($description)) {
            echo json_encode(["status" => "error", "message" => "Ju lutem plotësoni emrin dhe përshkrimin e shërbimit."]);
            exit;
        }

        // 2. Validimi: Kontrollojmë nëse çmimi është numër
        if (!is_numeric($price) || $price < 0) {
            echo json_encode(["status" => "error", "message" => "Çmimi duhet të jetë një numër i vlefshëm pozitiv."]);
            exit;
        }

        // Përgatitja e SQL me fushat e reja
        $sql = "INSERT INTO Services (service_Name, service_Description, service_Price, is_Included) VALUES (?, ?, ?, ?)";
        $stmt = mysqli_prepare($conn, $sql);
        
        // "ssdi" do të thotë: string, string, double (decimal), integer
        mysqli_stmt_bind_param($stmt, "ssdi", $name, $description, $price, $is_included);

        if (mysqli_stmt_execute($stmt)) {
            echo json_encode([
                "status" => "success", 
                "message" => "Shërbimi u krijua me sukses!"
            ]);
        } else {
            echo json_encode([
                "status" => "error", 
                "message" => "Ndodhi një gabim gjatë ruajtjes në databazë: " . mysqli_error($conn)
            ]);
        }
        
        mysqli_stmt_close($stmt);
    } else {
        echo json_encode(["status" => "error", "message" => "Metoda e kërkesës nuk është e vlefshme."]);
    }
?>