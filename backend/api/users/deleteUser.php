<?php
    include_once '../../config/database.php';
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: DELETE, POST"); // Lejojme keto metoda

    $data = json_decode(file_get_contents("php://input"));

    $id = $data->user_ID ?? $_GET['id'] ?? null;

    if ($_SERVER["REQUEST_METHOD"] == "DELETE" || $_SERVER["REQUEST_METHOD"] == "POST") {

        if (!empty($id)) {
            // 3. Query per fshirje
            $sql = "DELETE FROM User WHERE user_ID = ?";
            
            $stmt = mysqli_prepare($conn, $sql);
            mysqli_stmt_bind_param($stmt, "i", $id); // "i" sepse ID eshte Integer

            if (mysqli_stmt_execute($stmt)) {
                // Kontrollojme nese u fshi realisht ndonje rresht
                if (mysqli_stmt_affected_rows($stmt) > 0) {
                    echo json_encode(["status" => "success", "message" => "User u fshi me sukses"]);
                } else {
                    echo json_encode(["status" => "error", "message" => "Asnje perdorues nuk u gjet me kete ID"]);
                }
            } else {
                echo json_encode(["status" => "error", "message" => "Gabim teknik: " . mysqli_error($conn)]);
            }

            mysqli_stmt_close($stmt);
        } else {
            echo json_encode(["status" => "error", "message" => "ID-ja e perdoruesit mungon"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Metode e palejuar"]);
    }
?>