document.addEventListener('DOMContentLoaded', function () {
    // Ví dụ dữ liệu đơn hàng giả lập
    const orders = [
        { id: 1, image: 'image1.jpg', nameproduct: 'Sản phẩm 1', price: '200.000đ', recipient: 'Nguyễn Đức Thành', status: 'Chờ giao hàng' },
        { id: 2, image: 'image2.jpg', nameproduct: 'Sản phẩm 2', price: '150.000đ', recipient: 'Nguyễn Văn Thành', status: 'Đã nhận' },
        { id: 3, image: 'image3.jpg', nameproduct: 'Sản phẩm 3', price: '300.000đ', recipient: 'Trần AA', status: 'Đã nhận' },
        { id: 4, image: 'image4.jpg', nameproduct: 'Sản phẩm 4', price: '250.000đ', recipient: 'Lê BB', status: 'Chờ lấy hàng' },
        { id: 5, image: 'image5.jpg', nameproduct: 'Sản phẩm 5', price: '180.000đ', recipient: 'Hoàng CC', status: 'Đã nhận' },
        { id: 6, image: 'image6.jpg', nameproduct: 'Sản phẩm 6', price: '220.000đ', recipient: 'Phạm DD', status: 'Chờ lấy hàng' },
        { id: 7, image: 'image7.jpg', nameproduct: 'Sản phẩm 7', price: '275.000đ', recipient: 'Vũ EE', status: 'Đang giao hàng' },
        { id: 8, image: 'image8.jpg', nameproduct: 'Sản phẩm 8', price: '125.000đ', recipient: 'Lý FF', status: 'Chờ giao hàng' },
        { id: 9, image: 'image9.jpg', nameproduct: 'Sản phẩm 9', price: '190.000đ', recipient: 'Đỗ GG', status: 'Đã nhận' },
        { id: 10, image: 'image10.jpg', nameproduct: 'Sản phẩm 10', price: '260.000đ', recipient: 'Nguyễn HH', status: 'Chờ lấy hàng' },
        { id: 11, image: 'image11.jpg', nameproduct: 'Sản phẩm 11', price: '210.000đ', recipient: 'Trần II', status: 'Đã nhận' },
        { id: 12, image: 'image12.jpg', nameproduct: 'Sản phẩm 12', price: '230.000đ', recipient: 'Lê JJ', status: 'Đang giao hàng' },
        { id: 13, image: 'image13.jpg', nameproduct: 'Sản phẩm 13', price: '290.000đ', recipient: 'Hoàng KK', status: 'Chờ giao hàng' },
        { id: 14, image: 'image14.jpg', nameproduct: 'Sản phẩm 14', price: '320.000đ', recipient: 'Phạm LL', status: 'Đã nhận' },
        { id: 15, image: 'image15.jpg', nameproduct: 'Sản phẩm 15', price: '175.000đ', recipient: 'Vũ MM', status: 'Chờ lấy hàng' },
        { id: 16, image: 'image16.jpg', nameproduct: 'Sản phẩm 16', price: '205.000đ', recipient: 'Lý NN', status: 'Đang giao hàng' },
        { id: 17, image: 'image17.jpg', nameproduct: 'Sản phẩm 17', price: '285.000đ', recipient: 'Đỗ OO', status: 'Chờ giao hàng' },
        { id: 18, image: 'image18.jpg', nameproduct: 'Sản phẩm 18', price: '215.000đ', recipient: 'Nguyễn PP', status: 'Đã nhận' },
        { id: 19, image: 'image19.jpg', nameproduct: 'Sản phẩm 19', price: '195.000đ', recipient: 'Trần QQ', status: 'Chờ lấy hàng' },
        { id: 20, image: 'image20.jpg', nameproduct: 'Sản phẩm 20', price: '275.000đ', recipient: 'Lê RR', status: 'Đang giao hàng' }
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
        img.src = order.image;
        img.alt = order.nameproduct;
        img.style.width = '50px';
        img.style.height = '50px';
        imageCell.appendChild(img);
        row.appendChild(imageCell);

        // Cột Thông tin đơn hàng
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
