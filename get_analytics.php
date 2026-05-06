<?php
include 'db.php';

$students = $conn->query("SELECT COUNT(*) as total FROM students")->fetch_assoc()['total'];
$borrowed = $conn->query("SELECT COUNT(*) as total FROM borrow_records")->fetch_assoc()['total'];

echo json_encode([
  "students" => $students,
  "borrowed" => $borrowed
]);
?>