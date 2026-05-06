let currentBooks = [];

// SWITCH DASHBOARD SECTIONS
function showSection(id) {
  // hide all sections
  document.querySelectorAll('.section').forEach(sec => {
    sec.classList.remove('active');
  });

  // show selected section
  document.getElementById(id).classList.add('active');

  // FIX ACTIVE SIDEBAR BUTTON
  document.querySelectorAll('.sidebar button[id^="nav-"]').forEach(btn => {
    btn.classList.remove('active');
  });

  const activeBtn = document.getElementById('nav-' + id);
  if (activeBtn) activeBtn.classList.add('active');
}

// STUDENT LOGIN
function studentLogin() {
  fetch('api/login_student.php', {
    method: 'POST',
    body: new URLSearchParams({
      email: document.getElementById('email').value,
      password: document.getElementById('password').value
    })
  })
  .then(res => res.text())
  .then(data => {
    if (data === "success") {
      window.location = "student_dashboard.html";
    } else {
      alert("Invalid account!");
    }
  });
}

// ADMIN LOGIN
function adminLogin() {
  fetch('api/login_admin.php', {
    method: 'POST',
    body: new URLSearchParams({
      username: document.getElementById('username').value,
      password: document.getElementById('password').value
    })
  })
  .then(res => res.text())
  .then(data => {
    if (data === "success") {
      window.location = "admin_dashboard.html";
    } else {
      alert("Invalid admin!");
    }
  });
}

// SIGNUP
function signup() {
  fetch('api/signup.php', {
    method: 'POST',
    body: new URLSearchParams({
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      password: document.getElementById('password').value
    })
  })
  .then(res => res.text())
  .then(data => {
    alert(data);
    window.location = "student_login.html";
  });
}

// LOAD BORROWED BOOKS
function loadBorrowed() {
  fetch('api/get_borrowed.php')
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("borrowList");

      if (data.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <div class="empty-icon">📭</div>
            <p>You haven't borrowed any books yet.</p>
          </div>`;
        return;
      }

      let html = "";
      data.forEach(b => {
        html += `
        <div class="card">
          <div style="font-size:2.2rem; flex-shrink:0;">📖</div>
          <div class="book-info">
            <strong>${b.book_title}</strong>
            <div class="due-badge">Due: ${b.due_date}</div>
          </div>
          <button class="return-btn"
            data-title="${b.book_title.replace(/"/g, '&quot;')}"
            onclick="returnBook(${b.id}, this.dataset.title)">
            Return
          </button>
        </div>`;
      });

      container.innerHTML = html;
    });
}

// LOGOUT
function logout() {
  window.location = "index.html";
}

// SEARCH BOOKS
function searchBooks() {
  let query = document.getElementById("searchInput").value;

  if (!query.trim()) {
    alert("Please enter a book name");
    return;
  }

  document.getElementById("bookList").innerHTML = "<p style='color:#9ca3af;padding:20px;'>Loading books...</p>";

  fetch(`https://openlibrary.org/search.json?q=${query}&fields=title,author_name,cover_i,key,subject`)
    .then(res => res.json())
    .then(data => {
      currentBooks = data.docs.slice(0, 10);
      displayBooks(currentBooks);
    })
    .catch(err => {
      console.error(err);
      document.getElementById("bookList").innerHTML = "Failed to load books.";
    });
}

