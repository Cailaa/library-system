<?php
session_start();
include 'db.php';

$borrow_id = $_POST['id'];
$student_id = $_SESSION['student_id'];

$stmt = $conn->prepare("DELETE FROM borrow_records WHERE id=? AND student_id=?");
$stmt->bind_param("ii", $borrow_id, $student_id);

if($stmt->execute()){
    echo "returned";
} else {
    echo "error";
}
?>