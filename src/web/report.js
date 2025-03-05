document.addEventListener('DOMContentLoaded', function () {
    // Dữ liệu báo cáo giả lập
    const reports = [
        {
            reportId: 1,
            reporterId: 'NV001',
            reporterName: 'Nguyễn Văn A',
            reportType: 'Lỗi hệ thống',
            sendDate: '2025-02-05',
            description: 'Không thể đăng nhập',
            detailedDescription: 'Khi đăng nhập, hệ thống báo lỗi "500 Internal Server Error".',
            feedback: null
        },
        {
            reportId: 2,
            reporterId: 'NV002',
            reporterName: 'Trần Thị B',
            reportType: 'Vấn đề thanh toán',
            sendDate: '2025-02-06',
            description: 'Thanh toán không thành công',
            detailedDescription: 'Giao dịch thanh toán qua thẻ bị từ chối do lỗi XYZ.',
            feedback: { date: '2025-02-07', content: 'Đã xử lý, vui lòng thử lại.' }
        },
        {
            reportId: 3,
            reporterId: 'NV003',
            reporterName: 'Lê Văn C',
            reportType: 'Lỗi giao diện',
            sendDate: '2025-02-10',
            description: 'Lỗi hiển thị trang chủ',
            detailedDescription: 'Trang chủ không hiển thị đúng bố cục trên thiết bị di động.',
            feedback: null
        }
    ];

    const reportTableBody = document.querySelector('#userList tbody');

    // Render danh sách báo cáo vào bảng
    reports.forEach(report => {
        const row = document.createElement('tr');

        // Cột ID báo cáo
        const idCell = document.createElement('td');
        idCell.textContent = report.reportId;
        row.appendChild(idCell);

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

        // Cột Mô tả (đơn giản)
        const descriptionCell = document.createElement('td');
        descriptionCell.textContent = report.description;
        row.appendChild(descriptionCell);

        // Cột Thông tin chi tiết
        const detailCell = document.createElement('td');
        const detailLink = document.createElement('a');
        detailLink.href = "#";
        detailLink.textContent = "Chi tiết";
        detailLink.addEventListener('click', function (event) {
            event.preventDefault();
            showReportDetail(report);
        });
        detailCell.appendChild(detailLink);
        row.appendChild(detailCell);

        reportTableBody.appendChild(row);
    });

    // Hàm hiển thị panel chi tiết báo cáo
    function showReportDetail(report) {
        // Điền thông tin báo cáo vào panel
        document.getElementById('detailReportId').textContent = report.reportId;
        document.getElementById('detailReporter').textContent = report.reporterId + ' - ' + report.reporterName;
        document.getElementById('detailSendDate').textContent = report.sendDate;
        document.getElementById('detailReportType').textContent = report.reportType;
        document.getElementById('detailSimpleDescription').textContent = report.description;
        document.getElementById('detailDetailedDescription').textContent = report.detailedDescription;

        // Kiểm tra phản hồi
        if (report.feedback) {
            // Nếu đã có phản hồi, hiển thị container phản hồi và ẩn ô nhập
            document.getElementById('feedbackDisplayContainer').style.display = 'block';
            document.getElementById('feedbackInputContainer').style.display = 'none';
            document.getElementById('feedbackDate').textContent = report.feedback.date;
            document.getElementById('feedbackContent').textContent = report.feedback.content;
        } else {
            // Nếu chưa có phản hồi, hiển thị ô nhập phản hồi và ẩn container hiển thị
            document.getElementById('feedbackInputContainer').style.display = 'block';
            document.getElementById('feedbackDisplayContainer').style.display = 'none';
            document.getElementById('feedbackInput').value = '';
        }

        // Hiển thị panel chi tiết báo cáo
        document.getElementById('reportDetailPanel').style.display = 'block';

        // Lưu thông tin báo cáo hiện tại vào một biến toàn cục (dùng cho xử lý phản hồi)
        currentReport = report;
    }

    // Biến lưu báo cáo hiện tại được hiển thị chi tiết
    let currentReport = null;

    // Xử lý gửi phản hồi khi người dùng nhập phản hồi
    document.getElementById('submitFeedbackBtn').addEventListener('click', function () {
        const feedbackContent = document.getElementById('feedbackInput').value.trim();
        if (feedbackContent === '') {
            alert('Vui lòng nhập phản hồi trước khi gửi.');
            return;
        }
        // Cập nhật phản hồi cho báo cáo hiện tại (giả lập, trong thực tế cần gửi lên server)
        const currentDate = new Date().toISOString().split('T')[0]; // Lấy ngày hiện tại dạng YYYY-MM-DD
        currentReport.feedback = {
            date: currentDate,
            content: feedbackContent
        };
        // Cập nhật lại panel chi tiết báo cáo
        document.getElementById('feedbackDate').textContent = currentDate;
        document.getElementById('feedbackContent').textContent = feedbackContent;
        // Ẩn ô nhập phản hồi và hiển thị container phản hồi
        document.getElementById('feedbackInputContainer').style.display = 'none';
        document.getElementById('feedbackDisplayContainer').style.display = 'block';
        alert('Phản hồi đã được gửi.');
    });

    // Đóng panel chi tiết báo cáo
    document.getElementById('closeReportDetailBtn').addEventListener('click', function () {
        document.getElementById('reportDetailPanel').style.display = 'none';
    });
});
