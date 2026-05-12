<?php
    include_once '../../config/database.php';
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");

    $id = $_GET['id'] ?? null;

    if (!empty($id)) {
        $sql = "SELECT staff_ID, name, surname, email, role, shift FROM Staff WHERE staff_ID = ?";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "i", $id);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        
        $staff = mysqli_fetch_assoc($result);

        if ($staff) {
            echo json_encode(["status" => "success", "data" => $staff]);
        } else {
            echo json_encode(["status" => "error", "message" => "Staff not found!"]);
        }
        mysqli_stmt_close($stmt);
    } else {
        $sql = "SELECT staff_ID, name, surname, email, role, shift FROM Staff";
        $result = mysqli_query($conn, $sql);

        if ($result) {
            $staff = mysqli_fetch_all($result, MYSQLI_ASSOC);
            echo json_encode(["status" => "success", "data" => $staff]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error: " . mysqli_error($conn)]);
        }
    }
?>