<?php
include 'db.php';

$result = $conn->query("SELECT id, name, email FROM students");

$data = [];
while($row = $result->fetch_assoc()){
    $data[] = $row;
}

echo json_encode($data);
?>