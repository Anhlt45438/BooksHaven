// ==== Khởi tạo sau khi trang tải ====
document.addEventListener('DOMContentLoaded', function () {
    console.log("✅ Trang đã được tải. Bắt đầu lấy dữ liệu người dùng...");
    fetchUsers();

    // Tìm kiếm người dùng
    document.getElementById('searchInput').addEventListener('input', function () {
        const query = this.value.toLowerCase();
        console.log(`🔍 Tìm kiếm với từ khóa: "${query}"`);
        filterUsers(query);
    });

    // Phân trang
    document.getElementById('prevPage').addEventListener('click', function () {
        changePage('prev');
    });

    document.getElementById('nextPage').addEventListener('click', function () {
        changePage('next');
    });

    // Gán sự kiện cho các nút thay đổi trạng thái
    document.getElementById('btnBinhThuong').addEventListener('click', function () {
        const userId = document.getElementById('detailPanel').dataset.userId;
        const currentStatus = document.getElementById('detailPanel').dataset.status;
        const newStatus = 1;  // Trạng thái "Bình thường"

        // Kiểm tra nếu trạng thái hiện tại là "Bình thường", không cần thay đổi
        if (currentStatus === String(newStatus)) {
            alert("Trạng thái đã là 'Bình thường'.");
            return;
        }

        // Hiển thị hộp thoại xác nhận
        if (confirm("Bạn có chắc chắn muốn thay đổi trạng thái thành 'Bình thường'?")) {
            updateStatus(newStatus);  // Cập nhật trạng thái sau khi xác nhận
        }
    });

    document.getElementById('btnKhoa').addEventListener('click', function () {
        const userId = document.getElementById('detailPanel').dataset.userId;
        const currentStatus = document.getElementById('detailPanel').dataset.status;
        const newStatus = 2;  // Trạng thái "Khóa"

        // Kiểm tra nếu trạng thái hiện tại là "Khóa", không cần thay đổi
        if (currentStatus === String(newStatus)) {
            alert("Trạng thái đã là 'Khóa'.");
            return;
        }

        // Hiển thị hộp thoại xác nhận
        if (confirm("Bạn có chắc chắn muốn thay đổi trạng thái thành 'Khóa'?")) {
            updateStatus(newStatus);  // Cập nhật trạng thái sau khi xác nhận
        }
    });


    // Gán sự kiện cho nút "Đóng" trong panel chi tiết
    document.getElementById('closeDetailBtn').addEventListener('click', function () {
        closeDetailPanel();  // Gọi hàm đóng panel chi tiết
    });

});

// ==== Biến toàn cục & cấu hình ====
const ROLE_PRIORITY = { admin: 1, shop: 2, user: 3 };
let allUsers = [];
let currentPage = 1;
const limit = 10;
let isFetching = false;  // ✅ Thêm biến kiểm tra trạng thái fetching

