document.addEventListener('DOMContentLoaded', function () {
    console.log("Trang đã được tải. Bắt đầu lấy dữ liệu người dùng...");
    fetchUsers(); // Bắt đầu quá trình lấy dữ liệu người dùng từ API cho trang 1

    // Lắng nghe sự kiện nhập vào ô tìm kiếm
    document.getElementById('searchInput').addEventListener('input', function () {
        const query = this.value.toLowerCase();
        console.log(`Đang tìm kiếm người dùng với từ khóa: "${query}"`);
        filterUsers(query); // Tìm kiếm khi người dùng nhập dữ liệu vào ô tìm kiếm
    });

    // Lắng nghe sự kiện chuyển trang
    document.getElementById('prevPage').addEventListener('click', function () {
        changePage('prev');
    });

    document.getElementById('nextPage').addEventListener('click', function () {
        changePage('next');
    });
});

// Mức độ ưu tiên vai trò người dùng
const ROLE_PRIORITY = {
    admin: 1,
    shop: 2,
    user: 3
};

// Biến chứa toàn bộ dữ liệu người dùng
let allUsers = [];
let currentPage = 0; // Trang hiện tại
const limit = 10; // Số người dùng mỗi trang

// Hàm lấy danh sách người dùng từ API
function fetchUsers(page) {
    console.log("Đang lấy dữ liệu người dùng từ máy chủ...");
    const token = localStorage.getItem("accessToken");

    if (!token) {
        console.log("Không tìm thấy token. Đang chuyển hướng đến trang đăng nhập...");
        alert("Bạn chưa đăng nhập. Vui lòng đăng nhập lại!");
        window.location.href = "login.html";
        return;
    }

    // Thực hiện gọi API để lấy danh sách người dùng
    fetch(`http://14.225.206.60:3000/api/admin/users?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                console.log("Lỗi khi lấy dữ liệu người dùng từ API.");
                throw new Error('Lỗi khi lấy dữ liệu từ API');
            }
            console.log("Dữ liệu người dùng đã được tải xuống.");
            return response.json();
        })
        .then(data => {
            console.log("Dữ liệu người dùng đã được phân tích:", data);
            if (data.data) {
                allUsers = data.data; // Lưu lại tất cả người dùng
                renderUserTable(allUsers); // Hiển thị dữ liệu người dùng
                updatePagination(data.pagination); // Cập nhật phân trang
            } else {
                console.error("Dữ liệu API không hợp lệ:", data);
            }
        })
        .catch(error => {
            console.error("Lỗi khi lấy dữ liệu người dùng từ API:", error);
        });
}

// Hàm hiển thị bảng người dùng
function renderUserTable(users) {
    console.log(`Đang hiển thị bảng với ${users.length} người dùng...`);
    const userTableBody = document.querySelector('#userList tbody');
    userTableBody.innerHTML = ''; // Xóa các hàng cũ

    // Lặp qua từng người dùng để hiển thị
    users.forEach(user => {
        const row = document.createElement('tr');

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
            console.log(`Đang hiển thị chi tiết cho người dùng: ${user.username}`);
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

// Hàm cập nhật giao diện phân trang
function updatePagination(pagination) {
    document.getElementById('currentPage').textContent = pagination.page;
    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');

    // Kiểm tra xem có thể chuyển đến trang trước hay không
    prevButton.disabled = pagination.page === 1;

    // Kiểm tra xem có thể chuyển đến trang sau hay không
    nextButton.disabled = pagination.page >= pagination.totalPages;
}

// Hàm tìm kiếm người dùng theo tên hoặc email
function filterUsers(query) {
    console.log(`Đang tìm kiếm người dùng với từ khóa: "${query}"`);
    const filteredUsers = allUsers.filter(user => {
        return user.username.toLowerCase().includes(query) || (user.email && user.email.toLowerCase().includes(query));
    });
    console.log(`Tìm thấy ${filteredUsers.length} người dùng phù hợp.`);
    renderUserTable(filteredUsers); // Render lại bảng với kết quả tìm kiếm
}

// Hàm lấy vai trò cao nhất của người dùng
function getHighestPriorityRole(roles) {
    if (!roles || roles.length === 0) {
        console.log("Không tìm thấy vai trò của người dùng.");
        return "Không có vai trò";
    }

    let highestRole = "user"; // Mặc định vai trò thấp nhất
    roles.forEach(role => {
        if (ROLE_PRIORITY[role.ten_role] < ROLE_PRIORITY[highestRole]) {
            highestRole = role.ten_role;
        }
    });
    console.log(`Vai trò cao nhất là: ${highestRole}`);
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

// Hàm hiển thị chi tiết người dùng
function showDetail(user) {
    console.log("Đang hiển thị chi tiết cho người dùng:", user);
    const highestRole = getHighestPriorityRole(user.vai_tro);

    // Hiển thị thông tin chi tiết người dùng
    document.getElementById('detailName').textContent = user.username;
    document.getElementById('detailEmail').textContent = user.email;
    document.getElementById('detailPhone').textContent = user.sđt || user.sdt || "Chưa có số điện thoại"; // Kiểm tra và hiển thị số điện thoại
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
    console.log(`Đang cập nhật màu sắc nút trạng thái cho trạng thái: ${status}`);
    document.getElementById('btnBinhThuong').style.backgroundColor = status === 1 ? "#5c67f2" : "#ccc";
    document.getElementById('btnKhoa').style.backgroundColor = status === 2 ? "#e74c3c" : "#ccc";
}

// Hàm lấy sản phẩm của shop từ API
function fetchShopProducts(userId) {
    console.log(`Đang lấy thông tin sản phẩm của shop cho người dùng ID: ${userId}`);
    const token = localStorage.getItem("accessToken");

    fetch(`http://14.225.206.60:3000/api/shops/get-shop-info-from-user-id/${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(shopData => {
            if (shopData.data && shopData.data.id_shop) {
                console.log("Dữ liệu shop đã được lấy:", shopData.data);
                return fetch(`http://14.225.206.60:3000/api/shops/products/id-shop/${shopData.data.id_shop}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            } else {
                console.log("Không tìm thấy dữ liệu shop.");
                throw new Error("Không tìm thấy thông tin shop");
            }
        })
        .then(response => response.json())
        .then(productData => {
            if (productData.data) {
                console.log("Danh sách sản phẩm của shop đã được lấy:", productData.data);
                renderShopProducts(productData.data);
            }
        })
        .catch(error => {
            console.error("Lỗi khi lấy danh sách sản phẩm của shop:", error);
        });
}

// Hàm hiển thị sản phẩm của shop
function renderShopProducts(products) {
    console.log(`Đang hiển thị ${products.length} sản phẩm...`);
    const productContainer = document.getElementById('detailProducts');
    productContainer.innerHTML = ''; // Xóa các sản phẩm cũ

    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';

        const productImage = document.createElement('img');
        productImage.src = product.anh || 'default-product-image.jpg';
        productItem.appendChild(productImage);

        const productDetails = document.createElement('div');
        productDetails.className = 'product-details';

        const productName = document.createElement('p');
        productName.textContent = product.ten_sach;
        productDetails.appendChild(productName);

        productItem.appendChild(productDetails);
        productContainer.appendChild(productItem);
    });
}

// Hàm thay đổi trang
function changePage(direction) {
    if (direction === 'prev' && currentPage > 1) {
        currentPage--;
    } else {
        currentPage++;
    }
    fetchUsers(currentPage); // Lấy lại dữ liệu người dùng của trang mới
}

// Hàm cập nhật trạng thái người dùng
function updateStatus(newStatus) {
    const token = localStorage.getItem("accessToken");
    const userId = document.getElementById('detailPanel').dataset.userId;

    if (!userId) {
        console.log("Không tìm thấy ID người dùng. Không thể cập nhật trạng thái.");
        alert("Không tìm thấy người dùng!");
        return;
    }

    console.log(`Đang cập nhật trạng thái cho người dùng ID ${userId} sang trạng thái ${newStatus}...`);

    fetch(`http://14.225.206.60:3000/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
    })
        .then(response => response.json())
        .then(() => {
            console.log("Trạng thái người dùng đã được cập nhật thành công.");
            document.getElementById('detailStatus').textContent = getStatusText(newStatus);
            updateStatusButtons(newStatus);
        })
        .catch(error => console.error("Lỗi khi cập nhật trạng thái người dùng:", error));
}

// Lắng nghe sự kiện đóng chi tiết người dùng và tải lại trang
document.getElementById('closeDetailBtn').addEventListener('click', function () {
    console.log("Đang đóng chi tiết người dùng...");
    document.getElementById('detailPanel').style.display = 'none';
    location.reload(); // Tải lại trang
});

// Lắng nghe sự kiện chuyển trạng thái
document.getElementById('btnBinhThuong').addEventListener('click', () => updateStatus(1));
document.getElementById('btnKhoa').addEventListener('click', () => updateStatus(2));
