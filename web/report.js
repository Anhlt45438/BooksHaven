let reportsData = [];  // Khai báo toàn cục để lưu trữ dữ liệu báo cáo

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
                    reportsData = data.data; // Lưu báo cáo vào biến toàn cục reportsData
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
                    sendDateCell.textContent = report.ngay_tao;
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

        document.getElementById('detailSendDate').textContent = report.ngay_tao;
        // document.getElementById('detailSimpleDescription').textContent = report.tieu_de;
        // document.getElementById('detailDetailedDescription').textContent = report.noi_dung_thong_bao;

        // // Kiểm tra trạng thái da_doc và hiển thị phần phản hồi
        // if (report.da_doc === false) {
        //     // Nếu trạng thái là false, hiển thị ô nhập phản hồi
        //     document.getElementById('feedbackInputContainer').style.display = 'block';
        //     document.getElementById('feedbackDisplayContainer').style.display = 'none';
        // } else {
        //     // Nếu trạng thái là true, hiển thị phản hồi đã có
        //     document.getElementById('feedbackInputContainer').style.display = 'none';
        //     document.getElementById('feedbackDisplayContainer').style.display = 'block';
        // }

        // Hiển thị panel chi tiết báo cáo
        document.getElementById('reportDetailPanel').style.display = 'block';

        // Lưu thông tin báo cáo hiện tại vào một biến toàn cục (dùng cho xử lý phản hồi)
        currentReport = report;
    }

    // Hàm gửi phản hồi
    document.getElementById('submitFeedbackBtn').addEventListener('click', function () {
        const feedbackContent = document.getElementById('feedbackInput').value.trim();
        if (feedbackContent === '') {
            alert('Vui lòng nhập phản hồi trước khi gửi.');
            return;
        }

        // Cấu trúc phản hồi
        const response = {
            id_user: currentReport.id_nguoi_gui,  // Lấy ID người gửi báo cáo
            noi_dung_thong_bao: feedbackContent,
            tieu_de: feedbackContent,  // Tiêu đề là nội dung phản hồi
        };

        // Xác nhận gửi phản hồi
        if (confirm("Bạn có chắc chắn muốn gửi phản hồi này?")) {
            // Gửi phản hồi lên API (thực tế sẽ gửi phản hồi, nhưng ở đây bạn thay thế bằng PATCH để cập nhật trạng thái)
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

                    // Sau khi gửi phản hồi thành công, thay đổi trạng thái da_doc của báo cáo
                    const reportId = currentReport.id_thong_bao; // Lấy ID báo cáo
                    fetch(`http://14.225.206.60:3000/api/notifications/mark-as-read/${reportId}`, {
                        method: 'PATCH',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    })
                        .then(res => res.json())
                        .then(data => {
                            console.log("✅ Trạng thái da_doc đã được cập nhật thành true.");

                            // Cập nhật giao diện sau khi cập nhật trạng thái da_doc
                            currentReport.da_doc = true;

                            // Cập nhật lại giao diện
                            document.getElementById('feedbackDisplayContainer').style.display = 'block';
                            document.getElementById('feedbackInputContainer').style.display = 'none';

                            // Cập nhật lại bảng để thay đổi trạng thái
                            renderReportsTable(reportsData);
                        })
                        .catch(err => {
                            console.error("❌ Lỗi khi cập nhật trạng thái da_doc:", err);
                            alert("❌ Đã có lỗi khi cập nhật trạng thái.");
                        });
                })
                .catch(err => {
                    console.error("❌ Lỗi khi gửi phản hồi:", err);
                    alert("❌ Đã có lỗi khi gửi phản hồi.");
                });
        }
    });




    // Hàm phân trang
    document.getElementById('prevPage').addEventListener('click', function () {
        if (currentPage > 1) {
            currentPage--;
            fetchReports(currentPage);
        }
    });

    document.getElementById('nextPage').addEventListener('click', function () {
        if (currentPage < pagination.totalPages) {
            currentPage++;
            fetchReports(currentPage);
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

    // Bắt đầu tải báo cáo khi trang tải xong
    fetchReports(currentPage);

    // Hàm đóng panel chi tiết
    function closeDetailPanel() {
        document.getElementById('closeReportDetailBtn').addEventListener('click', function () {
            document.getElementById('reportDetailPanel').style.display = 'none';  // Ẩn panel chi tiết
            console.log("❌ Đóng panel chi tiết");
        });

    }

    document.getElementById('closeReportDetailBtn').addEventListener('click', function () {
        document.getElementById('reportDetailPanel').style.display = 'none';  // Ẩn panel chi tiết
        console.log("❌ Đóng panel chi tiết");
    });

});