// ==== Gọi API lấy danh sách người dùng ====
function fetchUsers(page) {
    if (isFetching) return; // Nếu đang fetch, không làm gì
    isFetching = true; // Bắt đầu fetch

    console.log(`📥 Đang tải người dùng cho trang ${page}...`);
    const token = localStorage.getItem("accessToken");

    if (!token) {
        alert("⚠️ Bạn chưa đăng nhập.");
        window.location.replace("/admin-site/login");
        return;
    }

    fetch(`http://14.225.206.60:3000/api/admin/users?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => {
            if (data?.data) {
                allUsers = data.data;
                renderUserTable(allUsers);
                updatePagination(data.pagination);
                console.log(`✅ Đã tải ${allUsers.length} người dùng`);
            } else {
                console.error("❌ Dữ liệu người dùng không hợp lệ:", data);
            }
        })
        .catch(err => {
            console.error("❌ Lỗi khi lấy danh sách người dùng:", err);
        })
        .finally(() => {
            isFetching = false; // Kết thúc fetch
        });
}

// Hàm hiển thị danh sách người dùng
function renderUserTable(users) {
    const tbody = document.querySelector('#userList tbody');
    tbody.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');

        const roleCell = document.createElement('td');
        roleCell.textContent = getHighestPriorityRole(user.vai_tro);  // Lấy vai trò người dùng
        row.appendChild(roleCell);

        const nameCell = document.createElement('td');
        nameCell.textContent = user.username;
        row.appendChild(nameCell);

        const emailCell = document.createElement('td');
        emailCell.textContent = user.email || 'Chưa có email';
        row.appendChild(emailCell);

        const detailCell = document.createElement('td');
        const detailBtn = document.createElement('a');
        detailBtn.href = "#";
        detailBtn.textContent = "Chi tiết";
        detailBtn.addEventListener('click', e => {
            e.preventDefault();
            showDetail(user);  // Hiển thị chi tiết người dùng khi nhấn nút
        });
        detailCell.appendChild(detailBtn);
        row.appendChild(detailCell);

        const statusCell = document.createElement('td');
        statusCell.textContent = getStatusText(user.trang_thai);  // Hiển thị trạng thái của người dùng
        row.appendChild(statusCell);

        tbody.appendChild(row);
    });
}

// ==== Cập nhật giao diện phân trang ====
function updatePagination(pagination) {
    document.getElementById('currentPage').textContent = currentPage;
    document.getElementById('prevPage').disabled = currentPage <= 1;
    document.getElementById('nextPage').disabled = currentPage >= pagination.totalPages;
    console.log(`📄 Trang hiện tại: ${currentPage} / ${pagination.totalPages}`);
}

// ==== Chuyển trang ====
function changePage(direction) {
    console.log(`🟡 changePage() gọi với hướng: ${direction}`);
    if (isFetching) return; // Kiểm tra trạng thái fetching

    if (direction === 'prev' && currentPage > 1) {
        currentPage--;
    } else if (direction === 'next') {
        currentPage++;
    }
    console.log(`➡️ Đang chuyển đến trang: ${currentPage}`);
    fetchUsers(currentPage);
}

// ==== Tìm kiếm người dùng ====
function filterUsers(query) {
    const filtered = allUsers.filter(user =>
        user.username.toLowerCase().includes(query) ||
        (user.email && user.email.toLowerCase().includes(query))
    );
    console.log(`🔎 Tìm thấy ${filtered.length} người dùng khớp từ khóa`);
    renderUserTable(filtered);
}

// ==== Lấy vai trò cao nhất ====
function getHighestPriorityRole(roles) {
    if (!roles || roles.length === 0) return "Không có vai trò";
    let highest = "user";
    roles.forEach(r => {
        if (ROLE_PRIORITY[r.ten_role] < ROLE_PRIORITY[highest]) highest = r.ten_role;
    });
    return highest;
}

// ==== Hiển thị chi tiết người dùng ====
function showDetail(user) {
    const role = getHighestPriorityRole(user.vai_tro);

    document.getElementById('detailName').textContent = user.username;
    document.getElementById('detailEmail').textContent = user.email;
    document.getElementById('detailPhone').textContent = user.sdt || user.sđt || 'Chưa có số';
    document.getElementById('detailAddress').textContent = user.dia_chi || 'Chưa có địa chỉ';
    document.getElementById('detailStatus').textContent = getStatusText(user.trang_thai);
    document.getElementById('detailPanel').style.display = 'block';
    document.getElementById('detailPanel').dataset.userId = user._id;
    document.getElementById('detailPanel').dataset.status = user.trang_thai;

    if (role === 'admin') {
        document.getElementById('detailStatusRow').style.display = 'none';
        document.getElementById('statusButtonsRow').style.display = 'none';
    } else {
        document.getElementById('detailStatusRow').style.display = 'table-row';
        document.getElementById('statusButtonsRow').style.display = 'table-row';
    }

    if (role === 'shop') {
        console.log("🏪 Người dùng là shop. Đang lấy sản phẩm...");
        fetchShopProducts(user._id);
    } else {
        document.getElementById('detailProductsTitle').style.display = 'none';
        document.getElementById('detailProducts').style.display = 'none';
        document.getElementById('shopNameRow').style.display = 'none';
        document.getElementById('detailShopName').style.display = 'none';
        document.getElementById('shopAddressRow').style.display = 'none';
        document.getElementById('detailShopAddress').style.display = 'none';
    }

    updateStatusButtons(user.trang_thai);
}

// Hàm chuyển trạng thái thành văn bản hiển thị
function getStatusText(status) {
    switch (status) {
        case 1: return "Bình thường";
        case 2: return "Bị khóa";
        default: return "Không xác định";
    }
}

// Cập nhật giao diện các nút trạng thái (Bình thường và Khóa)
function updateStatusButtons(status) {
    // Thay đổi màu nền nút "Bình thường" và "Khóa"
    document.getElementById('btnBinhThuong').style.backgroundColor = status === 1 ? '#5c67f2' : '#ccc';
    document.getElementById('btnKhoa').style.backgroundColor = status === 2 ? '#e74c3c' : '#ccc';
}

// ==== Lấy sản phẩm shop ====
function fetchShopProducts(userId) {
    const token = localStorage.getItem("accessToken");
    let shopId = null;

    console.log(`📦 Lấy thông tin shop từ userId: ${userId}`);
    fetch(`http://14.225.206.60:3000/api/shops/get-shop-info-from-user-id/${userId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(shopData => {
            if (!shopData?.data?.id_shop) throw new Error("Không tìm thấy shop");
            shopId = shopData.data.id_shop;

            document.getElementById('shopNameRow').style.display = "table-row";
            document.getElementById('shopAddressRow').style.display = "table-row";
            document.getElementById('detailShopName').textContent = shopData.data.ten_shop || 'Chưa có tên';
            document.getElementById('detailShopAddress').textContent = shopData.data.dia_chi || 'Chưa cập nhật';

            return fetch(`http://14.225.206.60:3000/api/books?page=1&limit=20`);
        })
        .then(res => res.json())
        .then(bookData => {
            const books = bookData.data || [];
            const filtered = books.filter(book => book.id_shop === shopId);
            console.log(`📚 Đã lọc được ${filtered.length} sản phẩm từ shop`);
            renderShopProducts(filtered);
        })
        .catch(err => {
            console.error("❌ Lỗi khi lấy sản phẩm của shop:", err.message);
            document.getElementById('detailProducts').innerHTML = "<p>Không có sản phẩm nào.</p>";
        });
}

