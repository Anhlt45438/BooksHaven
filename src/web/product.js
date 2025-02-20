document.addEventListener('DOMContentLoaded', function () {
    // Ví dụ dữ liệu sản phẩm giả lập
    const products = [
        { image: 'image1.jpg', nameproduct: 'Sản phẩm 1', status: 'Chờ duyệt' },
        { image: 'image2.jpg', nameproduct: 'Sản phẩm 2', status: 'Đã duyệt' },
        { image: 'image3.jpg', nameproduct: 'Sản phẩm 3', status: 'Đã duyệt' },
        { image: 'image4.jpg', nameproduct: 'Sản phẩm 4', status: 'Đã duyệt' },
        { image: 'image5.jpg', nameproduct: 'Sản phẩm 5', status: 'Chờ duyệt' },
        { image: 'image6.jpg', nameproduct: 'Sản phẩm 6', status: 'Đã duyệt' },
        { image: 'image7.jpg', nameproduct: 'Sản phẩm 7', status: 'Đã duyệt' },
        { image: 'image8.jpg', nameproduct: 'Sản phẩm 8', status: 'Chờ duyệt' },
        { image: 'image9.jpg', nameproduct: 'Sản phẩm 9', status: 'Đã duyệt' },
        { image: 'image10.jpg', nameproduct: 'Sản phẩm 10', status: 'Chờ duyệt' },
        { image: 'image11.jpg', nameproduct: 'Sản phẩm 11', status: 'Đã duyệt' },
        { image: 'image12.jpg', nameproduct: 'Sản phẩm 12', status: 'Đã duyệt' },
        { image: 'image13.jpg', nameproduct: 'Sản phẩm 13', status: 'Chờ duyệt' },
        { image: 'image14.jpg', nameproduct: 'Sản phẩm 14', status: 'Đã duyệt' },
        { image: 'image15.jpg', nameproduct: 'Sản phẩm 15', status: 'Chờ duyệt' },
        { image: 'image16.jpg', nameproduct: 'Sản phẩm 16', status: 'Đã duyệt' },
        { image: 'image17.jpg', nameproduct: 'Sản phẩm 17', status: 'Chờ duyệt' },
        { image: 'image18.jpg', nameproduct: 'Sản phẩm 18', status: 'Đã duyệt' },
        { image: 'image19.jpg', nameproduct: 'Sản phẩm 19', status: 'Đã duyệt' },
        { image: 'image20.jpg', nameproduct: 'Sản phẩm 20', status: 'Chờ duyệt' },
        { image: 'image21.jpg', nameproduct: 'Sản phẩm 21', status: 'Đã duyệt' },
        { image: 'image22.jpg', nameproduct: 'Sản phẩm 22', status: 'Chờ duyệt' },
        { image: 'image23.jpg', nameproduct: 'Sản phẩm 23', status: 'Đã duyệt' },
        { image: 'image24.jpg', nameproduct: 'Sản phẩm 24', status: 'Chờ duyệt' }
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