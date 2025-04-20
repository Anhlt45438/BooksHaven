function checkAuth() {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        alert("⚠️ Bạn chưa đăng nhập.");
        window.location.replace("/admin-site/login");
        return false;
    }
    return true;
}

document.addEventListener('DOMContentLoaded', function () {
    if (!checkAuth()) return;
    console.log("✅ Trang đã được tải. Bắt đầu lấy dữ liệu thông báo...");
    fetchNotifications();

    // Tìm kiếm thông báo
    document.getElementById('searchInput').addEventListener('input', function () {
        const query = this.value.toLowerCase();
        console.log(`🔍 Tìm kiếm với từ khóa: "${query}"`);
        filterNotifications(query);
    });

    // Gán sự kiện cho nút "Đóng" trong panel chi tiết
    document.getElementById('closeAnnouncementDetailBtn').addEventListener('click', function () {
        closeDetailPanel();  // Gọi hàm đóng panel chi tiết
    });
});

// ==== Biến toàn cục & cấu hình ====
let allNotifications = [];

// ==== Gọi API lấy danh sách thông báo với phân trang ==== 
function fetchNotifications() {
    const token = localStorage.getItem("accessToken");

    if (!token) {
        alert("⚠️ Bạn chưa đăng nhập.");
        window.location.replace("/admin-site/login");
        return;
    }

    console.log("📥 Đang tải thông báo...");

    // Lấy dữ liệu phân trang từ API
    fetch(`http://14.225.206.60:3000/api/notifications/list-notifications-system?page=${currentPage}&limit=${limit}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })
        .then(res => res.json())
        .then(data => {
            if (data?.data) {
                allNotifications = data.data;
                totalPages = data.pagination.total_pages; // Cập nhật số trang tổng cộng từ API
                renderNotificationTable(allNotifications); // Hiển thị thông báo
                updatePagination(); // Cập nhật giao diện phân trang
                console.log(`✅ Đã tải ${allNotifications.length} thông báo`);
            } else {
                console.error("❌ Dữ liệu thông báo không hợp lệ:", data);
            }
        })
        .catch(err => {
            console.error("❌ Lỗi khi lấy danh sách thông báo:", err);
        });
}


// ==== Hiển thị danh sách thông báo ====
function renderNotificationTable(notifications) {
    const tbody = document.querySelector('#userList tbody');
    tbody.innerHTML = '';

    notifications.forEach(notification => {
        const row = document.createElement('tr');

        // Cột Tiêu đề thông báo
        const titleCell = document.createElement('td');
        titleCell.textContent = notification.tieu_de;
        row.appendChild(titleCell);

        // Cột Người nhận thông báo
        const recipientCell = document.createElement('td');
        getRecipientName(notification).then(recipientName => {
            recipientCell.textContent = recipientName;
            row.appendChild(recipientCell);
        });

        // Cột Ngày gửi thông báo
        const sendDateCell = document.createElement('td');
        sendDateCell.textContent = notification.ngay_tao;
        row.appendChild(sendDateCell);

        // Cột Chi tiết: khi click sẽ hiển thị panel chi tiết thông báo
        const detailCell = document.createElement('td');
        const detailLink = document.createElement('a');
        detailLink.href = "#";
        detailLink.textContent = "Chi tiết";
        detailLink.addEventListener('click', function (event) {
            event.preventDefault();
            showNotificationDetail(notification);
        });
        detailCell.appendChild(detailLink);
        row.appendChild(detailCell);

        tbody.appendChild(row);
    });
}

// ==== Lấy thông tin người nhận thông báo (dựa trên id_user hoặc id_role) ====
async function getRecipientName(notification) {
    let recipientName = "";

    // Kiểm tra nếu có id_user
    if (notification.id_user && notification.id_user !== "") {
        console.log(`🔄 Đang lấy tên người nhận từ id_user: ${notification.id_user}`);

        // Lấy thông tin người nhận từ API users
        const userResponse = await fetch(`http://14.225.206.60:3000/api/admin/users/${notification.id_user}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,
                'Content-Type': 'application/json',
            }
        });

        const userData = await userResponse.json();
        if (userData?.data) {
            recipientName = userData.data.username;  // Lấy tên người dùng
            console.log(`✅ Đã lấy tên người nhận: ${recipientName}`);
        } else {
            console.error("❌ Không thể lấy tên người nhận từ API.");
            recipientName = "Chưa có tên người nhận";  // Hiển thị nếu không lấy được thông tin người nhận
        }
    } else if (notification.roles && notification.roles.length > 0) {
        // Nếu không có id_user nhưng có roles
        console.log(`🔄 Đang lấy tên vai trò từ roles: ${notification.roles[0].ten_role}`);

        // Lấy tên vai trò từ roles
        recipientName = notification.roles[0].ten_role;
        console.log(`✅ Đã lấy tên vai trò: ${recipientName}`);
    } else {
        // Nếu không có id_user và roles
        recipientName = "Không có người nhận";
        console.error("❌ Không có thông tin người nhận hoặc vai trò.");
    }

    return recipientName;
}


