-- Library System Database Setup

CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(100) NOT NULL,
    isbn VARCHAR(20) UNIQUE,
    available_copies INT DEFAULT 1,
    total_copies INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS borrowed_books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    book_id INT NOT NULL,
    borrow_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    return_date TIMESTAMP NULL,
    status ENUM('borrowed', 'returned') DEFAULT 'borrowed',
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (book_id) REFERENCES books(id)
);

-- Insert sample admin (password: admin123)
INSERT INTO admins (username, password) VALUES 
('admin', '21232f297a57a5a743894a0e4a801fc3');

-- Insert sample books
INSERT INTO books (title, author, isbn, total_copies, available_copies) VALUES 
('The Great Gatsby', 'F. Scott Fitzgerald', '978-0-7432-7356-5', 3, 3),
('To Kill a Mockingbird', 'Harper Lee', '978-0-06-112008-4', 2, 2),
('1984', 'George Orwell', '978-0-452-28423-4', 4, 4),
('Pride and Prejudice', 'Jane Austen', '978-0-14-143951-8', 2, 2),
('The Catcher in the Rye', 'J.D. Salinger', '978-0-316-76948-0', 3, 3);
