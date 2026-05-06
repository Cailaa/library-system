<?php
session_start();
require_once 'db.php';

header('Content-Type: application/json');

if (!isset($_SESSION['student_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit;
}

$student_id = $_SESSION['student_id'];
$name = trim($_POST['name']);
$email = trim($_POST['email']);
$password = trim($_POST['password']);

if (empty($name) || empty($email)) {
    echo json_encode(['success' => false, 'message' => 'Name and email are required']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit;
}

$stmt = $conn->prepare("SELECT id FROM students WHERE email = ? AND id != ?");
$stmt->bind_param("si", $email, $student_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Email is already taken']);
    exit;
}

// Update profile
if (!empty($password)) {
    // Update with new password
    $hashed_password = md5($password);
    $stmt = $conn->prepare("UPDATE students SET name = ?, email = ?, password = ? WHERE id = ?");
    $stmt->bind_param("sssi", $name, $email, $hashed_password, $student_id);
} else {
    // Update without changing password
    $stmt = $conn->prepare("UPDATE students SET name = ?, email = ? WHERE id = ?");
    $stmt->bind_param("ssi", $name, $email, $student_id);
}

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Profile updated successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to update profile']);
}

$stmt->close();
$conn->close();
?>
