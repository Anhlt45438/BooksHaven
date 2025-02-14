document.addEventListener('DOMContentLoaded', function () {
    // Dữ liệu báo cáo giả lập
    const reports = [
        { reportId: 1, reporterId: 'NV001', reportType: 'Lỗi hệ thống', sendDate: '2025-02-05', description: 'Lỗi không thể đăng nhập', status: 'Đang chờ', responseDate: '' },
        { reportId: 2, reporterId: 'NV002', reportType: 'Vấn đề thanh toán', sendDate: '2025-02-06', description: 'Thanh toán không thành công', status: 'Đã phản hồi', responseDate: '2025-02-07' },
        { reportId: 3, reporterId: 'NV003', reportType: 'Lỗi giao diện', sendDate: '2025-02-10', description: 'Giao diện bị lỗi khi tải trang', status: 'Đang chờ', responseDate: '' },
        { reportId: 4, reporterId: 'NV004', reportType: 'Vấn đề bảo mật', sendDate: '2025-02-11', description: 'Vấn đề bảo mật trên website', status: 'Đã phản hồi', responseDate: '2025-02-12' }
    ];

    const reportTableBody = document.querySelector('#userList tbody');

    // Lặp qua từng báo cáo và tạo dòng trong bảng
    reports.forEach(report => {
        const row = document.createElement('tr');

        // Cột ID báo cáo
        const reportIdCell = document.createElement('td');
        reportIdCell.textContent = report.reportId;
        row.appendChild(reportIdCell);

        // Cột ID người báo cáo
        const reporterIdCell = document.createElement('td');
        reporterIdCell.textContent = report.reporterId;
        row.appendChild(reporterIdCell);

        // Cột Loại báo cáo
        const reportTypeCell = document.createElement('td');
        reportTypeCell.textContent = report.reportType;
        row.appendChild(reportTypeCell);

        // Cột Ngày gửi báo cáo
        const sendDateCell = document.createElement('td');
        sendDateCell.textContent = report.sendDate;
        row.appendChild(sendDateCell);

        // Cột Mô tả trường hợp báo cáo
        const descriptionCell = document.createElement('td');
        descriptionCell.textContent = report.description;
        row.appendChild(descriptionCell);

        // Cột Chi tiết
        const detailCell = document.createElement('td');
        const detailLink = document.createElement('a');
        detailLink.href = "#";
        detailLink.textContent = "Xem chi tiết";
        detailCell.appendChild(detailLink);
        row.appendChild(detailCell);

        // Cột Trạng thái phản hồi
        const statusCell = document.createElement('td');
        statusCell.textContent = report.status;
        row.appendChild(statusCell);

        // Cột Ngày phản hồi gần đây nhất
        const responseDateCell = document.createElement('td');
        responseDateCell.textContent = report.responseDate || 'Chưa phản hồi'; // Nếu không có ngày phản hồi, hiển thị "Chưa phản hồi"
        row.appendChild(responseDateCell);

        // Thêm dòng vào bảng
        reportTableBody.appendChild(row);
    });
});
