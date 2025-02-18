document.addEventListener('DOMContentLoaded', function () {
    // Ví dụ dữ liệu lịch sử đơn hàng giả lập
    const history = [
        { id: 1, image: 'image1.jpg', nameproduct: 'Sản phẩm 1', price: '200.000đ', recipient: 'Nguyễn Đức Thành', status: 'Chờ giao hàng', completionDate: '' },
        { id: 2, image: 'image2.jpg', nameproduct: 'Sản phẩm 2', price: '150.000đ', recipient: 'Nguyễn Văn Thành', status: 'Đã nhận', completionDate: '2025-02-10' },
        { id: 3, image: 'image3.jpg', nameproduct: 'Sản phẩm 3', price: '300.000đ', recipient: 'Trần AA', status: 'Đã nhận', completionDate: '2025-02-12' },
        { id: 4, image: 'image4.jpg', nameproduct: 'Sản phẩm 4', price: '250.000đ', recipient: 'Lê BB', status: 'Chờ lấy hàng', completionDate: '' },
        { id: 5, image: 'image5.jpg', nameproduct: 'Sản phẩm 5', price: '180.000đ', recipient: 'Nguyễn C', status: 'Đã nhận', completionDate: '2025-02-14' },
        { id: 6, image: 'image6.jpg', nameproduct: 'Sản phẩm 6', price: '220.000đ', recipient: 'Phạm D', status: 'Chờ lấy hàng', completionDate: '' },
        { id: 7, image: 'image7.jpg', nameproduct: 'Sản phẩm 7', price: '270.000đ', recipient: 'Trần E', status: 'Chờ giao hàng', completionDate: '' },
        { id: 8, image: 'image8.jpg', nameproduct: 'Sản phẩm 8', price: '190.000đ', recipient: 'Lê F', status: 'Đã nhận', completionDate: '2025-02-16' },
        { id: 9, image: 'image9.jpg', nameproduct: 'Sản phẩm 9', price: '230.000đ', recipient: 'Nguyễn G', status: 'Chờ giao hàng', completionDate: '' },
        { id: 10, image: 'image10.jpg', nameproduct: 'Sản phẩm 10', price: '260.000đ', recipient: 'Hoàng H', status: 'Đã nhận', completionDate: '2025-02-18' },
        { id: 11, image: 'image11.jpg', nameproduct: 'Sản phẩm 11', price: '280.000đ', recipient: 'Phạm I', status: 'Chờ lấy hàng', completionDate: '' },
        { id: 12, image: 'image12.jpg', nameproduct: 'Sản phẩm 12', price: '210.000đ', recipient: 'Trần J', status: 'Chờ giao hàng', completionDate: '' },
        { id: 13, image: 'image13.jpg', nameproduct: 'Sản phẩm 13', price: '320.000đ', recipient: 'Lê K', status: 'Đã nhận', completionDate: '2025-02-20' },
        { id: 14, image: 'image14.jpg', nameproduct: 'Sản phẩm 14', price: '240.000đ', recipient: 'Nguyễn L', status: 'Chờ lấy hàng', completionDate: '' },
        { id: 15, image: 'image15.jpg', nameproduct: 'Sản phẩm 15', price: '200.000đ', recipient: 'Hoàng M', status: 'Đã nhận', completionDate: '2025-02-22' },
        { id: 16, image: 'image16.jpg', nameproduct: 'Sản phẩm 16', price: '290.000đ', recipient: 'Phạm N', status: 'Chờ giao hàng', completionDate: '' },
        { id: 17, image: 'image17.jpg', nameproduct: 'Sản phẩm 17', price: '270.000đ', recipient: 'Trần O', status: 'Đã nhận', completionDate: '2025-02-24' },
        { id: 18, image: 'image18.jpg', nameproduct: 'Sản phẩm 18', price: '220.000đ', recipient: 'Lê P', status: 'Chờ lấy hàng', completionDate: '' },
        { id: 19, image: 'image19.jpg', nameproduct: 'Sản phẩm 19', price: '250.000đ', recipient: 'Nguyễn Q', status: 'Đã nhận', completionDate: '2025-02-26' },
        { id: 20, image: 'image20.jpg', nameproduct: 'Sản phẩm 20', price: '230.000đ', recipient: 'Hoàng R', status: 'Chờ giao hàng', completionDate: '' }
    ];

    const historyTableBody = document.querySelector('#userList tbody');

    // Lặp qua từng lịch sử đơn hàng và tạo dòng trong bảng
    history.forEach(order => {
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

        // Cột Ngày hoàn thành
        const completionDateCell = document.createElement('td');
        completionDateCell.textContent = order.completionDate;
        row.appendChild(completionDateCell);

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
        historyTableBody.appendChild(row);
    });
});
