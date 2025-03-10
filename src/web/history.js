document.addEventListener('DOMContentLoaded', function () {
    // Dữ liệu lịch sử giao dịch giả lập với các trường bổ sung
    const historyData = [
        {
            id: 1,
            image: 'image1.jpg',
            nameproduct: 'Sản phẩm 1',
            price: '200.000đ',
            recipient: 'Nguyễn Đức Thành',
            seller: 'Nguyễn A',
            totalAmount: '200.000đ',
            createdDate: '2025-01-30',
            handOverDate: '2025-02-05',
            successDate: '',
            status: 'Chờ giao hàng',
            completionDate: ''
        },
        {
            id: 2,
            image: 'image2.jpg',
            nameproduct: 'Sản phẩm 2',
            price: '150.000đ',
            recipient: 'Nguyễn Văn Thành',
            seller: 'Trần B',
            totalAmount: '150.000đ',
            createdDate: '2025-02-01',
            handOverDate: '2025-02-06',
            successDate: '2025-02-10',
            status: 'Đã nhận',
            completionDate: '2025-02-10'
        },
        {
            id: 3,
            image: 'image3.jpg',
            nameproduct: 'Sản phẩm 3',
            price: '300.000đ',
            recipient: 'Trần AA',
            seller: 'Lê C',
            totalAmount: '300.000đ',
            createdDate: '2025-02-02',
            handOverDate: '2025-02-07',
            successDate: '2025-02-12',
            status: 'Đã nhận',
            completionDate: '2025-02-12'
        }
    ];

    const historyTableBody = document.querySelector('#userList tbody');

    // Render danh sách lịch sử giao dịch vào bảng
    historyData.forEach(order => {
        const row = document.createElement('tr');

        // Cột Mã vận đơn
        const idCell = document.createElement('td');
        idCell.textContent = order.id;
        row.appendChild(idCell);

        // Cột Hình ảnh
        const imageCell = document.createElement('td');
        const img = document.createElement('img');
        img.src = order.image;
        img.alt = order.nameproduct;
        img.style.width = '50px';
        img.style.height = '50px';
        imageCell.appendChild(img);
        row.appendChild(imageCell);

        // Cột Thông tin đơn hàng (tóm tắt)
        const infoCell = document.createElement('td');
        infoCell.innerHTML = `Tên sản phẩm: ${order.nameproduct}<br>Giá: ${order.price}<br>Người nhận: ${order.recipient}`;
        row.appendChild(infoCell);

        // Cột Ngày hoàn thành
        const completionDateCell = document.createElement('td');
        completionDateCell.textContent = order.completionDate;
        row.appendChild(completionDateCell);

        // Cột Chi tiết: khi click sẽ hiển thị panel chi tiết lịch sử
        const detailCell = document.createElement('td');
        const detailLink = document.createElement('a');
        detailLink.href = "#";
        detailLink.textContent = "Chi tiết";
        detailLink.addEventListener('click', function (event) {
            event.preventDefault();
            showHistoryDetail(order);
        });
        detailCell.appendChild(detailLink);
        row.appendChild(detailCell);

        // Cột Trạng thái
        const statusCell = document.createElement('td');
        statusCell.textContent = order.status;
        row.appendChild(statusCell);

        historyTableBody.appendChild(row);
    });

    // Hàm hiển thị chi tiết lịch sử giao dịch
    function showHistoryDetail(order) {
        document.getElementById('detailHistoryOrderId').textContent = order.id;
        document.getElementById('detailHistoryOrderImage').src = order.image;
        document.getElementById('detailHistoryOrderImage').alt = order.nameproduct;

        document.getElementById('detailHistoryProductName').textContent = order.nameproduct;
        document.getElementById('detailHistoryRecipient').textContent = order.recipient;
        document.getElementById('detailHistorySeller').textContent = order.seller;
        document.getElementById('detailHistoryTotalAmount').textContent = order.totalAmount;
        document.getElementById('detailHistoryCreatedDate').textContent = order.createdDate;
        document.getElementById('detailHistoryHandOverDate').textContent = order.handOverDate;
        document.getElementById('detailHistorySuccessDate').textContent = order.successDate || 'Chưa có';

        // Hiển thị panel chi tiết lịch sử
        document.getElementById('historyDetailPanel').style.display = 'block';
    }

    // Đóng panel chi tiết lịch sử
    document.getElementById('closeHistoryDetailBtn').addEventListener('click', function () {
        document.getElementById('historyDetailPanel').style.display = 'none';
    });
});
