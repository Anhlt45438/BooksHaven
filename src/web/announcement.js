document.addEventListener('DOMContentLoaded', function () {
    // Dữ liệu thông báo giả lập
    const announcements = [
        { id: 1, title: 'Thông báo 1', type: 'Loại 1', sendDate: '', details: 'Chi tiết thông báo 1', status: '' },
        { id: 2, title: 'Thông báo 2', type: 'Loại 2', sendDate: '2025-02-10', details: 'Chi tiết thông báo 2', status: '' },
        { id: 3, title: 'Thông báo 3', type: 'Loại 1', sendDate: '2025-02-12', details: 'Chi tiết thông báo 3', status: '' },
        { id: 4, title: 'Thông báo 4', type: 'Loại 3', sendDate: '', details: 'Chi tiết thông báo 4', status: '' },
        { id: 5, title: 'Thông báo 5', type: 'Loại 2', sendDate: '2025-02-15', details: 'Chi tiết thông báo 5', status: '' },
        { id: 6, title: 'Thông báo 6', type: 'Loại 1', sendDate: '', details: 'Chi tiết thông báo 6', status: '' },
        { id: 7, title: 'Thông báo 7', type: 'Loại 3', sendDate: '2025-02-18', details: 'Chi tiết thông báo 7', status: '' },
        { id: 8, title: 'Thông báo 8', type: 'Loại 2', sendDate: '', details: 'Chi tiết thông báo 8', status: '' },
        { id: 9, title: 'Thông báo 9', type: 'Loại 1', sendDate: '2025-02-20', details: 'Chi tiết thông báo 9', status: '' },
        { id: 10, title: 'Thông báo 10', type: 'Loại 3', sendDate: '', details: 'Chi tiết thông báo 10', status: '' },
        { id: 11, title: 'Thông báo 11', type: 'Loại 2', sendDate: '2025-02-22', details: 'Chi tiết thông báo 11', status: '' },
        { id: 12, title: 'Thông báo 12', type: 'Loại 1', sendDate: '', details: 'Chi tiết thông báo 12', status: '' },
        { id: 13, title: 'Thông báo 13', type: 'Loại 3', sendDate: '2025-02-25', details: 'Chi tiết thông báo 13', status: '' },
        { id: 14, title: 'Thông báo 14', type: 'Loại 2', sendDate: '', details: 'Chi tiết thông báo 14', status: '' },
        { id: 15, title: 'Thông báo 15', type: 'Loại 1', sendDate: '2025-02-28', details: 'Chi tiết thông báo 15', status: '' },
        { id: 16, title: 'Thông báo 16', type: 'Loại 3', sendDate: '', details: 'Chi tiết thông báo 16', status: '' },
        { id: 17, title: 'Thông báo 17', type: 'Loại 2', sendDate: '2025-03-01', details: 'Chi tiết thông báo 17', status: '' },
        { id: 18, title: 'Thông báo 18', type: 'Loại 1', sendDate: '', details: 'Chi tiết thông báo 18', status: '' },
        { id: 19, title: 'Thông báo 19', type: 'Loại 3', sendDate: '2025-03-05', details: 'Chi tiết thông báo 19', status: '' },
        { id: 20, title: 'Thông báo 20', type: 'Loại 2', sendDate: '', details: 'Chi tiết thông báo 20', status: '' }
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