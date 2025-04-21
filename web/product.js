document.addEventListener('DOMContentLoaded', function () {
    console.log("🚀 [Khởi động] Trang đã tải, bắt đầu lấy danh sách sản phẩm...");

    const tableBody = document.querySelector('.user-list tbody');
    const detailPanel = document.getElementById('detailPanel');
    const closeDetailBtn = document.getElementById('closeDetailBtn');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const currentPageSpan = document.getElementById('currentPage');
    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');
    const shopNameSpan = document.getElementById('detailShopName');

    const API_BASE_URL = 'http://14.225.206.60:3000/api/books';
    const LIMIT = 10;
    let currentPage = 1;
    let totalPages = 1;

    let allProducts = [];

    // ============================
    // HÀM LẤY DANH SÁCH SẢN PHẨM
    // ============================
    async function fetchProducts(page = 1) {
        console.log(`📡 [API] Gửi yêu cầu lấy danh sách sản phẩm từ: ${API_BASE_URL}?page=${page}&limit=${LIMIT}`);

        try {
            const response = await fetch(`${API_BASE_URL}?page=${page}&limit=${LIMIT}`);
            console.log("🔄 [API] Đang xử lý phản hồi từ server...");

            if (!response.ok) {
                throw new Error(`❌ Lỗi khi lấy dữ liệu sản phẩm! (Status: ${response.status})`);
            }

            const data = await response.json();
            console.log("✅ [API] Dữ liệu sản phẩm nhận được:", data);

            if (!data || !Array.isArray(data.data)) {
                throw new Error("⚠️ API không trả về dữ liệu hợp lệ (thiếu 'data')");
            }

            allProducts = data.data;
            totalPages = Math.ceil(data.pagination.total / LIMIT);
            renderProducts(allProducts);
            updatePagination();
        } catch (error) {
            console.error("⚠️ [Lỗi] Không thể lấy danh sách sản phẩm:", error);
        }
    }

    // ============================
    // HÀM HIỂN THỊ DANH SÁCH SÁCH
    // ============================
    async function renderProducts(products) {
        console.log("📋 [UI] Hiển thị danh sách sản phẩm...");
        tableBody.innerHTML = '';

        if (products.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="4" style="text-align: center;">Không tìm thấy sản phẩm phù hợp.</td></tr>`;
            return;
        }

        for (const product of products) {
            // console.log(`🔹 [UI] Hiển thị sản phẩm: ${product.ten_sach}`);

            const row = document.createElement('tr');

            const imageCell = document.createElement('td');
            const image = document.createElement('img');
            image.src = product.anh ? (product.anh.startsWith('data:image') ? product.anh : `http://14.225.206.60:3000/uploads/${product.anh}`) : 'default-image.jpg';
            image.alt = product.ten_sach;
            image.width = 50;
            imageCell.appendChild(image);
            row.appendChild(imageCell);

            const nameProductCell = document.createElement('td');
            nameProductCell.textContent = product.ten_sach;
            row.appendChild(nameProductCell);

            const nameProductInfo = document.createElement('td');
            const shopName = await getShopNameById(product.id_shop);
            const price = product.gia ? `${product.gia.toLocaleString()} đ` : "Không có giá";
            nameProductInfo.innerHTML = `${shopName} <br> Giá: ${price}`;
            row.appendChild(nameProductInfo);

            const detailCell = document.createElement('td');
            const detailButton = document.createElement('a');
            detailButton.textContent = 'Chi tiết';
            detailButton.classList.add('detail-btn');
            detailButton.dataset.id = product._id || 'unknown';
            detailCell.appendChild(detailButton);
            row.appendChild(detailCell);

            const statusCell = document.createElement('td');
            statusCell.textContent = product.trang_thai ? 'Đã duyệt' : 'Chờ duyệt';
            row.appendChild(statusCell);

            tableBody.appendChild(row);
        }

        console.log("✅ [UI] Hoàn tất hiển thị danh sách sản phẩm.");

        document.querySelectorAll('.detail-btn').forEach(button => {
            button.addEventListener('click', function () {
                const id = this.dataset.id;
                if (id === 'unknown') {
                    console.error("⚠️ [Lỗi] Không thể lấy chi tiết sản phẩm vì ID không hợp lệ!");
                    return;
                }
                console.log(`🔍 [Click] Xem chi tiết sản phẩm có ID: ${id}`);
                fetchProductDetail(id);
            });
        });
    }

    // Hàm lấy thông tin shop theo id_shop
    async function getShopNameById(id_shop) {
        if (!id_shop) {
            console.error("⚠️ [Lỗi] id_shop không hợp lệ hoặc không tồn tại.");
            return "Không có shop";
        }

        try {
            const response = await fetch(`http://14.225.206.60:3000/api/shops/get-shop-info/${id_shop}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id_shop: id_shop })
            });

            if (!response.ok) {
                throw new Error("Không thể lấy thông tin shop");
            }

            const shopData = await response.json();
            return shopData?.data?.ten_shop || "Không xác định";
        } catch (error) {
            console.error("Lỗi khi lấy thông tin shop:", error);
            return "Không xác định";
        }
    }

    // ============================
    // HÀM LẤY CHI TIẾT SÁCH
    // ============================
    async function fetchProductDetail(id) {
        console.log(`📡 [API] Lấy chi tiết sản phẩm (ID: ${id})`);

        try {
            const response = await fetch(`${API_BASE_URL}/${id}`);
            console.log("🔄 [API] Đang xử lý phản hồi...");

            if (!response.ok) {
                throw new Error(`❌ Không thể lấy chi tiết sản phẩm! (Status: ${response.status})`);
            }

            const data = await response.json();
            console.log("✅ [API] Dữ liệu chi tiết sản phẩm:", data);

            if (!data || !data.data) {
                throw new Error("⚠️ API không trả về dữ liệu hợp lệ");
            }

            showProductDetail(data.data);
        } catch (error) {
            console.error("⚠️ [Lỗi] Không thể lấy chi tiết sản phẩm:", error);
        }
    }

    // ============================
    // HÀM HIỂN THỊ CHI TIẾT SÁCH
    // ============================
    async function showProductDetail(product) {
        console.log(`📋 [UI] Hiển thị chi tiết sản phẩm: ${product.ten_sach}`);

        document.getElementById('detailImage').src = product.anh ?
            (product.anh.startsWith('data:image') ? product.anh : `http://14.225.206.60:3000/uploads/${product.anh}`)
            : 'default-image.jpg';

        document.getElementById('detailName').textContent = product.ten_sach || "Không có tên";
        document.getElementById('detailAuthor').textContent = product.tac_gia || "Không có tác giả";
        document.getElementById('detailCategory').textContent = product.the_loai?.length
            ? product.the_loai.map(t => t.ten_the_loai).join(', ')
            : "Không có thể loại";
        document.getElementById('detailPrice').textContent = product.gia ? `${product.gia.toLocaleString()}đ` : "Không có giá";
        document.getElementById('detailDescription').textContent = product.mo_ta || "Không có mô tả";
        document.getElementById('detailPages').textContent = product.so_trang || "Không có số trang";
        document.getElementById('detailSize').textContent = product.kich_thuoc || "Không có kích thước";

        if (product.id_shop) {
            try {
                const response = await fetch(`http://14.225.206.60:3000/api/shops/get-shop-info/${product.id_shop}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id_shop: product.id_shop })
                });

                const shopData = await response.json();
                document.getElementById('detailShopName').textContent = shopData?.data?.ten_shop || 'Không xác định';
            } catch (error) {
                console.error("⚠️ [Lỗi] Không thể lấy tên shop:", error);
                document.getElementById('detailShopName').textContent = "Không xác định";
            }
        } else {
            document.getElementById('detailShopName').textContent = "Không xác định";
        }

        document.getElementById('detailQuantity').textContent = product.so_luong || "Không có kích thước";

        detailPanel.style.display = 'block';
        console.log("✅ [UI] Chi tiết sản phẩm hiển thị thành công.");
    }

    // ============================
    // HÀM TÌM KIẾM SÁCH THEO TÊN
    // ============================
    async function searchProducts() {
        const keyword = searchInput.value.trim().toLowerCase();
        console.log(`🔍 [Tìm kiếm] Gửi từ khóa tìm kiếm đến API: "${keyword}"`);

        if (keyword === '') {
            console.log("📄 [Tìm kiếm] Không có từ khóa, hiển thị lại danh sách sản phẩm mặc định.");
            fetchProducts(currentPage);
            return;
        }

        try {
            const response = await fetch(`http://14.225.206.60:3000/api/books/search?keyword=${encodeURIComponent(keyword)}`);
            console.log("🔄 [API] Đang xử lý kết quả tìm kiếm...");

            if (!response.ok) {
                throw new Error(`❌ Tìm kiếm thất bại! (Status: ${response.status})`);
            }

            const result = await response.json();
            console.log("✅ [API] Kết quả tìm kiếm:", result);

            if (!result || !Array.isArray(result.data)) {
                throw new Error("⚠️ Dữ liệu trả về từ API tìm kiếm không hợp lệ.");
            }

            renderProducts(result.data);
        } catch (error) {
            console.error("⚠️ [Lỗi tìm kiếm] Không thể lấy kết quả tìm kiếm:", error);
        }
    }

    // ============================
    // SỰ KIỆN ĐÓNG PANEL CHI TIẾT
    // ============================
    closeDetailBtn.addEventListener('click', function () {
        console.log("❌ [UI] Đóng panel chi tiết sản phẩm.");
        detailPanel.style.display = 'none';
    });

    // ============================
    // SỰ KIỆN TÌM KIẾM SẢN PHẨM
    // ============================
    searchButton.addEventListener('click', searchProducts);
    searchInput.addEventListener('input', searchProducts);

    // ============================
    // HÀM CẬP NHẬT PHÂN TRANG
    // ============================
    function updatePagination() {
        currentPageSpan.textContent = currentPage;
        prevButton.disabled = currentPage <= 1;
        nextButton.disabled = currentPage >= totalPages;
    }

    // ============================
    // HÀM CHUYỂN TRANG
    // ============================
    function changePage(direction) {
        if (direction === 'prev' && currentPage > 1) {
            currentPage--;
        } else if (direction === 'next' && currentPage < totalPages) {
            currentPage++;
        }

        fetchProducts(currentPage);
    }

    prevButton.addEventListener('click', function () {
        changePage('prev');
    });

    nextButton.addEventListener('click', function () {
        changePage('next');
    });

    // Tải danh sách sản phẩm ban đầu
    fetchProducts();
});
