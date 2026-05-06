<?php
session_start();
require_once 'db.php';

header('Content-Type: application/json');

if (!isset($_SESSION['student_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit;
}

$student_id = $_SESSION['student_id'];

$stmt = $conn->prepare("SELECT name, email FROM students WHERE id = ?");
$stmt->bind_param("i", $student_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $student = $result->fetch_assoc();
    echo json_encode([
        'success' => true,
        'name' => $student['name'],
        'email' => $student['email']
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Student not found']);
}

$stmt->close();
$conn->close();
?>
