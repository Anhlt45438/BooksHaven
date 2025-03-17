document.addEventListener('DOMContentLoaded', function () {
    console.log("Fetching users...");
    fetchUsers(); // Bắt đầu quá trình lấy dữ liệu người dùng
});

// Mức độ ưu tiên vai trò người dùng
const ROLE_PRIORITY = {
    admin: 1,
    shop: 2,
    user: 3
};

// Hàm lấy danh sách người dùng từ API
function fetchUsers() {
    const token = localStorage.getItem("accessToken");

    if (!token) {
        console.log("Chưa đăng nhập, chuyển hướng đến trang đăng nhập...");
        alert("Bạn chưa đăng nhập. Vui lòng đăng nhập lại!");
        window.location.href = "login.html";
        return;
    }

    // Thực hiện gọi API để lấy danh sách người dùng
    fetch('http://localhost:3000/api/admin/users?page=1&limit=10', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                console.log("Lỗi khi lấy dữ liệu người dùng từ API!");
                throw new Error('Lỗi khi lấy dữ liệu từ API');
            }
            console.log("Dữ liệu người dùng đã được tải xuống.");
            return response.json();
        })
        .then(data => {
            console.log("Dữ liệu người dùng đã được phân tích:", data);
            if (data.data) {
                renderUserTable(data.data); // Hiển thị dữ liệu người dùng
            } else {
                console.error("Dữ liệu API không hợp lệ", data);
            }
        })
        .catch(error => {
            console.error("Lỗi khi lấy dữ liệu từ API:", error);
        });
}

// Hàm lấy vai trò cao nhất của người dùng
function getHighestPriorityRole(roles) {
    if (!roles || roles.length === 0) return "Không có vai trò";

    let highestRole = "user"; // Mặc định vai trò thấp nhất
    roles.forEach(role => {
        if (ROLE_PRIORITY[role.ten_role] < ROLE_PRIORITY[highestRole]) {
            highestRole = role.ten_role;
        }
    });

    return highestRole;
}

// Hàm lấy trạng thái người dùng từ mã trạng thái
function getStatusText(status) {
    switch (status) {
        case 1: return "Bình thường";
        case 2: return "Bị khóa";
        default: return "Không xác định";
    }
}

// Hàm hiển thị bảng người dùng
function renderUserTable(users) {
    const userTableBody = document.querySelector('#userList tbody');
    userTableBody.innerHTML = ''; // Xóa các hàng cũ

    // Lặp qua từng người dùng để hiển thị
    users.forEach(user => {
        const row = document.createElement('tr');
        console.log("Đang xử lý người dùng:", user);

        // Cột Vai trò
        const roleCell = document.createElement('td');
        roleCell.textContent = getHighestPriorityRole(user.vai_tro);
        row.appendChild(roleCell);

        // Cột Tên người dùng
        const usernameCell = document.createElement('td');
        usernameCell.textContent = user.username;
        row.appendChild(usernameCell);

        // Cột Email
        const emailCell = document.createElement('td');
        emailCell.textContent = user.email || "Chưa có email";
        row.appendChild(emailCell);

        // Cột nút "Chi tiết"
        const detailCell = document.createElement('td');
        const detailButton = document.createElement('a');
        detailButton.textContent = 'Chi tiết';
        detailButton.href = "#";
        detailButton.addEventListener('click', function (event) {
            event.preventDefault();
            showDetail(user); // Hiển thị chi tiết người dùng
        });
        detailCell.appendChild(detailButton);
        row.appendChild(detailCell);

        // Cột Trạng thái
        const statusCell = document.createElement('td');
        statusCell.textContent = getStatusText(user.trang_thai);
        row.appendChild(statusCell);

        userTableBody.appendChild(row);
    });
}

