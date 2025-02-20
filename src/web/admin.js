document.addEventListener('DOMContentLoaded', function () {
    // Danh sách dữ liệu người dùng giả lập
    const users = [
        { name: 'Nguyễn Đức Thành', locked: 'Bình thường', role: 'Người dùng' },
        { name: 'Nguyễn Văn Thành', locked: 'Cảnh báo', role: 'Người bán' },
        { name: 'Trần AA', locked: 'Bình thường', role: 'Người dùng' },
        { name: 'Lê BB', locked: 'Bị khóa', role: 'Người bán' },
        { name: 'Phạm Văn C', locked: 'Bình thường', role: 'Người dùng' },
        { name: 'Đỗ Duy K', locked: 'Cảnh báo', role: 'Người bán' },
        { name: 'Hoàng Minh T', locked: 'Bị khóa', role: 'Người dùng' },
        { name: 'Trần Văn E', locked: 'Bình thường', role: 'Người bán' },
        { name: 'Nguyễn Hà N', locked: 'Bị khóa', role: 'Người dùng' },
        { name: 'Vũ Thanh M', locked: 'Cảnh báo', role: 'Người bán' },
        { name: 'Lê Huy T', locked: 'Bình thường', role: 'Người dùng' },
        { name: 'Phan Anh P', locked: 'Bị khóa', role: 'Người bán' },
        { name: 'Trịnh Đức Q', locked: 'Cảnh báo', role: 'Người dùng' },
        { name: 'Bùi Quốc B', locked: 'Bình thường', role: 'Người bán' },
        { name: 'Ngô Thanh L', locked: 'Bị khóa', role: 'Người dùng' },
        { name: 'Dương Hoài H', locked: 'Cảnh báo', role: 'Người bán' },
        { name: 'Phùng Gia P', locked: 'Bình thường', role: 'Người dùng' },
        { name: 'Đặng Văn X', locked: 'Bị khóa', role: 'Người bán' },
        { name: 'Mai Khắc T', locked: 'Cảnh báo', role: 'Người dùng' },
        { name: 'Lâm Tuấn K', locked: 'Bình thường', role: 'Người bán' }
    ];

    const userTableBody = document.querySelector('#userList tbody');

    // Lặp qua từng người dùng và tạo dòng trong bảng
    users.forEach(user => {
        const row = document.createElement('tr');

        // Cột Role
        const roleCell = document.createElement('td');
        roleCell.textContent = user.role;
        row.appendChild(roleCell);

        // Cột Tên người dùng
        const nameCell = document.createElement('td');
        nameCell.textContent = user.name;
        row.appendChild(nameCell);

        // Cột Trạng thái 
        const lockedCell = document.createElement('td');
        lockedCell.textContent = user.locked;
        row.appendChild(lockedCell);

        // Cột Chi tiết
        const detailCell = document.createElement('td');
        const detailLink = document.createElement('a');
        detailLink.href = "#";
        detailLink.textContent = "Chi tiết";
        detailCell.appendChild(detailLink);
        row.appendChild(detailCell);

        // Thêm dòng vào bảng
        userTableBody.appendChild(row);
    });
    
});
