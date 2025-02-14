document.addEventListener('DOMContentLoaded', function () {
    // Ví dụ dữ liệu đơn hàng giả lập
    const orders = [
        { id: 1, image: 'image1.jpg', nameproduct: 'Sản phẩm 1', price: '200.000đ', recipient: 'Nguyễn Đức Thành', status: 'Chờ giao hàng' },
        { id: 2, image: 'image2.jpg', nameproduct: 'Sản phẩm 2', price: '150.000đ', recipient: 'Nguyễn Văn Thành', status: 'Đã nhận' },
        { id: 3, image: 'image3.jpg', nameproduct: 'Sản phẩm 3', price: '300.000đ', recipient: 'Trần AA', status: 'Đã nhận' },
        { id: 4, image: 'image4.jpg', nameproduct: 'Sản phẩm 4', price: '250.000đ', recipient: 'Lê BB', status: 'Chờ lấy hàng' }
    ];

    const orderTableBody = document.querySelector('#userList tbody');

    // Lặp qua từng đơn hàng và tạo dòng trong bảng
    orders.forEach(order => {
        const row = document.createElement('tr');

        // Cột ID đơn hàng
        const idCell = document.createElement('td');
        idCell.textContent = order.id;
        row.appendChild(idCell);

        // Cột Hình ảnh đơn hàng
        const imageCell = document.createElement('td');
        const img = document.createElement('img');
        img.src = order.image; // Đường dẫn đến ảnh
        img.alt = order.nameproduct; // Hiển thị tên sản phẩm khi hover
        img.style.width = '50px'; // Cài đặt kích thước ảnh
        img.style.height = '50px';
        imageCell.appendChild(img);
        row.appendChild(imageCell);

        // Cột Thông tin đơn hàng (tên sản phẩm, giá, tên người nhận)
        const infoCell = document.createElement('td');
        infoCell.innerHTML = `Tên sản phẩm: ${order.nameproduct}<br>Giá: ${order.price}<br>Người nhận: ${order.recipient}`;
        row.appendChild(infoCell);

        // Cột Chi tiết
        const detailCell = document.createElement('td');
        const detailLink = document.createElement('a');
        detailLink.href = "#";
        detailLink.textContent = "Chi tiết";
        detailCell.appendChild(detailLink);
        row.appendChild(detailCell);

        // Cột trạng thái
        const statusCell = document.createElement('td');
        statusCell.textContent = order.status;
        row.appendChild(statusCell);

        // Thêm dòng vào bảng
        orderTableBody.appendChild(row);
    });
});
