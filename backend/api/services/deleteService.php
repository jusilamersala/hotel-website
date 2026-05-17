<?php
    include_once '../../config/database.php';

    header("Content-Type: application/json");
    // Lejojmë metodat që duhen (zakonisht DELETE përdoret për fshirje)
    header("Access-Control-Allow-Methods: DELETE, POST, OPTIONS");

    // Marrim të dhënat nga body (JSON) ose nga URL (query string)
    $data = json_decode(file_get_contents("php://input"));
    $id = $data->service_ID ?? $_GET['id'] ?? null;

    if ($_SERVER["REQUEST_METHOD"] == "DELETE" || $_SERVER["REQUEST_METHOD"] == "POST") {

        // Validimi: Kontrollojmë nëse ID nuk është bosh dhe është numër
        if (!empty($id) && is_numeric($id)) {
            
            $sql = "DELETE FROM Services WHERE service_ID = ?";
            
            $stmt = mysqli_prepare($conn, $sql);
            
            // "i" tregon që parametri është një Integer (numër i plotë)
            mysqli_stmt_bind_param($stmt, "i", $id); 

            if (mysqli_stmt_execute($stmt)) {
                // Kontrollojmë nëse vërtet u fshi ndonjë rresht
                if (mysqli_stmt_affected_rows($stmt) > 0) {
                    echo json_encode([
                        "status" => "success", 
                        "message" => "Shërbimi u fshi me sukses nga sistemi!"
                    ]);
                } else {
                    echo json_encode([
                        "status" => "error", 
                        "message" => "Nuk u gjet asnjë shërbim me këtë ID."
                    ]);
                }
            } else {
                echo json_encode([
                    "status" => "error", 
                    "message" => "Ndodhi një gabim gjatë procesit të fshirjes."
                ]);
            }

            mysqli_stmt_close($stmt);
        } else {
            echo json_encode([
                "status" => "error", 
                "message" => "ID-ja e shërbimit mungon ose është e pavlefshme."
            ]);
        }
    } else {
        echo json_encode([
            "status" => "error", 
            "message" => "Kjo metodë nuk lejohet për këtë veprim."
        ]);
    }
?>