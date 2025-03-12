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

        // Cột Vai trò
        const roleCell = document.createElement('td');
        roleCell.textContent = user.role;
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
    document.getElementById('detailName').textContent = user.username + ' (' + user.role + ')';
    document.getElementById('detailEmail').textContent = user.email;
    document.getElementById('detailPhone').textContent = user.sdt;
    document.getElementById('detailAddress').textContent = user.dia_chi;
    document.getElementById('detailStatus').textContent = user.trang_thai;

    const shopAddressRow = document.getElementById('shopAddressRow');
    const detailProductsTitle = document.getElementById('detailProductsTitle');
    const detailShopAddress = document.getElementById('detailShopAddress');
    const detailProducts = document.getElementById('detailProducts');

    // Chỉ hiển thị sản phẩm nếu user là "Người bán"
    if (user.role === 'Người bán' && user.shopAddress) {
        shopAddressRow.style.display = '';
        detailProductsTitle.style.display = '';
        detailShopAddress.textContent = user.shopAddress;
        renderProducts(user.products);
    } else {
        shopAddressRow.style.display = 'none';
        detailProductsTitle.style.display = 'none';
        detailProducts.innerHTML = ''; // Ẩn danh sách sản phẩm
    }

    document.getElementById('detailPanel').style.display = 'block';
}

// Hàm hiển thị danh sách sản phẩm của người bán theo kiểu tạo cột từng phần tử
function renderProducts(products) {
    const detailProducts = document.getElementById('detailProducts');
    detailProducts.innerHTML = '';

    if (products.length === 0) {
        const noProductMsg = document.createElement('p');
        noProductMsg.textContent = 'Không có sản phẩm';
        detailProducts.appendChild(noProductMsg);
        return;
    }

    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');

        // Hình ảnh sản phẩm
        const productImg = document.createElement('img');
        productImg.src = product.anh;
        productImg.alt = product.ten_sach;
        productItem.appendChild(productImg);

        // Khối chứa chi tiết sản phẩm
        const productDetails = document.createElement('div');
        productDetails.classList.add('product-details');

        // Tên sản phẩm
        const titlePara = document.createElement('p');
        const titleStrong = document.createElement('strong');
        titleStrong.textContent = product.ten_sach;
        titlePara.appendChild(titleStrong);
        productDetails.appendChild(titlePara);

        // Giá sản phẩm
        const pricePara = document.createElement('p');
        pricePara.textContent = 'Giá: ' + product.gia + 'đ';
        productDetails.appendChild(pricePara);

        // Mô tả sản phẩm
        const descPara = document.createElement('p');
        descPara.textContent = 'Mô tả: ' + product.mo_ta;
        productDetails.appendChild(descPara);

        productItem.appendChild(productDetails);
        detailProducts.appendChild(productItem);
    });
}

// Đóng chi tiết
document.getElementById('closeDetailBtn').addEventListener('click', function () {
    document.getElementById('detailPanel').style.display = 'none';
});
