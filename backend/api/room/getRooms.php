<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';

$sql = "SELECT * FROM Room";
$result = mysqli_query($conn, $sql);

$rooms = [];

if (mysqli_num_rows($result) > 0) {
    while($row = mysqli_fetch_assoc($result)) {
        $rooms[] = $row;
    }
}

echo json_encode([
    "status" => "success",
    "data" => $rooms
]);
?>