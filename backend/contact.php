<?php
// Lejo aksesin nga çdo origjinë
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, Origin, Accept");

// Trajtimi i kërkesës OPTIONS (Preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Është e rëndësishme që kjo të jetë e para
    http_response_code(200);
    exit();
}

include_once 'db.php'; 

$method = $_SERVER['REQUEST_METHOD'];

// Merr të dhënat JSON nga Angular
$inputJSON = file_get_contents("php://input");
$input = json_decode($inputJSON, true);

switch($method) {
    case 'GET':
        $result = $conn->query("SELECT * FROM kontaktet ORDER BY krijuar_me DESC");
        if ($result) {
            echo json_encode($result->fetch_all(MYSQLI_ASSOC));
        } else {
            echo json_encode(["error" => "Gabim në databazë: " . $conn->error]);
        }
        break;

    case 'POST':
        // Kontrollojmë nëse inputi është bosh (ndonjëherë json_decode kthen null)
        if($input && !empty($input['emri']) && !empty($input['mesazhi'])) {
            $email = isset($input['email']) ? $input['email'] : '';
            
            $stmt = $conn->prepare("INSERT INTO kontaktet (emri, email, mesazhi) VALUES (?, ?, ?)");
            $stmt->bind_param("sss", $input['emri'], $email, $input['mesazhi']);
            
            if($stmt->execute()) {
                http_response_code(201);
                echo json_encode(["message" => "Mesazhi u ruajt!", "id" => $stmt->insert_id]);
            } else {
                http_response_code(500);
                echo json_encode(["error" => "Gabim gjatë insertimit: " . $stmt->error]);
            }
            $stmt->close();
        } else {
            http_response_code(400);
            echo json_encode(["error" => "Plotesoni fushat e detyrueshme (emri dhe mesazhi)"]);
        }
        break;

    case 'DELETE':
        if (isset($_GET['id'])) {
            $id = intval($_GET['id']);
            $stmt = $conn->prepare("DELETE FROM kontaktet WHERE id = ?");
            $stmt->bind_param("i", $id);
            if($stmt->execute()) {
                echo json_encode(["message" => "U fshi me sukses"]);
            } else {
                echo json_encode(["error" => "Nuk u fshi dot"]);
            }
            $stmt->close();
        }
        break;
}

$conn->close();
?>