<?php
    include_once '../../config/database.php';
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: POST");

    $data = json_decode(file_get_contents("php://input"), true);

    if (!empty($data['staff_ID']) && !empty($data['date']) && !empty($data['start_time']) && !empty($data['end_time']) && !empty($data['task'])) {
        $sql = "INSERT INTO Timetable (staff_ID, date, start_time, end_time, task) VALUES (?, ?, ?, ?, ?)";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "issss", $data['staff_ID'], $data['date'], $data['start_time'], $data['end_time'], $data['task']);
        
        if (mysqli_stmt_execute($stmt)) {
            echo json_encode(["status" => "success", "message" => "Timetable created successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error: " . mysqli_stmt_error($stmt)]);
        }
        mysqli_stmt_close($stmt);
    } else {
        echo json_encode(["status" => "error", "message" => "Missing required fields"]);
    }
?>