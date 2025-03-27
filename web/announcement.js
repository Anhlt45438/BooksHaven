document.addEventListener('DOMContentLoaded', function () {
    // Dữ liệu thông báo giả lập
    const announcements = [
        { id: 1, title: 'Thông báo 2', type: 'Loại 2', sendDate: '2025-02-10', details: 'Chi tiết thông báo 2', recipient: 'Nguyễn Văn A' },
        { id: 2, title: 'Thông báo 3', type: 'Loại 1', sendDate: '2025-02-12', details: 'Chi tiết thông báo 3', recipient: 'Trần Thị B' },
        { id: 3, title: 'Thông báo 5', type: 'Loại 2', sendDate: '2025-02-15', details: 'Chi tiết thông báo 5', recipient: 'Lê Văn C' },
        { id: 4, title: 'Thông báo 7', type: 'Loại 3', sendDate: '2025-02-18', details: 'Chi tiết thông báo 7', recipient: 'Phạm Thị D' },
        { id: 5, title: 'Thông báo 9', type: 'Loại 1', sendDate: '2025-02-20', details: 'Chi tiết thông báo 9', recipient: 'Hoàng Văn E' }
    ];

    const announcementTableBody = document.querySelector('#userList tbody');

    // Render danh sách thông báo vào bảng
    announcements.forEach(announcement => {
        const row = document.createElement('tr');



        // Cột Tiêu đề thông báo
        const titleCell = document.createElement('td');
        titleCell.textContent = announcement.title;
        row.appendChild(titleCell);

        // Cột Loại thông báo
        const typeCell = document.createElement('td');
        typeCell.textContent = announcement.type;
        row.appendChild(typeCell);

        // Cột Ngày gửi thông báo
        const sendDateCell = document.createElement('td');
        sendDateCell.textContent = announcement.sendDate;
        row.appendChild(sendDateCell);

        // Cột Chi tiết: khi click sẽ hiển thị panel chi tiết thông báo
        const detailCell = document.createElement('td');
        const detailLink = document.createElement('a');
        detailLink.href = "#";
        detailLink.textContent = "Chi tiết";
        detailLink.addEventListener('click', function (event) {
            event.preventDefault();
            showAnnouncementDetail(announcement);
        });
        detailCell.appendChild(detailLink);
        row.appendChild(detailCell);

        announcementTableBody.appendChild(row);
    });

    // Hàm hiển thị chi tiết thông báo trên panel
    function showAnnouncementDetail(announcement) {
        document.getElementById('detailTitle').textContent = announcement.title;
        document.getElementById('detailType').textContent = announcement.type;
        document.getElementById('detailContent').textContent = announcement.details;
        document.getElementById('detailRecipient').textContent = announcement.recipient;
        document.getElementById('detailSendDate').textContent = announcement.sendDate;
        // Hiển thị panel chi tiết
        document.getElementById('announcementDetailPanel').style.display = 'block';
    }

    // Đóng panel chi tiết thông báo
    document.getElementById('closeAnnouncementDetailBtn').addEventListener('click', function () {
        document.getElementById('announcementDetailPanel').style.display = 'none';
    });
});
