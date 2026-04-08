<?php
$host = "localhost";
$user = "root";
$pass = "";
$db = "projekti_db";

// Lidhja në mënyrë Object-Oriented (duhet për ->prepare)
$conn = new mysqli($host, $user, $pass, $db);

// Kontrolli i lidhjes
if ($conn->connect_error) {
    header('Content-Type: application/json');
    die(json_encode(["error" => "Lidhja me DB dështoi: " . $conn->connect_error]));
}
?>