// ==== Hiển thị sản phẩm của shop ====
function renderShopProducts(products) {
    const container = document.getElementById('detailProducts');
    container.innerHTML = '';
    document.getElementById('detailProductsTitle').style.display = "block";
    container.style.display = "block";

    products.forEach(p => {
        const item = document.createElement('div');
        item.className = 'product-item';

        const img = document.createElement('img');
        img.src = p.anh || 'default-product-image.jpg';

        const info = document.createElement('div');
        info.className = 'product-details';

        const name = document.createElement('p');
        name.textContent = p.ten_sach;

        info.appendChild(name);
        item.appendChild(img);
        item.appendChild(info);
        container.appendChild(item);
    });
}

// Hàm cập nhật trạng thái người dùng
function updateStatus(newStatus) {
    const userId = document.getElementById('detailPanel').dataset.userId;
    const token = localStorage.getItem("accessToken");

    if (!userId) {
        alert("Không tìm thấy người dùng.");
        return;
    }

    // Gửi yêu cầu PUT để cập nhật trạng thái người dùng
    fetch(`http://14.225.206.60:3000/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
    })
        .then(res => res.json())
        .then(() => {
            // Cập nhật lại trạng thái hiển thị trong panel chi tiết
            document.getElementById('detailStatus').textContent = getStatusText(newStatus);
            updateStatusButtons(newStatus);  // Cập nhật giao diện nút bấm
            console.log("✅ Trạng thái người dùng đã được cập nhật");

            // Cập nhật lại trạng thái trong danh sách người dùng
            const userIndex = allUsers.findIndex(u => u._id === userId);
            if (userIndex !== -1) {
                allUsers[userIndex].trang_thai = newStatus;
                renderUserTable(allUsers);  // Re-render bảng người dùng
            }
        })
        .catch(err => console.error("❌ Lỗi khi cập nhật trạng thái:", err));
}

// Hàm đóng panel chi tiết
function closeDetailPanel() {
    document.getElementById('detailPanel').style.display = 'none';  // Ẩn panel chi tiết
    console.log("❌ Đóng panel chi tiết");
}