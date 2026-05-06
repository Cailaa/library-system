<?php
session_start();
include 'db.php';

$username = $_POST['username'];
$password = $_POST['password'];

$res = $conn->query("SELECT * FROM admins WHERE username='$username' AND password='$password'");

if ($res->num_rows > 0) {
    $_SESSION['admin'] = true;
    echo "success";
} else {
    echo "error";
}
?>
