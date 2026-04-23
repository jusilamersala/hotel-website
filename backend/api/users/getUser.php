<?php
    include_once '../../config/database.php';
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");

    // Kontrollojmë nëse ka një ID në URL (p.sh. getUser.php?id=5)
    $id = $_GET['id'] ?? null;

    if (!empty($id)) {
        // --- RASTI 1: Marrja e një përdoruesi specifik ---
        $sql = "SELECT user_ID, name, surname, email, role FROM User WHERE user_ID = ?";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "i", $id);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        
        $user = mysqli_fetch_assoc($result);

        if ($user) {
            echo json_encode(["status" => "success", "data" => $user]);
        } else {
            echo json_encode(["status" => "error", "message" => "User not found!"]);
        }
        mysqli_stmt_close($stmt);

    } else {
        // --- RASTI 2: Marrja e të gjithë përdoruesve ---
        $sql = "SELECT user_ID, name, surname, email, role FROM User";
        $result = mysqli_query($conn, $sql);

        if ($result) {
            $users = mysqli_fetch_all($result, MYSQLI_ASSOC);
            echo json_encode(["status" => "success", "data" => $users]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gabim gjatë leximit: " . mysqli_error($conn)]);
        }
    }
?>