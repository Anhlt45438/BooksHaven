document.addEventListener('DOMContentLoaded', function () {
    console.log("✅ Trang đã được tải. Bắt đầu lấy dữ liệu báo cáo...");

    const token = localStorage.getItem("accessToken");
    if (!token) {
        alert("⚠️ Bạn chưa đăng nhập.");
        window.location.href = "login.html";
        return;
    }

    let currentPage = 1;
    const limit = 10;

    // Hàm tải dữ liệu báo cáo từ API
    function fetchReports(page) {
        console.log(`📥 Đang tải dữ liệu báo cáo cho trang ${page}...`);

        fetch(`http://14.225.206.60:3000/api/notifications/user-notifications?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data?.data) {
                    renderReportsTable(data.data);
                    updatePagination(data.pagination);
                    console.log(`✅ Đã tải ${data.data.length} báo cáo`);
                } else {
                    console.error("❌ Dữ liệu báo cáo không hợp lệ:", data);
                }
            })
            .catch(err => {
                console.error("❌ Lỗi khi lấy danh sách báo cáo:", err);
            });
    }

    // Hàm render danh sách báo cáo vào bảng
    function renderReportsTable(reports) {
        const reportTableBody = document.querySelector('#userList tbody');
        reportTableBody.innerHTML = '';

        reports.forEach(report => {
            const row = document.createElement('tr');

            // Lấy thông tin người báo cáo
            getUserName(report.id_nguoi_gui)
                .then(userName => {
                    // Cột Tên người báo cáo
                    const reporterCell = document.createElement('td');
                    reporterCell.textContent = userName;
                    row.appendChild(reporterCell);

                    // Cột Ngày gửi báo cáo
                    const sendDateCell = document.createElement('td');
                    sendDateCell.textContent = report.ngay_gui;
                    row.appendChild(sendDateCell);

                    // Cột Mô tả
                    const descriptionCell = document.createElement('td');
                    descriptionCell.textContent = report.tieu_de;
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
                })
                .catch(error => {
                    console.error("❌ Lỗi lấy tên người báo cáo:", error);
                });
        });
    }

    // Hàm lấy tên người báo cáo từ id
    function getUserName(userId) {
        return new Promise((resolve, reject) => {
            fetch(`http://14.225.206.60:3000/api/admin/users/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (data?.data) {
                        resolve(data.data.username);
                    } else {
                        reject("Không tìm thấy tên người dùng");
                    }
                })
                .catch(err => {
                    reject("Lỗi khi lấy thông tin người dùng: " + err);
                });
        });
    }

    // Hàm hiển thị chi tiết báo cáo
    function showReportDetail(report) {
        // Điền thông tin báo cáo vào panel chi tiết
        document.getElementById('detailReportId').textContent = report.id_thong_bao;
        getUserName(report.id_nguoi_gui)
            .then(userName => {
                document.getElementById('detailReporter').textContent = userName;
            })
            .catch(error => {
                document.getElementById('detailReporter').textContent = "Không thể lấy tên người báo cáo";
            });

        document.getElementById('detailSendDate').textContent = report.ngay_gui;
        document.getElementById('detailSimpleDescription').textContent = report.tieu_de;
        document.getElementById('detailDetailedDescription').textContent = report.noi_dung_thong_bao;

        // Kiểm tra phản hồi
        if (report.da_doc === false) {
            // Nếu chưa có phản hồi, hiển thị ô nhập phản hồi và nút phản hồi
            document.getElementById('feedbackInputContainer').style.display = 'block';
            document.getElementById('feedbackDisplayContainer').style.display = 'none';
        } else {
            // Nếu đã có phản hồi, hiển thị ngày và nội dung phản hồi
            document.getElementById('feedbackInputContainer').style.display = 'none';
            document.getElementById('feedbackDisplayContainer').style.display = 'block';
            document.getElementById('feedbackDate').textContent = report.ngay_phan_hoi || "Chưa có phản hồi";
            document.getElementById('feedbackContent').textContent = report.noi_dung_phan_hoi || "Chưa có phản hồi";
        }

        // Hiển thị panel chi tiết báo cáo
        document.getElementById('reportDetailPanel').style.display = 'block';

        // Lưu thông tin báo cáo hiện tại vào một biến toàn cục (dùng cho xử lý phản hồi)
        currentReport = report;
    }

    // Biến toàn cục lưu thông tin báo cáo hiện tại
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

        const response = {
            id_user: currentReport.id_nguoi_gui,
            noi_dung_thong_bao: feedbackContent,
            tieu_de: "Phản hồi về báo cáo của người dùng"
        };

        // Gửi phản hồi lên server
        fetch('http://14.225.206.60:3000/api/notifications/send-to-user', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(response)
        })
            .then(res => res.json())
            .then(data => {
                alert("✅ Phản hồi đã được gửi.");
                document.getElementById('feedbackDate').textContent = currentDate;
                document.getElementById('feedbackContent').textContent = feedbackContent;
                document.getElementById('feedbackInputContainer').style.display = 'none';
                document.getElementById('feedbackDisplayContainer').style.display = 'block';

                // Cập nhật trạng thái đã đọc và reload lại dữ liệu
                updateReadStatus(currentReport.id_thong_bao);
            })
            .catch(err => {
                console.error("❌ Lỗi khi gửi phản hồi:", err);
            });
    });

    // Hàm cập nhật trạng thái đã đọc và load lại dữ liệu
    function updateReadStatus(reportId) {
        fetch(`http://14.225.206.60:3000/api/notifications/${reportId}/mark-as-read`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                fetchReports(currentPage); // Load lại dữ liệu sau khi cập nhật trạng thái đã đọc
                console.log("✅ Trạng thái đã được cập nhật");
            })
            .catch(err => {
                console.error("❌ Lỗi khi cập nhật trạng thái đã đọc:", err);
            });
    }

    // Hàm phân trang
    document.getElementById('prevPage').addEventListener('click', function () {
        if (currentPage > 1) {
            currentPage--;
            fetchReports(currentPage);
        }
    });

    document.getElementById('nextPage').addEventListener('click', function () {
        currentPage++;
        fetchReports(currentPage);
    });

    // Cập nhật thông tin phân trang
    function updatePagination(pagination) {
        document.getElementById('currentPage').textContent = currentPage;
        document.getElementById('prevPage').disabled = currentPage <= 1;
        document.getElementById('nextPage').disabled = currentPage >= pagination.totalPages;
        console.log(`📄 Trang hiện tại: ${currentPage} / ${pagination.totalPages}`);
    }

    // Bắt đầu tải báo cáo khi trang tải xong
    fetchReports(currentPage);

    // Hàm đóng panel chi tiết
    function closeDetailPanel() {
        document.getElementById('closeReportDetailBtn').addEventListener('click', function () {
            document.getElementById('reportDetailPanel').style.display = 'none';  // Ẩn panel chi tiết
            console.log("❌ Đóng panel chi tiết");
        });
        
    }

    // document.getElementById('closeReportDetailBtn').addEventListener('click', function () {
    //     document.getElementById('reportDetailPanel').style.display = 'none';  // Ẩn panel chi tiết
    //     console.log("❌ Đóng panel chi tiết");
    // });
    
});
