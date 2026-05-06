<?php
include 'db.php';

$sql = "
SELECT students.name, borrow_records.book_title, borrow_records.due_date
FROM borrow_records
JOIN students ON borrow_records.student_id = students.id
ORDER BY borrow_records.id DESC
";

$result = $conn->query($sql);

$data = [];
while($row = $result->fetch_assoc()){
    $data[] = $row;
}

echo json_encode($data);
?>