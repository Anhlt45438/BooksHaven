document.addEventListener('DOMContentLoaded', function () {
    // Dữ liệu thông báo giả lập
    const announcements = [
        { id: 1, title: 'Thông báo 1', type: 'Loại 1', sendDate: '', details: 'Chi tiết thông báo 1', status: '' },
        { id: 2, title: 'Thông báo 2', type: 'Loại 2', sendDate: '2025-02-10', details: 'Chi tiết thông báo 2', status: '' },
        { id: 3, title: 'Thông báo 3', type: 'Loại 1', sendDate: '2025-02-12', details: 'Chi tiết thông báo 3', status: '' },
        { id: 4, title: 'Thông báo 4', type: 'Loại 3', sendDate: '', details: 'Chi tiết thông báo 4', status: '' }
    ];

    const announcementTableBody = document.querySelector('#userList tbody');

    // Lặp qua từng thông báo và tạo dòng trong bảng
    announcements.forEach(announcement => {
        const row = document.createElement('tr');

        // Cột Mã thông báo
        const idCell = document.createElement('td');
        idCell.textContent = announcement.id;
        row.appendChild(idCell);

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
        sendDateCell.textContent = announcement.sendDate || '';
        row.appendChild(sendDateCell);

        // Cột Chi tiết
        const detailCell = document.createElement('td');
        const detailLink = document.createElement('a');
        detailLink.href = "#";
        detailLink.textContent = "Chi tiết";
        detailCell.appendChild(detailLink);
        row.appendChild(detailCell);

        // Cột trạng thái thông báo
        const statusCell = document.createElement('td');
        statusCell.textContent = announcement.sendDate ? 'Đã gửi' : 'Chưa gửi'; // Kiểm tra ngày gửi để xác định trạng thái
        row.appendChild(statusCell);

        // Thêm dòng vào bảng
        announcementTableBody.appendChild(row);
    });
});
