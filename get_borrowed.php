<?php
session_start();
include 'db.php';

$id = $_SESSION['student_id'];

$stmt = $conn->prepare("SELECT * FROM borrow_records WHERE student_id=?");
$stmt->bind_param("i", $id);
$stmt->execute();

$result = $stmt->get_result();

$data = [];

while($row = $result->fetch_assoc()){
    $data[] = $row;
}

echo json_encode($data);
?>