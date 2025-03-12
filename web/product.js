document.addEventListener('DOMContentLoaded', function () {
    console.log("🚀 [Khởi động] Trang đã tải, bắt đầu lấy danh sách sản phẩm...");

    const tableBody = document.querySelector('.user-list tbody'); // Vùng chứa danh sách sản phẩm
    const detailPanel = document.getElementById('detailPanel'); // Panel hiển thị chi tiết sản phẩm
    const closeDetailBtn = document.getElementById('closeDetailBtn'); // Nút đóng panel chi tiết
    const searchInput = document.getElementById('searchInput'); // Ô nhập tìm kiếm
    const searchButton = document.getElementById('searchButton'); // Nút tìm kiếm

    const API_BASE_URL = 'http://localhost:3000/api/books'; // API Backend lấy danh sách sách

    let allProducts = []; // Lưu toàn bộ danh sách sách để tìm kiếm nhanh

    // ============================
    // HÀM LẤY DANH SÁCH SẢN PHẨM
    // ============================
    async function fetchProducts() {
        console.log("📡 [API] Gửi yêu cầu lấy danh sách sản phẩm từ:", API_BASE_URL);

        try {
            const response = await fetch(API_BASE_URL);
            console.log("🔄 [API] Đang xử lý phản hồi từ server...");

            if (!response.ok) {
                throw new Error(`❌ Lỗi khi lấy dữ liệu sản phẩm! (Status: ${response.status})`);
            }

            const data = await response.json();
            console.log("✅ [API] Dữ liệu sản phẩm nhận được:", data);

            if (!data || !Array.isArray(data.data)) {
                throw new Error("⚠️ API không trả về dữ liệu hợp lệ (thiếu 'data')");
            }

            allProducts = data.data; // Lưu toàn bộ sản phẩm để tìm kiếm
            renderProducts(allProducts);
        } catch (error) {
            console.error("⚠️ [Lỗi] Không thể lấy danh sách sản phẩm:", error);
        }
    }

    // ============================
    // HÀM HIỂN THỊ DANH SÁCH SÁCH
    // ============================
    function renderProducts(products) {
        console.log("📋 [UI] Hiển thị danh sách sản phẩm...");
        tableBody.innerHTML = '';

        if (products.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="4" style="text-align: center;">Không tìm thấy sản phẩm phù hợp.</td></tr>`;
            return;
        }

        products.forEach((product) => {
            console.log(`🔹 [UI] Hiển thị sản phẩm: ${product.ten_sach}`);

            const row = document.createElement('tr');

            // Hình ảnh
            const imageCell = document.createElement('td');
            const image = document.createElement('img');
            image.src = product.anh ?
                (product.anh.startsWith('data:image') ? product.anh : `http://localhost:3000/uploads/${product.anh}`)
                : 'default-image.jpg';
            image.alt = product.ten_sach;
            image.width = 50;
            imageCell.appendChild(image);
            row.appendChild(imageCell);

            // Tên sản phẩm
            const nameProductCell = document.createElement('td');
            nameProductCell.textContent = product.ten_sach;
            row.appendChild(nameProductCell);

            // Nút "Chi tiết"
            const detailCell = document.createElement('td');
            const detailButton = document.createElement('a');
            detailButton.textContent = 'Chi tiết';
            detailButton.classList.add('detail-btn');
            detailButton.dataset.id = product._id || 'unknown';
            detailCell.appendChild(detailButton);
            row.appendChild(detailCell);

            // Trạng thái
            const statusCell = document.createElement('td');
            statusCell.textContent = product.trang_thai ? 'Đã duyệt' : 'Chờ duyệt';
            row.appendChild(statusCell);

            tableBody.appendChild(row);
        });

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

    // ============================
    // HÀM TÌM KIẾM SÁCH THEO TÊN
    // ============================
    function searchProducts() {
        const keyword = searchInput.value.trim().toLowerCase();
        console.log(`🔎 [Tìm kiếm] Từ khóa: "${keyword}"`);

        const filteredProducts = allProducts.filter(product =>
            product.ten_sach.toLowerCase().includes(keyword)
        );

        renderProducts(filteredProducts);
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
    function showProductDetail(product) {
        console.log(`📋 [UI] Hiển thị chi tiết sản phẩm: ${product.ten_sach}`);

        document.getElementById('detailImage').src = product.anh ?
            (product.anh.startsWith('data:image') ? product.anh : `http://localhost:3000/uploads/${product.anh}`)
            : 'default-image.jpg';

        document.getElementById('detailName').textContent = product.ten_sach || "Không có tên";
        document.getElementById('detailAuthor').textContent = product.tac_gia || "Không có tác giả";
        document.getElementById('detailCategory').textContent = product.the_loai?.length ? product.the_loai.map(t => t.ten_the_loai).join(', ') : "Không có";
        document.getElementById('detailPrice').textContent = product.gia ? product.gia + 'đ' : "Không có giá";
        document.getElementById('detailDescription').textContent = product.mo_ta || "Không có mô tả";
        document.getElementById('detailPages').textContent = product.so_trang ? product.so_trang : "Không có số trang";
        document.getElementById('detailSize').textContent = product.kich_thuoc || "Không có kích thước";

        detailPanel.style.display = 'block';
        console.log("✅ [UI] Chi tiết sản phẩm hiển thị thành công.");
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
    searchInput.addEventListener('input', searchProducts); // Tìm kiếm theo thời gian thực

    // Gọi API lấy danh sách sản phẩm khi tải trang
    fetchProducts();
});
