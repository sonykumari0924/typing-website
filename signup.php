<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

// Database connection
$servername = "localhost";
$username = "root"; // Change if needed
$password = "";     // Add DB password if any
$dbname = "polytype_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Database connection failed."]);
    exit;
}

// Get JSON data
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["status" => "error", "message" => "Invalid request data."]);
    exit;
}

$fullName = $conn->real_escape_string($data['fullName']);
$user = $conn->real_escape_string($data['username']);
$email = $conn->real_escape_string($data['email']);
$pass = password_hash($data['password'], PASSWORD_DEFAULT);

// Check if username already exists
$check = $conn->query("SELECT * FROM users WHERE username='$user'");
if ($check->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "Username already taken."]);
    exit;
}

// Insert new user
$sql = "INSERT INTO users (full_name, username, email, password)
        VALUES ('$fullName', '$user', '$email', '$pass')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["status" => "success", "message" => "Signup successful!"]);
} else {
    echo json_encode(["status" => "error", "message" => "Signup failed."]);
}

$conn->close();
?>

