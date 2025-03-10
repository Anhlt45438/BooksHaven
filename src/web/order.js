document.addEventListener('DOMContentLoaded', function () {
    // Dữ liệu đơn hàng giả lập với các thông tin chi tiết
    const orders = [
        {
            id: 1,
            image: 'image1.jpg',
            nameproduct: 'Sản phẩm 1',
            quantity: 2,
            unitPrice: '100.000đ',
            recipient: 'Nguyễn Đức Thành',
            orderDate: '2025-03-01',
            deliveryAddress: '123 Đường ABC, Quận 1, TP HCM',
            orderNote: 'Giao hàng giờ hành chính',
            paymentMethod: 'Thanh toán qua thẻ',
            shippingInfo: 'Giao hàng tận nơi',
            shippingFee: '20.000đ',
            discountCodes: 'DISCOUNT10, SALE5',
            totalAmount: '220.000đ',
            status: 'Chờ giao hàng'
        },
        {
            id: 2,
            image: 'image2.jpg',
            nameproduct: 'Sản phẩm 2',
            quantity: 1,
            unitPrice: '150.000đ',
            recipient: 'Nguyễn Văn Thành',
            orderDate: '2025-03-02',
            deliveryAddress: '456 Đường DEF, Quận 2, TP HCM',
            orderNote: '',
            paymentMethod: 'Thanh toán tiền mặt',
            shippingInfo: 'Nhận tại cửa hàng',
            shippingFee: '0đ',
            discountCodes: '',
            totalAmount: '150.000đ',
            status: 'Đã nhận'
        },
        {
            id: 3,
            image: 'image3.jpg',
            nameproduct: 'Sản phẩm 3',
            quantity: 3,
            unitPrice: '80.000đ',
            recipient: 'Trần AA',
            orderDate: '2025-03-03',
            deliveryAddress: '789 Đường GHI, Quận 3, TP HCM',
            orderNote: 'Giao trước 12h trưa',
            paymentMethod: 'Thanh toán qua ví điện tử',
            shippingInfo: 'Giao hàng nhanh',
            shippingFee: '15.000đ',
            discountCodes: 'PROMO5',
            totalAmount: '255.000đ',
            status: 'Chờ lấy hàng'
        }
    ];

    const orderTableBody = document.querySelector('#userList tbody');

    // Render danh sách đơn hàng vào bảng
    orders.forEach(order => {
        const row = document.createElement('tr');

        // Cột Mã đơn hàng
        const idCell = document.createElement('td');
        idCell.textContent = order.id;
        row.appendChild(idCell);

        // Cột Hình ảnh sản phẩm
        const imageCell = document.createElement('td');
        const img = document.createElement('img');
        img.src = order.image;
        img.alt = order.nameproduct;
        img.style.width = '50px';
        img.style.height = '50px';
        imageCell.appendChild(img);
        row.appendChild(imageCell);

        // Cột Thông tin đơn hàng (tóm tắt sản phẩm)
        const infoCell = document.createElement('td');
        infoCell.innerHTML = `Tên sản phẩm: ${order.nameproduct}<br>Số lượng: ${order.quantity}<br>Đơn giá: ${order.unitPrice}`;
        row.appendChild(infoCell);

        // Cột Chi tiết
        const detailCell = document.createElement('td');
        const detailLink = document.createElement('a');
        detailLink.href = "#";
        detailLink.textContent = "Chi tiết";
        detailLink.addEventListener('click', function (event) {
            event.preventDefault();
            showOrderDetail(order);
        });
        detailCell.appendChild(detailLink);
        row.appendChild(detailCell);

        // Cột Trạng thái
        const statusCell = document.createElement('td');
        statusCell.textContent = order.status;
        row.appendChild(statusCell);

        orderTableBody.appendChild(row);
    });

    // Hàm hiển thị chi tiết đơn hàng trên panel
    function showOrderDetail(order) {
        // Cập nhật thông tin cột mã đơn hàng và hình ảnh
        document.getElementById('detailOrderId').textContent = order.id;
        document.getElementById('detailOrderImage').src = order.image;
        document.getElementById('detailOrderImage').alt = order.nameproduct;

        // Cập nhật thông tin sản phẩm
        document.getElementById('detailProductName').textContent = order.nameproduct;
        document.getElementById('detailQuantity').textContent = order.quantity;
        document.getElementById('detailUnitPrice').textContent = order.unitPrice;

        // Cập nhật thông tin đơn hàng
        document.getElementById('detailCustomerName').textContent = order.recipient;
        document.getElementById('detailOrderDate').textContent = order.orderDate;
        document.getElementById('detailDeliveryAddress').textContent = order.deliveryAddress;
        document.getElementById('detailOrderNote').textContent = order.orderNote || 'Không có ghi chú';
        document.getElementById('detailPaymentMethod').textContent = order.paymentMethod;
        document.getElementById('detailShippingInfo').textContent = order.shippingInfo;
        document.getElementById('detailShippingFee').textContent = order.shippingFee;
        document.getElementById('detailDiscountCodes').textContent = order.discountCodes || 'Không có';
        document.getElementById('detailTotalAmount').textContent = order.totalAmount;

        // Hiển thị panel chi tiết
        document.getElementById('detailPanel').style.display = 'block';
    }

    // Đóng panel chi tiết
    document.getElementById('closeDetailBtn').addEventListener('click', function () {
        document.getElementById('detailPanel').style.display = 'none';
    });

    // Xử lý nút Hủy đơn hàng
    document.getElementById('cancelOrderBtn').addEventListener('click', function () {
        if (confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
            alert('Đơn hàng đã bị hủy.');
            document.getElementById('detailPanel').style.display = 'none';
        }
    });
});
