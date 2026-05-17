<?php
// 1. Header-at për sigurinë dhe CORS
header("Access-Control-Allow-Origin: http://localhost:4200"); // Specifiko origjinën në vend të "*"
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Trajtimi i kërkesave OPTIONS (Preflight) që dërgon Angular
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
    exit;
}

include_once '../../config/database.php';

// 2. Kontrollojmë nëse metoda është DELETE
if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(["status" => "error", "message" => "Vetëm metoda DELETE lejohet."]);
    exit;
}

// 3. Validimi i ID-së
// Kontrollojmë nëse ID ekziston në URL dhe nëse është numër
$id = isset($_GET['id']) ? filter_var($_GET['id'], FILTER_VALIDATE_INT) : null;

if ($id === false || $id === null) {
    http_response_code(400); // Bad Request
    echo json_encode(["status" => "error", "message" => "ID e pavlefshme ose mungon."]);
    exit;
}

// 4. Përgatitja e Query-t me Try-Catch për Error Handling të DB
try {
    $sql = "DELETE FROM Room WHERE room_ID = ?";
    $stmt = mysqli_prepare($conn, $sql);
    
    if (!$stmt) {
        throw new Exception("Gabim në përgatitjen e SQL.");
    }

    mysqli_stmt_bind_param($stmt, "i", $id);
    
    if (mysqli_stmt_execute($stmt)) {
        // Kontrollojmë nëse u fshi vërtet diçka (nëse ID ekzistonte në DB)
        if (mysqli_stmt_affected_rows($stmt) > 0) {
            http_response_code(200);
            echo json_encode(["status" => "success", "message" => "Dhoma u fshi me sukses!"]);
        } else {
            http_response_code(404); // Not Found
            echo json_encode(["status" => "error", "message" => "Dhoma me këtë ID nuk u gjet."]);
        }
    } else {
        throw new Exception(mysqli_stmt_error($stmt));
    }

    mysqli_stmt_close($stmt);

} catch (mysqli_sql_exception $e) {
    // Kap gabimet e Foreign Key (psh. nëse dhoma është e rezervuar)
    http_response_code(409); // Conflict
    echo json_encode([
        "status" => "error", 
        "message" => "Nuk mund të fshihet! Kjo dhomë ka lidhje aktive (rezervime)."
    ]);
} catch (Exception $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(["status" => "error", "message" => "Gabim i sistemit: " . $e->getMessage()]);
}

mysqli_close($conn);
?>