// DISPLAY BOOKS
function displayBooks(bookArray) {
  if (bookArray.length === 0) {
    document.getElementById("bookList").innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <p>No books found. Try a different search.</p>
      </div>`;
    return;
  }

  let html = "";

  bookArray.forEach((book, index) => {
    let title = book.title || "No title";
    let author = book.author_name ? book.author_name[0] : "Unknown Author";
    let bookKey = book.key;

    let cover = book.cover_i
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
      : `https://via.placeholder.com/80x120?text=No+Cover`;

    html += `
    <div class="card">
      <img src="${cover}" class="book-cover" alt="${title}">
      <div class="book-info">
        <strong>${title}</strong>
        <span>${author}</span>

        <div onclick="toggleDescription('${bookKey}', 'desc-${index}', this)"
          class="toggle-text">
          ▸ See description
        </div>

        <div id="desc-${index}" data-open="false" class="description"></div>
      </div>

      <button class="borrow-btn"
        data-title="${title.replace(/"/g, '&quot;')}"
        onclick="borrowBook(this.dataset.title, this)">
        Borrow
      </button>
    </div>
    `;
  });

  document.getElementById("bookList").innerHTML = html;
}

// FILTER BOOKS
function applyFilter() {
  let selected = document.getElementById("genreFilter").value;

  if (selected === "all") {
    searchBooksDefault();
    return;
  }

  document.getElementById("bookList").innerHTML = "<p style='color:#9ca3af;padding:20px;'>Loading books...</p>";

  fetch(`https://openlibrary.org/search.json?subject=${selected}&fields=title,author_name,cover_i,key,subject`)
    .then(res => res.json())
    .then(data => {
      currentBooks = data.docs.slice(0, 20);
      displayBooks(currentBooks);
    })
    .catch(() => {
      document.getElementById("bookList").innerHTML = "Failed to load books.";
    });
}

// TOGGLE DESCRIPTION
function toggleDescription(key, targetId, el) {
  const container = document.getElementById(targetId);
  const isOpen = container.getAttribute("data-open") === "true";

  if (isOpen) {
    container.style.display = "none";
    container.setAttribute("data-open", "false");
    el.textContent = "▸ See description";
    return;
  }

  container.style.display = "block";
  container.innerHTML = "<em style='color:#9ca3af;'>Loading...</em>";

  fetch(`https://openlibrary.org${key}.json`)
    .then(res => res.json())
    .then(data => {
      let description = "No description available.";
      if (data.description) {
        description = typeof data.description === 'string'
          ? data.description
          : data.description.value;
      }
      container.innerHTML = `<strong>Summary:</strong> ${description}`;
      container.setAttribute("data-open", "true");
      el.textContent = "▾ Hide description";
    })
    .catch(() => {
      container.innerHTML = "Could not load description.";
    });
}

// BORROW BOOK
function borrowBook(title, btn) {
  btn.disabled = true;
  btn.textContent = "Borrowing...";

  fetch('api/borrow.php', {
    method: 'POST',
    body: new URLSearchParams({ title: title })
  })
  .then(res => res.text())
  .then(data => {
    if (data === "success") {
      btn.textContent = "Borrowed ✓";
      btn.style.background = "#d1d5db";
      loadBorrowed();
    } else if (data === "already") {
      btn.textContent = "Already borrowed";
      btn.style.background = "#d1d5db";
    } else {
      btn.textContent = "Borrow";
      btn.disabled = false;
      alert("Failed to borrow");
    }
  });
}

// RETURN BOOK
function returnBook(id, title) {
  fetch('api/return.php', {
    method: 'POST',
    body: new URLSearchParams({ id: id })
  })
  .then(res => res.text())
  .then(data => {
    if (data === "returned") {
      loadBorrowed();
      resetBorrowButton(title);
    } else {
      alert("Failed to return book");
    }
  });
}

// RESET BUTTON AFTER RETURN
function resetBorrowButton(title) {
  const buttons = document.querySelectorAll(".borrow-btn");
  buttons.forEach(btn => {
    if (btn.dataset.title === title) {
      btn.textContent = "Borrow";
      btn.disabled = false;
      btn.style.background = "";
    }
  });
}

function searchBooksDefault() {
  document.getElementById("bookList").innerHTML = "<p style='color:#9ca3af;padding:20px;'>Loading books...</p>";

  fetch(`https://openlibrary.org/search.json?q=bestseller&fields=title,author_name,cover_i,key,subject`)
    .then(res => res.json())
    .then(data => {
      currentBooks = data.docs.slice(0, 20);
      displayBooks(currentBooks);
    })
    .catch(() => {
      document.getElementById("bookList").innerHTML = "Failed to load books.";
    });
}