// Hàm hiển thị chi tiết người dùng
function showDetail(user) {
    console.log("Đang hiển thị chi tiết cho người dùng:", user);
    const highestRole = getHighestPriorityRole(user.vai_tro);

    // Hiển thị thông tin chi tiết người dùng
    document.getElementById('detailName').textContent = user.username;
    document.getElementById('detailEmail').textContent = user.email;
    document.getElementById('detailPhone').textContent = user.sđt || "Chưa có số điện thoại"; // Kiểm tra và hiển thị số điện thoại
    document.getElementById('detailAddress').textContent = user.dia_chi;
    document.getElementById('detailStatus').textContent = getStatusText(user.trang_thai);
    document.getElementById('detailPanel').dataset.userId = user._id;
    document.getElementById('detailPanel').dataset.status = user.trang_thai;
    document.getElementById('detailPanel').style.display = 'block';

    console.log("Chi tiết người dùng đã được hiển thị.");

    // Ẩn trạng thái và nút nếu là admin
    if (highestRole === "admin") {
        console.log("Phát hiện vai trò admin, ẩn phần trạng thái.");
        document.getElementById('detailStatusRow').style.display = "none";
        document.getElementById('statusButtonsRow').style.display = "none";
    } else {
        document.getElementById('detailStatusRow').style.display = "table-row";
        document.getElementById('statusButtonsRow').style.display = "table-row";
    }

    // Ẩn sản phẩm nếu không phải shop
    if (highestRole === "user" || highestRole === "admin") {
        console.log(`${highestRole} phát hiện, ẩn phần sản phẩm.`);
        document.getElementById('detailProductsTitle').style.display = "none";
        document.getElementById('detailProducts').style.display = "none";
    } else if (highestRole === "shop") {
        console.log("Phát hiện vai trò shop, lấy danh sách sản phẩm...");
        fetchShopProducts(user._id);
    }

    // Cập nhật màu sắc nút trạng thái
    updateStatusButtons(user.trang_thai);
}

// Cập nhật màu sắc của các nút trạng thái
function updateStatusButtons(status) {
    document.getElementById('btnBinhThuong').style.backgroundColor = status === 1 ? "#5c67f2" : "#ccc";
    document.getElementById('btnKhoa').style.backgroundColor = status === 2 ? "#e74c3c" : "#ccc";
}

// Hàm lấy sản phẩm của shop từ API
function fetchShopProducts(userId) {
    const token = localStorage.getItem("accessToken");

    fetch(`http://localhost:3000/shops/get-shop-info-from-user-id/${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(shopData => {
            if (shopData.data && shopData.data.id_shop) {
                console.log("Thông tin shop đã được lấy:", shopData.data);
                return fetch(`http://localhost:3000/shops/books?shop_id=${shopData.data.id_shop}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            } else {
                throw new Error("Không tìm thấy thông tin shop");
            }
        })
        .then(response => response.json())
        .then(productData => {
            if (productData.data) {
                console.log("Danh sách sản phẩm shop đã được lấy:", productData.data);
                renderShopProducts(productData.data);
            }
        })
        .catch(error => {
            console.error("Lỗi khi lấy danh sách sản phẩm của shop:", error);
        });
}

// Hàm cập nhật trạng thái người dùng
function updateStatus(newStatus) {
    const token = localStorage.getItem("accessToken");
    const userId = document.getElementById('detailPanel').dataset.userId;

    if (!userId) {
        console.log("Không tìm thấy người dùng để cập nhật trạng thái!");
        alert("Không tìm thấy người dùng!");
        return;
    }

    console.log(`Đang cập nhật trạng thái cho người dùng ${userId} sang ${newStatus}...`);

    fetch(`http://localhost:3000/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
    })
        .then(response => response.json())
        .then(() => {
            console.log("Trạng thái đã được cập nhật thành công.");
            document.getElementById('detailStatus').textContent = getStatusText(newStatus);
            updateStatusButtons(newStatus);
        })
        .catch(error => console.error("Lỗi khi cập nhật trạng thái:", error));
}

// Lắng nghe sự kiện đóng chi tiết người dùng và tải lại trang
document.getElementById('closeDetailBtn').addEventListener('click', function () {
    document.getElementById('detailPanel').style.display = 'none';
    location.reload(); // Tải lại trang
});


// Lắng nghe sự kiện chuyển trạng thái
document.getElementById('btnBinhThuong').addEventListener('click', () => updateStatus(1));
document.getElementById('btnKhoa').addEventListener('click', () => updateStatus(2));
