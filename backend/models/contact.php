<?php
// Kjo rrugë shkon një nivel lart te folderi 'backend' dhe pastaj te 'config'
include_once __DIR__ . '/../config/database.php';

// Kontrolli i emergjencës: Nëse përsëri thotë undefined, e ndalojmë me një mesazh të qartë
if (!isset($conn)) {
    die(json_encode(["status" => "error", "message" => "Lidhja me databazën dështoi në nivel skedari."]));
}

$input = json_decode(file_get_contents("php://input"), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($input)) {
    // Sigurohu që këto emra (emri, email, mesazhi) përputhen me ato në Angular
    $emri = $input['emri'] ?? '';
    $email = $input['email'] ?? '';
    $mesazhi = $input['mesazhi'] ?? '';

    if (empty($emri) || empty($email)) {
        echo json_encode(["status" => "error", "message" => "Plotesoni te gjitha fushat!"]);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO contact (full_name, email, message) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $emri, $email, $mesazhi);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Mesazhi u ruajt me sukses!"]);
    } else {
        echo json_encode(["status" => "error", "message" => $stmt->error]);
    }

    $stmt->close();
}
$conn->close();
?>