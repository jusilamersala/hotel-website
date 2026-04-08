header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Content-Type: application/json; charset=UTF-8");

$db = new PDO("mysql:host=localhost;dbname=grand_horizon", "username", "password");

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        // READ: Fetch all rooms or a specific one
        $stmt = $db->query("SELECT * FROM rooms");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;

    case 'POST':
        // CREATE: Add a new room
        $data = json_decode(file_get_contents("php://input"));
        $sql = "INSERT INTO rooms (room_number, type, price) VALUES (?, ?, ?)";
        $db->prepare($sql)->execute([$data->room_number, $data->type, $data->price]);
        echo json_encode(["status" => "Room Created"]);
        break;

    case 'PUT':
        // UPDATE: Modify existing room details
        $data = json_decode(file_get_contents("php://input"));
        $sql = "UPDATE rooms SET type = ?, price = ? WHERE id = ?";
        $db->prepare($sql)->execute([$data->type, $data->price, $data->id]);
        echo json_encode(["status" => "Room Updated"]);
        break;

    case 'DELETE':
        // DELETE: Remove a room
        $id = $_GET['id'];
        $db->prepare("DELETE FROM rooms WHERE id = ?")->execute([$id]);
        echo json_encode(["status" => "Room Deleted"]);
        break;
}