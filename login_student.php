<?php
session_start();
include 'db.php';

$email = $_POST['email'];
$password = $_POST['password'];

$res = $conn->query("SELECT * FROM students WHERE email='$email' AND password='$password'");

if ($res->num_rows > 0) {
    $user = $res->fetch_assoc();
    $_SESSION['student_id'] = $user['id'];
    echo "success";
} else {
    echo "error";
}
?>
