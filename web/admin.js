document.addEventListener('DOMContentLoaded', function () {
    fetchUsers();
});

function fetchUsers() {
    fetch('http://localhost:3000/api/admin/users?page=1&limit=10', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjdjZWE3ODkzMmE5OTU5NDdlZjI3ODU4IiwidG9rZW5fdHlwZSI6MCwiaWF0IjoxNzQyMDQ0NTUyLCJleHAiOjE3NDIwNjI1NTJ9.NyqadQ50MS9pG8yoWoapoE4T53Grf-yCBbvh3VZ0s08',
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.data) {
                renderUserTable(data.data);
            } else {
                console.error("Dữ liệu API không hợp lệ", data);
            }
        })
        .catch(error => console.error("Lỗi khi lấy dữ liệu từ API:", error));
}

function renderUserTable(users) {
    const userTableBody = document.querySelector('#userList tbody');
    userTableBody.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');

        // Cột Vai trò (tạm thời để trống)
        const roleCell = document.createElement('td');
        roleCell.textContent = '';
        row.appendChild(roleCell);

        // Cột Tên người dùng
        const usernameCell = document.createElement('td');
        usernameCell.textContent = user.username;
        row.appendChild(usernameCell);

        // Cột nút "Chi tiết"
        const detailCell = document.createElement('td');
        const detailButton = document.createElement('a');
        detailButton.textContent = 'Chi tiết';
        detailButton.href = "#";
        detailButton.addEventListener('click', function (event) {
            event.preventDefault();
            showDetail(user);
        });
        detailCell.appendChild(detailButton);
        row.appendChild(detailCell);

        // Cột Trạng thái
        const statusCell = document.createElement('td');
        statusCell.textContent = user.trang_thai;
        row.appendChild(statusCell);

        userTableBody.appendChild(row);
    });
}

// Hàm hiển thị chi tiết người dùng
function showDetail(user) {
    document.getElementById('detailName').textContent = user.username;
    document.getElementById('detailEmail').textContent = user.email;
    document.getElementById('detailPhone').textContent = user.sdt;
    document.getElementById('detailAddress').textContent = user.dia_chi;
    document.getElementById('detailStatus').textContent = user.trang_thai;

    document.getElementById('detailPanel').style.display = 'block';
}

// Đóng chi tiết
document.getElementById('closeDetailBtn').addEventListener('click', function () {
    document.getElementById('detailPanel').style.display = 'none';
});