// PROFILE EDITING FUNCTIONS
function openEditProfileModal() {
  // Load current profile data
  fetch('api/get_profile.php')
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        document.getElementById('editName').value = data.name;
        document.getElementById('editEmail').value = data.email;
        document.getElementById('editPassword').value = '';
        document.getElementById('editProfileModal').style.display = 'block';
      } else {
        alert('Failed to load profile data');
      }
    })
    .catch(err => {
      console.error('Error loading profile:', err);
      alert('Error loading profile data');
    });
}

function closeEditProfileModal() {
  document.getElementById('editProfileModal').style.display = 'none';
}

function updateProfile(event) {
  event.preventDefault();
  
  const formData = new FormData(document.getElementById('editProfileForm'));
  
  fetch('api/update_profile.php', {
    method: 'POST',
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      // Update profile display
      document.getElementById('profileName').textContent = formData.get('name');
      document.getElementById('profileEmail').textContent = formData.get('email');
      
      // Close modal
      closeEditProfileModal();
      
      alert('Profile updated successfully!');
    } else {
      alert('Failed to update profile: ' + data.message);
    }
  })
  .catch(err => {
    console.error('Error updating profile:', err);
    alert('Error updating profile');
  });
}

// Close modal when clicking outside
window.onclick = function(event) {
  const modal = document.getElementById('editProfileModal');
  if (event.target === modal) {
    closeEditProfileModal();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("bookList")) searchBooksDefault();
  if (document.getElementById("borrowList")) loadBorrowed();

  if (document.getElementById("profile")) {
    loadProfileData();
  }

  if (document.getElementById("usersList")) loadUsers();
  if (document.getElementById("recordsList")) loadRecords();
  if (document.getElementById("analyticsData")) loadAnalytics();
});

function loadProfileData() {
  fetch('api/get_profile.php')
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        document.getElementById('profileName').textContent = data.name;
        document.getElementById('profileEmail').textContent = data.email;
      }
    })
    .catch(err => {
      console.error('Error loading profile data:', err);
    });
}

function loadUsers() {
  fetch('api/get_students.php')
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("usersList");

      if (data.length === 0) {
        container.innerHTML = "<p>No students found.</p>";
        return;
      }

      let html = "";
      data.forEach(u => {
      html += `
<div class="card">
  <div class="user-icon">👤</div>
  <div class="book-info">
    <strong>${u.name}</strong>
    <span>${u.email}</span>
  </div>
</div>`;
      });

      container.innerHTML = html;
    });
}

function loadRecords() {
  fetch('api/get_records.php')
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("recordsList");

      if (data.length === 0) {
        container.innerHTML = "<p>No books borrowed yet.</p>";
        return;
      }

      let html = `
      <div class="record-row record-header">
        <div>Student</div>
        <div>Book</div>
        <div>Due Date</div>
      </div>`;

      data.forEach(r => {
        html += `
        <div class="record-row">
          <div>${r.name}</div>
          <div>${r.book_title}</div>
          <div>${r.due_date}</div>
        </div>`;
      });

      container.innerHTML = html;
    });
}

function loadAnalytics() {
  fetch('api/get_analytics.php')
    .then(res => res.json())
    .then(data => {
      document.getElementById("analyticsData").innerHTML = `
        <div class="analytics-card">
          <div class="analytics-title">👥 Total Students</div>
          <div class="analytics-value">${data.students}</div>
          <div class="analytics-sub">Registered users in system</div>
        </div>

        <div class="analytics-card">
          <div class="analytics-title">📚 Borrowed Books</div>
          <div class="analytics-value">${data.borrowed}</div>
          <div class="analytics-sub">Currently borrowed records</div>
        </div>
      `;
    });
}