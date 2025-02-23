document.addEventListener('DOMContentLoaded', function () {
    fetch('database.json')
        .then(response => response.json())
        .then(data => {
            const users = data.nguoi_dung;
            const roles = data.vai_tro;
            const userRoles = data.chi_tiet_vai_tro;
            const shops = data.cua_hang;
            const books = data.sach;

            // Kết hợp dữ liệu người dùng với vai trò và cửa hàng
            const enrichedUsers = users.map(user => {
                const roleInfo = userRoles.find(ur => ur.id_user === user.id_user);
                const role = roles.find(r => r.id_role === roleInfo?.id_role) || { ten_role: "Không xác định" };

                const userShop = shops.find(shop => shop.id_user === user.id_user);
                const userBooks = books.filter(book => book.id_shop === userShop?.id_shop);

                return {
                    ...user,
                    role: role.ten_role,
                    shopAddress: userShop ? userShop.ten_shop : null,
                    products: userBooks
                };
            });

            renderUserTable(enrichedUsers);
        })
        .catch(error => console.error("Lỗi khi tải dữ liệu:", error));
});

// Hàm hiển thị danh sách người dùng lên bảng HTML
function renderUserTable(users) {
    const userTableBody = document.querySelector('#userList tbody');
    userTableBody.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');

        const roleCell = document.createElement('td');
        roleCell.textContent = user.role;
        row.appendChild(roleCell);

        const usernameCell = document.createElement('td');
        usernameCell.textContent = user.username;
        row.appendChild(usernameCell);

        const detailCell = document.createElement('td');
        const detailButton = document.createElement('a');
        detailButton.textContent = 'Chi tiết';
        detailButton.href = "#";
        detailButton.onclick = (event) => {
            event.preventDefault();
            showDetail(user);
        };
        detailCell.appendChild(detailButton);
        row.appendChild(detailCell);

        const statusCell = document.createElement('td');
        statusCell.textContent = user.trang_thai;
        row.appendChild(statusCell);

        userTableBody.appendChild(row);
    });
}

// Hàm hiển thị chi tiết người dùng
function showDetail(user) {
    document.getElementById('detailName').textContent = user.username + ' (' + user.role + ')';
    document.getElementById('detailEmail').textContent = user.email;
    document.getElementById('detailPhone').textContent = user.sdt;
    document.getElementById('detailAddress').textContent = user.dia_chi;
    document.getElementById('detailStatus').textContent = user.trang_thai;

    const shopAddressRow = document.getElementById('shopAddressRow');
    const detailShopAddress = document.getElementById('detailShopAddress');
    const detailProducts = document.getElementById('detailProducts');

    if (user.role === 'Người bán' && user.shopAddress) {
        shopAddressRow.style.display = '';
        detailShopAddress.textContent = user.shopAddress;
        renderProducts(user.products);
    } else {
        shopAddressRow.style.display = 'none';
        detailProducts.innerHTML = '<p>Không có sản phẩm</p>';
    }

    document.getElementById('detailPanel').style.display = 'block';
}

// Hàm hiển thị danh sách sản phẩm của người bán
function renderProducts(products) {
    const detailProducts = document.getElementById('detailProducts');
    detailProducts.innerHTML = '';

    if (products.length === 0) {
        detailProducts.innerHTML = '<p>Không có sản phẩm</p>';
        return;
    }

    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');

        productItem.innerHTML = `
            <img src="${product.anh}" alt="${product.ten_sach}">
            <div class="product-details">
                <p><strong>${product.ten_sach}</strong></p>
                <p>Giá: ${product.gia}đ</p>
                <p>Mô tả: ${product.mo_ta}</p>
            </div>
        `;

        detailProducts.appendChild(productItem);
    });
}

// Đóng chi tiết
document.getElementById('closeDetailBtn').addEventListener('click', function () {
    document.getElementById('detailPanel').style.display = 'none';
});
