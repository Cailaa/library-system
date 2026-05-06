<?php
include 'db.php';

$name = $_POST['name'];
$email = $_POST['email'];
$password = $_POST['password'];

$check = $conn->query("SELECT * FROM students WHERE email='$email'");

if ($check->num_rows > 0) {
    echo "Account already exists!";
} else {
    $conn->query("INSERT INTO students(name,email,password)
                  VALUES('$name','$email','$password')");
    echo "Account created!";
}
?>
