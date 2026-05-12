<?php
include_once '../../config/database.php';

$token = $_GET['token'] ?? null;

if ($token) {
    $query = "SELECT user_ID FROM User WHERE verification_token = ? LIMIT 1";
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "s", $token);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    if ($user = mysqli_fetch_assoc($result)) {
        $updateQuery = "UPDATE User SET is_verified = 1, verification_token = NULL WHERE verification_token = ?";
        $updateStmt = mysqli_prepare($conn, $updateQuery);
        mysqli_stmt_bind_param($updateStmt, "s", $token);

        if (mysqli_stmt_execute($updateStmt)) {
            header("Location: http://localhost:4200/login?verified=true");
            exit();
        } else {
            echo "Ndodhi një gabim gjatë aktivizimit. Ju lutem provoni përsëri.";
        }
    } else {
        echo "Lidhja është e pavlefshme ose llogaria është aktivizuar më parë.";
    }
} else {
    echo "Kërkesë e gabuar. Mungon kodi i verifikimit.";
}
?>