// ==== Hiển thị chi tiết thông báo trên panel ====
async function showNotificationDetail(notification) {
    document.getElementById('detailTitle').textContent = notification.tieu_de;
    document.getElementById('detailContent').textContent = notification.noi_dung_thong_bao;

    // Lấy tên người nhận từ hàm getRecipientName
    const recipientName = await getRecipientName(notification);
    document.getElementById('detailRecipient').textContent = recipientName;  // Hiển thị tên người nhận

    document.getElementById('detailSendDate').textContent = notification.ngay_tao;

    // Hiển thị panel chi tiết
    document.getElementById('announcementDetailPanel').style.display = 'block';
}

// ==== Đóng panel chi tiết thông báo ====
function closeDetailPanel() {
    document.getElementById('announcementDetailPanel').style.display = 'none';  // Ẩn panel chi tiết
    console.log("❌ Đóng panel chi tiết");
}

// ==== Tìm kiếm thông báo ====
function filterNotifications(query) {
    const filtered = allNotifications.filter(notification =>
        notification.tieu_de.toLowerCase().includes(query) ||
        (notification.id_nguoi_nhan && notification.id_nguoi_nhan.toLowerCase().includes(query))
    );
    console.log(`🔎 Tìm thấy ${filtered.length} thông báo khớp từ khóa`);
    renderNotificationTable(filtered);
}

// ==== Phân trang ====
let currentPage = 1;
let totalPages = 1;  // Số trang tổng cộng (tính toán sau)
const limit = 10;  // Số thông báo mỗi trang

// ==== Cập nhật giao diện phân trang ==== 
function updatePagination() {
    const paginationSpan = document.getElementById('currentPage');
    paginationSpan.textContent = ` ${currentPage} `; // Cập nhật số trang hiện tại và tổng số trang

    // Disable/Enable previous/next buttons
    document.getElementById('prevPage').disabled = currentPage <= 1;
    document.getElementById('nextPage').disabled = currentPage >= totalPages;
    console.log(`📄 Trang hiện tại: ${currentPage} / ${totalPages}`);
}


// ==== Chuyển trang ==== 
function changePage(direction) {
    if (direction === 'prev' && currentPage > 1) {
        currentPage--; // Giảm số trang nếu nút "Trước"
    } else if (direction === 'next' && currentPage < totalPages) {
        currentPage++; // Tăng số trang nếu nút "Sau"
    }
    fetchNotifications();  // Gọi lại API để tải thông báo mới cho trang hiện tại
}


// Gán sự kiện cho các nút phân trang
document.getElementById('prevPage').addEventListener('click', function () {
    changePage('prev');
});

document.getElementById('nextPage').addEventListener('click', function () {
    changePage('next');
});
