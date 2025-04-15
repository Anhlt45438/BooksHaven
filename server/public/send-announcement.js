document.addEventListener("DOMContentLoaded", function () {
    const searchBtn = document.querySelector(".search-btn");
    const userIdInput = document.getElementById("userIdInput");
    const userNameDisplay = document.getElementById("userNameDisplay");
    const userButton = document.getElementById("userButton");
    const shopButton = document.getElementById("shopButton");
    const submitBtn = document.querySelector(".submit-btn");
    const titleInput = document.getElementById("titleInput");
    const messageInput = document.getElementById("messageInput");

    let selectedUserId = null;
    let selectedRole = null;  // Biến lưu vai trò được chọn
    const bearerToken = localStorage.getItem("accessToken");

    // Kiểm tra đăng nhập
    if (!bearerToken) {
        alert("⚠️ Bạn chưa đăng nhập.");
        window.location.replace("/admin-site/login");
        return;
    }

    // Log khi trang đã sẵn sàng
    console.log("Trang đã sẵn sàng!");

    // Tìm kiếm người dùng theo ID và hiển thị kết quả
    searchBtn.addEventListener("click", function () {
        const userId = userIdInput.value;
        console.log(`Đang tìm kiếm người dùng với ID: ${userId}`);

        if (!userId) {
            console.log("ID người dùng không hợp lệ.");
            alert("Vui lòng nhập ID người dùng.");
            return;
        }

        console.log("Đang gửi yêu cầu tìm người dùng...");
        fetch(`http://14.225.206.60:3000/api/admin/users/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${bearerToken}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    console.log("API trả về lỗi, không tìm thấy người dùng.");
                    throw new Error("Không tìm thấy người dùng hoặc có lỗi với API");
                }
                console.log("API trả về thành công.");
                return response.json();
            })
            .then(data => {
                if (data && data.data) {
                    const user = data.data;
                    console.log(`Tìm thấy người dùng: ${user.username}`);
                    userNameDisplay.textContent = `Tìm thấy người dùng: ${user.username}`;
                    userNameDisplay.style.display = "block";

                    selectedUserId = userId;

                    // Khi tìm thấy người dùng, vô hiệu hóa các nút chọn vai trò và thay đổi màu
                    console.log("Vô hiệu hóa các nút chọn vai trò (userButton, shopButton).");
                    userButton.disabled = true;
                    shopButton.disabled = true;
                    userButton.classList.add('disabled');
                    shopButton.classList.add('disabled');
                } else {
                    console.log("Không tìm thấy người dùng!");
                    alert("Không tìm thấy người dùng!");
                    userNameDisplay.style.display = "none"; // Ẩn tên người dùng
                }
            })
            .catch(error => {
                console.error("Lỗi khi lấy dữ liệu người dùng:", error);
                alert("Đã xảy ra lỗi khi lấy dữ liệu người dùng. Vui lòng kiểm tra lại API hoặc ID người dùng.");
            });
    });

    // Khi thay đổi giá trị trong ô nhập ID
    userIdInput.addEventListener("input", function () {
        const userId = userIdInput.value;

        // Nếu có dữ liệu nhập vào ô ID, bỏ chọn vai trò
        if (userId) {
            console.log("Đang nhập ID người dùng. Bỏ chọn vai trò.");
            selectedRole = null;  // Reset vai trò
            userButton.classList.remove('selected');
            shopButton.classList.remove('selected');
            userButton.classList.remove('disabled');
            shopButton.classList.remove('disabled');
        }

        // Nếu xóa hoặc thay đổi ký tự trong ô nhập ID
        if (!userId) {
            // Không tìm thấy người dùng, cho phép tương tác lại với các nút
            console.log("Không có ID người dùng, kích hoạt lại nút vai trò.");
            userNameDisplay.style.display = "none";
            userButton.disabled = false;
            shopButton.disabled = false;
            userButton.classList.remove('disabled');
            shopButton.classList.remove('disabled');
            selectedUserId = null; // Reset ID người dùng
        }
    });

    // Sự kiện chọn vai trò người dùng
    userButton.addEventListener("click", function () {
        selectedRole = "user";  // Gán vai trò là user
        console.log("Vai trò đã chọn: user");

        userButton.classList.add('selected');
        shopButton.classList.remove('selected');

        // Làm mờ ô nhập ID và nút tìm ID
        userButton.classList.add('disabled');  // Thêm lớp disabled để thay đổi màu
        shopButton.classList.add('disabled');  // Làm mờ nút shop
    });

    // Sự kiện chọn vai trò cửa hàng (shop)
    shopButton.addEventListener("click", function () {
        selectedRole = "shop";  // Gán vai trò là shop
        console.log("Vai trò đã chọn: shop");

        shopButton.classList.add('selected');
        userButton.classList.remove('selected');

        // Làm mờ ô nhập ID và nút tìm ID
        userButton.classList.add('disabled');  // Làm mờ nút user
        shopButton.classList.add('disabled');  // Thêm lớp disabled để thay đổi màu
    });

    // Gửi thông báo
    submitBtn.addEventListener("click", function () {
        const title = titleInput.value;
        const message = messageInput.value;

        console.log(`Tiêu đề thông báo: ${title}`);
        console.log(`Nội dung thông báo: ${message}`);

        if (!title || !message) {
            console.log("Tiêu đề hoặc nội dung thông báo không hợp lệ.");
            alert("Vui lòng điền đầy đủ tiêu đề và nội dung thông báo.");
            return;
        }

        const notificationData = {
            noi_dung_thong_bao: message,
            tieu_de: title
        };

        if (selectedUserId) {
            // Nếu đã tìm kiếm và chọn người dùng theo ID, gửi thông báo riêng cho người đó
            notificationData.id_user = selectedUserId;
            console.log(`Đang gửi thông báo tới người dùng có ID: ${selectedUserId}`);
            fetch("http://14.225.206.60:3000/api/notifications/send-to-user", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${bearerToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(notificationData)
            })
                .then(response => response.json())
                .then(data => {
                    console.log("Gửi thông báo thành công!");
                    alert("Đã gửi thông báo thành công!");
                    location.reload();  // Reload lại trang sau khi gửi thông báo thành công
                })
                .catch(error => {
                    console.error("Lỗi khi gửi thông báo:", error);
                    alert("Gửi thông báo thất bại.");
                });
        } else if (selectedRole) {
            // Nếu không có ID người dùng cụ thể mà đã chọn vai trò
            notificationData.role = selectedRole;
            console.log(`Đang gửi thông báo tới tất cả người ${selectedRole}`);
            fetch("http://14.225.206.60:3000/api/notifications/send-by-role", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${bearerToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(notificationData)
            })
                .then(response => response.json())
                .then(data => {
                    console.log("Gửi thông báo tới vai trò thành công!");
                    alert("Đã gửi thông báo thành công!");
                    location.reload();  // Reload lại trang sau khi gửi thông báo thành công
                })
                .catch(error => {
                    console.error("Lỗi khi gửi thông báo:", error);
                    alert("Gửi thông báo thất bại.");
                });
        } else {
            console.log("Chưa chọn ID người dùng hoặc vai trò.");
            alert("Vui lòng nhập ID người dùng hoặc chọn vai trò để gửi thông báo.");
        }
    });
});
