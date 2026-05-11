<?php
    include_once '../../config/database.php';
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: POST");

    $data = json_decode(file_get_contents("php://input"), true);

    if (!empty($data['user_ID']) && !empty($data['room_ID']) && !empty($data['check_In_Date']) && !empty($data['check_Out_Date'])) {
        $sql = "INSERT INTO Booking (user_ID, room_ID, booking_Date, status, check_In_Date, check_Out_Date, email_verified) VALUES (?, ?, CURDATE(), 'Confirmed', ?, ?, FALSE)";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "iiss", $data['user_ID'], $data['room_ID'], $data['check_In_Date'], $data['check_Out_Date']);
        
        if (mysqli_stmt_execute($stmt)) {
            $booking_ID = mysqli_insert_id($conn);
            
            // Get user email
            $user_sql = "SELECT email FROM User WHERE user_ID = ?";
            $user_stmt = mysqli_prepare($conn, $user_sql);
            mysqli_stmt_bind_param($user_stmt, "i", $data['user_ID']);
            mysqli_stmt_execute($user_stmt);
            $user_result = mysqli_stmt_get_result($user_stmt);
            $user = mysqli_fetch_assoc($user_result);
            
            if ($user) {
                $to = $user['email'];
                $subject = "Booking Confirmation - Grand Horizon";
                $message = "Your booking has been created. Please verify your email to confirm.\n\nBooking ID: $booking_ID\nCheck-in: {$data['check_In_Date']}\nCheck-out: {$data['check_Out_Date']}";
                $headers = "From: noreply@grandhorizon.com";
                
                mail($to, $subject, $message, $headers);
            }
            
            echo json_encode(["status" => "success", "message" => "Booking created successfully", "booking_ID" => $booking_ID]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error: " . mysqli_stmt_error($stmt)]);
        }
        mysqli_stmt_close($stmt);
    } else {
        echo json_encode(["status" => "error", "message" => "Missing required fields"]);
    }
?>