<?php
session_start();
include 'db.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'User not logged in']);
    exit();
}

$user_id = $_SESSION['user_id'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $wpm = intval($_POST['wpm']);
    $accuracy = intval($_POST['accuracy']);
    $consistency = intval($_POST['consistency']);
    $level = intval($_POST['level']);
    $duration = intval($_POST['duration']);

    $stmt = $conn->prepare("INSERT INTO user_typing_stats (user_id, wpm, accuracy, consistency, level, test_duration) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("iiiiii", $user_id, $wpm, $accuracy, $consistency, $level, $duration); // we'll fix the order
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to save stats']);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request']);
}
?>
