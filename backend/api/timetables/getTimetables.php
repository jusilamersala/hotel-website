<?php
    include_once '../../config/database.php';
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");

    $id = $_GET['id'] ?? null;

    if (!empty($id)) {
        $sql = "SELECT t.timetable_ID, t.staff_ID, t.date, t.start_time, t.end_time, t.task, s.name, s.surname FROM Timetable t JOIN Staff s ON t.staff_ID = s.staff_ID WHERE t.timetable_ID = ?";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "i", $id);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        
        $timetable = mysqli_fetch_assoc($result);

        if ($timetable) {
            echo json_encode(["status" => "success", "data" => $timetable]);
        } else {
            echo json_encode(["status" => "error", "message" => "Timetable not found!"]);
        }
        mysqli_stmt_close($stmt);
    } else {
        $sql = "SELECT t.timetable_ID, t.staff_ID, t.date, t.start_time, t.end_time, t.task, s.name, s.surname FROM Timetable t JOIN Staff s ON t.staff_ID = s.staff_ID";
        $result = mysqli_query($conn, $sql);

        if ($result) {
            $timetables = mysqli_fetch_all($result, MYSQLI_ASSOC);
            echo json_encode(["status" => "success", "data" => $timetables]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error: " . mysqli_error($conn)]);
        }
    }
?>