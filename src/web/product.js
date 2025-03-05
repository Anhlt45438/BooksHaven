document.addEventListener('DOMContentLoaded', function () {
    // Dữ liệu sản phẩm được cập nhật với các thông tin mới
    const products = [
        {
            image: 'image1.jpg',
            nameproduct: 'Sản phẩm 1',
            author: 'Tác giả 1',
            category: 'Thể loại 1',
            price: '100.000đ',
            description: 'Mô tả sản phẩm 1',
            pages: '300',
            size: '15x20 cm',
            status: 'Chờ duyệt'
        },
        {
            image: 'image2.jpg',
            nameproduct: 'Sản phẩm 2',
            author: 'Tác giả 2',
            category: 'Thể loại 2',
            price: '200.000đ',
            description: 'Mô tả sản phẩm 2',
            pages: '350',
            size: '16x21 cm',
            status: 'Đã duyệt'
        },
        {
            image: 'image3.jpg',
            nameproduct: 'Sản phẩm 3',
            author: 'Tác giả 3',
            category: 'Thể loại 3',
            price: '300.000đ',
            description: 'Mô tả sản phẩm 3',
            pages: '400',
            size: '17x22 cm',
            status: 'Đã duyệt'
        }
    ];

    const tableBody = document.querySelector('.user-list tbody');
    const detailPanel = document.getElementById('detailPanel');
    const closeDetailBtn = document.getElementById('closeDetailBtn');

    function renderProducts() {
        tableBody.innerHTML = ''; // Xóa dữ liệu cũ
        products.forEach((product, index) => {
            const row = document.createElement('tr');

            // Cột hình ảnh
            const imageCell = document.createElement('td');
            const image = document.createElement('img');
            image.src = product.image;
            image.alt = product.nameproduct;
            image.width = 50;
            imageCell.appendChild(image);
            row.appendChild(imageCell);

            // Cột Tên sản phẩm
            const nameProductCell = document.createElement('td');
            nameProductCell.textContent = product.nameproduct;
            row.appendChild(nameProductCell);

            // Cột nút "Chi tiết"
            const detailCell = document.createElement('td');
            const detailButton = document.createElement('a');
            detailButton.textContent = 'Chi tiết';
            detailButton.classList.add('detail-btn');
            detailButton.dataset.index = index;
            detailCell.appendChild(detailButton);
            row.appendChild(detailCell);

            // Cột Trạng thái
            const statusCell = document.createElement('td');
            statusCell.textContent = product.status;
            row.appendChild(statusCell);

            tableBody.appendChild(row);
        });

        // Gán sự kiện cho các nút "Chi tiết"
        document.querySelectorAll('.detail-btn').forEach(button => {
            button.addEventListener('click', function () {
                const index = this.dataset.index;
                showProductDetail(products[index]);
            });
        });
    }

    function showProductDetail(product) {
        // Cập nhật thông tin chi tiết sản phẩm trong panel
        document.getElementById('detailImage').src = product.image;
        document.getElementById('detailName').textContent = product.nameproduct;
        document.getElementById('detailAuthor').textContent = product.author;
        document.getElementById('detailCategory').textContent = product.category;
        document.getElementById('detailPrice').textContent = product.price;
        document.getElementById('detailDescription').textContent = product.description;
        document.getElementById('detailPages').textContent = product.pages;
        document.getElementById('detailSize').textContent = product.size;
        detailPanel.style.display = 'block';
    }

    closeDetailBtn.addEventListener('click', function () {
        detailPanel.style.display = 'none';
    });

    renderProducts();
});
