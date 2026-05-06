<?php
session_start();
include 'db.php';

$student_id = $_SESSION['student_id'];
$title = $_POST['title'];

$check = $conn->prepare("SELECT * FROM borrow_records WHERE student_id=? AND book_title=?");
$check->bind_param("is", $student_id, $title);
$check->execute();
$result = $check->get_result();

if($result->num_rows > 0){
    echo "already";
    exit;
}

$due_date = date('Y-m-d', strtotime('+7 days'));

$stmt = $conn->prepare("INSERT INTO borrow_records (student_id, book_title, due_date)
VALUES (?, ?, ?)");

$stmt->bind_param("iss", $student_id, $title, $due_date);

if($stmt->execute()){
    echo "success";
} else {
    echo "error";
}
?>