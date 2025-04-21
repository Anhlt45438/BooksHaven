let feedbacksData = [];  // Khai báo toàn cục để lưu trữ dữ liệu phản hồi
let currentFeedback = null; // Lưu phản hồi đang xem chi tiết

function checkAuth() {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        alert("⚠️ Bạn chưa đăng nhập.");
        window.location.replace("/admin-site/login");
        return false;
    }
    return true;
}

document.addEventListener('DOMContentLoaded', function () {
    if (!checkAuth()) return;
    console.log("✅ Trang đã được tải. Bắt đầu lấy dữ liệu phản hồi...");

    const token = localStorage.getItem("accessToken");
    if (!token) {
        alert("⚠️ Bạn chưa đăng nhập.");
        window.location.replace("/admin-site/login");
        return;
    }

    let currentPage = 1;
    const limit = 10;
    let statusFilter = "";
    let searchQuery = "";

    // Hàm tải dữ liệu phản hồi từ API
    function fetchFeedbacks(page) {
        console.log(`📥 Đang tải dữ liệu phản hồi cho trang ${page}...`);
        
        let url = `http://14.225.206.60:3000/api/feedbacks/all?page=${page}&limit=${limit}`;
        
        // Thêm bộ lọc trạng thái nếu có
        if (statusFilter) {
            url += `&status=${statusFilter}`;
        }
        
        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data?.data) {
                feedbacksData = data.data; // Lưu phản hồi vào biến toàn cục
                renderFeedbacksTable(data.data);
                updatePagination(data.pagination);
                console.log(`✅ Đã tải ${data.data.length} phản hồi`);
            } else {
                console.error("❌ Dữ liệu phản hồi không hợp lệ:", data);
            }
        })
        .catch(err => {
            console.error("❌ Lỗi khi lấy danh sách phản hồi:", err);
        });
    }

    // Hàm render danh sách phản hồi vào bảng
    function renderFeedbacksTable(feedbacks) {
        const feedbackTableBody = document.querySelector('#feedbackList tbody');
        feedbackTableBody.innerHTML = '';

        feedbacks.forEach(feedback => {
            const row = document.createElement('tr');

            // Cột Người gửi
            const userCell = document.createElement('td');
            userCell.textContent = feedback.user_info?.username || "Không xác định";
            row.appendChild(userCell);

            // Cột Ngày gửi
            const sendDateCell = document.createElement('td');
            const date = new Date(feedback.ngay_tao);
            sendDateCell.textContent = date.toLocaleDateString('vi-VN');
            row.appendChild(sendDateCell);

            // Cột Tiêu đề
            const titleCell = document.createElement('td');
            titleCell.textContent = feedback.tieu_de;
            row.appendChild(titleCell);

            // Cột Trạng thái
            const statusCell = document.createElement('td');
            const statusBadge = document.createElement('span');
            statusBadge.classList.add('status-badge');
            
            switch(feedback.trang_thai) {
                case 'cho_phan_hoi':
                    statusBadge.textContent = "Đang chờ";
                    statusBadge.classList.add('status-pending');
                    break;
                case 'dang_xu_ly':
                    statusBadge.textContent = "Đang xử lý";
                    statusBadge.classList.add('status-inprogress');
                    break;
                case 'da_giai_quyet':
                    statusBadge.textContent = "Đã giải quyết";
                    statusBadge.classList.add('status-resolved');
                    break;
                default:
                    statusBadge.textContent = "Không xác định";
            }
            
            statusCell.appendChild(statusBadge);
            row.appendChild(statusCell);

            // Cột Thao tác
            const actionCell = document.createElement('td');
            const detailLink = document.createElement('a');
            detailLink.href = "#";
            detailLink.textContent = "Chi tiết";
            detailLink.addEventListener('click', function (event) {
                event.preventDefault();
                showFeedbackDetail(feedback);
            });
            actionCell.appendChild(detailLink);
            row.appendChild(actionCell);

            feedbackTableBody.appendChild(row);
        });
    }

    // Hàm hiển thị chi tiết phản hồi
    function showFeedbackDetail(feedback) {
        currentFeedback = feedback;
        
        // Điền thông tin phản hồi vào panel chi tiết
        document.getElementById('detailFeedbackId').textContent = feedback._id;
        document.getElementById('detailUser').textContent = feedback.user_info?.username || "Không xác định";
        
        // Hiển thị trạng thái
        const statusBadge = document.getElementById('statusBadge');
        statusBadge.className = 'status-badge';
        
        switch(feedback.trang_thai) {
            case 'cho_phan_hoi':
                statusBadge.textContent = "Đang chờ";
                statusBadge.classList.add('status-pending');
                break;
            case 'dang_xu_ly':
                statusBadge.textContent = "Đang xử lý";
                statusBadge.classList.add('status-inprogress');
                break;
            case 'da_giai_quyet':
                statusBadge.textContent = "Đã giải quyết";
                statusBadge.classList.add('status-resolved');
                break;
            default:
                statusBadge.textContent = "Không xác định";
        }
        
        // Cập nhật select trạng thái
        document.getElementById('statusSelect').value = feedback.trang_thai || 'cho_phan_hoi';
        
        // Hiển thị thông tin cơ bản
        const date = new Date(feedback.ngay_tao);
        document.getElementById('detailSendDate').textContent = date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN');
        document.getElementById('detailTitle').textContent = feedback.tieu_de;
        
        // Hiển thị tin nhắn phản hồi
        renderMessages(feedback.phan_hoi || []);

        // Hiển thị panel chi tiết phản hồi
        document.getElementById('feedbackDetailPanel').style.display = 'block';
    }
    
    // Hiển thị tin nhắn phản hồi
    function renderMessages(messages) {
        const messagesContainer = document.getElementById('messagesContainer');
        messagesContainer.innerHTML = '';
        
        if (!messages || messages.length === 0) {
            const noMessages = document.createElement('p');
            noMessages.textContent = "Chưa có tin nhắn phản hồi.";
            messagesContainer.appendChild(noMessages);
            return;
        }
        
        messages.forEach(message => {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message');
            messageDiv.classList.add(message.is_admin ? 'admin' : 'user');
            
            const sender = document.createElement('div');
            sender.classList.add('sender');
            sender.textContent = message.is_admin ? 'Admin' : 'Người dùng';
            messageDiv.appendChild(sender);
            
            const content = document.createElement('div');
            content.classList.add('content');
            content.textContent = message.content;
            messageDiv.appendChild(content);
            
            const time = document.createElement('div');
            time.classList.add('time');
            const date = new Date(message.created_at);
            time.textContent = date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN');
            messageDiv.appendChild(time);
            
            messagesContainer.appendChild(messageDiv);
        });
        
        // Cuộn xuống tin nhắn mới nhất
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Hàm gửi phản hồi
    document.getElementById('submitReplyBtn').addEventListener('click', function () {
        const replyContent = document.getElementById('replyInput').value.trim();
        if (replyContent === '') {
            alert('Vui lòng nhập nội dung phản hồi trước khi gửi.');
            return;
        }

        if (!currentFeedback || !currentFeedback._id) {
            alert('Không tìm thấy thông tin phản hồi hiện tại.');
            return;
        }

        // Cấu trúc phản hồi
        const reply = {
            content: replyContent
        };

        // Gửi phản hồi lên API
        fetch(`http://14.225.206.60:3000/api/feedbacks/${currentFeedback._id}/reply`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reply)
        })
        .then(res => res.json())
        .then(data => {
            if (data.data) {
                alert("✅ Phản hồi đã được gửi thành công.");
                document.getElementById('replyInput').value = ''; // Xóa nội dung đã nhập
                
                // Cập nhật lại thông tin phản hồi hiện tại
                currentFeedback = data.data;
                renderMessages(currentFeedback.phan_hoi || []);
                currentFeedback = data.data;
                
                // Cập nhật hiển thị trạng thái
                const statusBadge = document.getElementById('statusBadge');
                statusBadge.className = 'status-badge';
                console.log(data.data.trang_thai);
                switch(data.data.trang_thai) {
                    case 'cho_phan_hoi':
                        statusBadge.textContent = "Đang chờ";
                        statusBadge.classList.add('status-pending');
                        break;
                    case 'dang_xu_ly':
                        statusBadge.textContent = "Đang xử lý";
                        statusBadge.classList.add('status-inprogress');
                        break;
                    case 'da_giai_quyet':
                        statusBadge.textContent = "Đã giải quyết";
                        statusBadge.classList.add('status-resolved');
                        break;
                }
                document.getElementById('statusSelect').value = data.data.trang_thai;

                
                // Cập nhật lại bảng để thay đổi trạng thái
                fetchFeedbacks(currentPage);
            } else {
                alert("❌ Có lỗi khi gửi phản hồi: " + (data.message || "Lỗi không xác định"));
            }
        })
        .catch(err => {
            console.error("❌ Lỗi khi gửi phản hồi:", err);
            alert("❌ Đã có lỗi khi gửi phản hồi.");
        });
    });
    
    // Cập nhật trạng thái phản hồi
    document.getElementById('updateStatusBtn').addEventListener('click', function() {
        if (!currentFeedback || !currentFeedback._id) {
            alert('Không tìm thấy thông tin phản hồi hiện tại.');
            return;
        }
        
        const newStatus = document.getElementById('statusSelect').value;
        
        fetch(`http://14.225.206.60:3000/api/feedbacks/status/${currentFeedback._id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        })
        .then(res => res.json())
        .then(data => {
            if (data.data) {
                alert("✅ Trạng thái đã được cập nhật thành công.");
                
                // Cập nhật lại thông tin phản hồi hiện tại
                currentFeedback = data.data;
                
                // Cập nhật hiển thị trạng thái
                const statusBadge = document.getElementById('statusBadge');
                statusBadge.className = 'status-badge';
                
                switch(newStatus) {
                    case 'cho_phan_hoi':
                        statusBadge.textContent = "Đang chờ";
                        statusBadge.classList.add('status-pending');
                        break;
                    case 'dang_xu_ly':
                        statusBadge.textContent = "Đang xử lý";
                        statusBadge.classList.add('status-inprogress');
                        break;
                    case 'da_giai_quyet':
                        statusBadge.textContent = "Đã giải quyết";
                        statusBadge.classList.add('status-resolved');
                        break;
                }
                
                // Cập nhật lại bảng
                fetchFeedbacks(currentPage);
            } else {
                alert("❌ Có lỗi khi cập nhật trạng thái: " + (data.message || "Lỗi không xác định"));
            }
        })
        .catch(err => {
            console.error("❌ Lỗi khi cập nhật trạng thái:", err);
            alert("❌ Đã có lỗi khi cập nhật trạng thái.");
        });
    });

    // Xử lý tìm kiếm và lọc
    document.getElementById('searchButton').addEventListener('click', function() {
        searchQuery = document.getElementById('searchInput').value.trim();
        statusFilter = document.getElementById('statusFilter').value;
        currentPage = 1; 
    });

    // Hàm phân trang
    document.getElementById('prevPage').addEventListener('click', function () {
        if (currentPage > 1) {
            currentPage--;
            fetchFeedbacks(currentPage);
        }
    });

    document.getElementById('nextPage').addEventListener('click', function () {
        if (currentPage < pagination.totalPages) {
            currentPage++;
            fetchFeedbacks(currentPage);
        }
    });

    // Cập nhật thông tin phân trang
    function updatePagination(pagination) {
        // Cập nhật thông tin trang hiện tại
        document.getElementById('currentPage').textContent = currentPage;
        document.getElementById('prevPage').disabled = currentPage <= 1;
        document.getElementById('nextPage').disabled = currentPage >= pagination.totalPages;
        console.log(`📄 Trang hiện tại: ${currentPage} / ${pagination.totalPages}`);
    }

    // Đóng panel chi tiết
    document.getElementById('closeFeedbackDetailBtn').addEventListener('click', function () {
        document.getElementById('feedbackDetailPanel').style.display = 'none';
        console.log("❌ Đóng panel chi tiết");
    });

    // Bắt đầu tải phản hồi khi trang tải xong
    fetchFeedbacks(currentPage);
    document.getElementById('searchButton').addEventListener('click', function() {
        searchQuery = document.getElementById('searchInput').value.trim();
        statusFilter = document.getElementById('statusFilter').value;
        currentPage = 1; // Reset về trang đầu tiên
        searchFeedbacks();
    });
    
    // Hàm tìm kiếm phản hồi
    function searchFeedbacks() {
        console.log(`🔍 Đang tìm kiếm phản hồi với từ khóa: "${searchQuery}" và trạng thái: "${statusFilter}"`);
        
        let url = `http://14.225.206.60:3000/api/feedbacks/search?page=${currentPage}&limit=${limit}`;
        
        if (searchQuery) {
            url += `&q=${encodeURIComponent(searchQuery)}`;
        }
        
        if (statusFilter) {
            url += `&status=${statusFilter}`;
        }
    
        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data?.data) {
                feedbacksData = data.data;
                renderFeedbacksTable(data.data);
                updatePagination(data.pagination);
                console.log(`🔎 Tìm thấy ${data.data.length} phản hồi`);
            } else {
                console.log("❌ Không tìm thấy kết quả phù hợp");
                renderFeedbacksTable([]);
                updatePagination({ currentPage: 1, totalPages: 1, total: 0 });
            }
        })
        .catch(error => {
            console.error("❌ Lỗi khi tìm kiếm:", error);
            alert("Có lỗi xảy ra khi tìm kiếm phản hồi");
        });
    }
});

// Các hàm điều hướng sidebar
function user() {
    window.location.href = "/admin-site/user";
}

function product() {
    window.location.href = "/admin-site/product";
}

function turnover() {
    window.location.href = "/admin-site/revenue";
}

function announcement() {
    window.location.href = "/admin-site/announcement";
}
