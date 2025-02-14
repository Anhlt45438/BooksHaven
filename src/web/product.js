document.addEventListener('DOMContentLoaded', function () {
    // Ví dụ dữ liệu sản phẩm giả lập
    const products = [
        { image: 'image1.jpg', nameproduct: 'Sản phẩm 1', status: 'Chờ duyệt' },
        { image: 'image2.jpg', nameproduct: 'Sản phẩm 2', status: 'Đã duyệt' },
        { image: 'image3.jpg', nameproduct: 'Sản phẩm 3', status: 'Đã duyệt' },
        { image: 'image4.jpg', nameproduct: 'Sản phẩm 4', status: 'Đã duyệt' }
    ];

    const productTableBody = document.querySelector('#userList tbody');

    // Lặp qua từng sản phẩm và tạo dòng trong bảng
    products.forEach(product => {
        const row = document.createElement('tr');

        // Cột Ảnh sản phẩm
        const imageCell = document.createElement('td');
        const img = document.createElement('img');
        img.src = product.image; // Đường dẫn đến ảnh
        img.alt = product.nameproduct; // Hiển thị tên sản phẩm khi hover
        img.style.width = '50px'; // Cài đặt kích thước ảnh
        img.style.height = '50px';
        imageCell.appendChild(img);
        row.appendChild(imageCell);

        // Cột Tên sản phẩm
        const nameProductCell = document.createElement('td');
        nameProductCell.textContent = product.nameproduct;
        row.appendChild(nameProductCell);

        // Cột Chi tiết
        const detailCell = document.createElement('td');
        const detailLink = document.createElement('a');
        detailLink.href = "#";
        detailLink.textContent = "Chi tiết";
        detailCell.appendChild(detailLink);
        row.appendChild(detailCell);

        // Cột trạng thái
        const statusCell = document.createElement('td');
        statusCell.textContent = product.status;
        row.appendChild(statusCell);

        // Thêm dòng vào bảng
        productTableBody.appendChild(row);
    });
});
