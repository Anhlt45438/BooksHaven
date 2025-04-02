// Lắng nghe sự kiện khi form được submit
document.getElementById("change-password-form").addEventListener("submit", function (e) {
    // Ngừng hành động mặc định của form (không reload trang)
    e.preventDefault();
    console.log("Form đã được submit.");

    // Lấy giá trị của mật khẩu mới và xác nhận mật khẩu từ form
    const newPassword = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    console.log("Mật khẩu mới: ", newPassword);
    console.log("Xác nhận mật khẩu mới: ", confirmPassword);

    // Kiểm tra xem mật khẩu mới và mật khẩu xác nhận có trùng khớp không
    if (newPassword !== confirmPassword) {
        alert("Mật khẩu mới và xác nhận mật khẩu không trùng khớp!");
        console.log("Mật khẩu và xác nhận mật khẩu không khớp.");
        return;
    }
    console.log("Mật khẩu và xác nhận mật khẩu đã khớp.");

    // Lấy token từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    // Kiểm tra xem token có tồn tại trong URL không
    if (!token) {
        alert("Không tìm thấy token trong URL!");
        console.log("Không tìm thấy token trong URL.");
        return;
    }
    console.log("Token lấy từ URL: ", token);

    // Tạo đối tượng dữ liệu để gửi tới API
    const data = {
        token: token,
        newPassword: newPassword
    };
    console.log("Dữ liệu gửi đến API: ", data);

    // Gửi yêu cầu POST đến API
    fetch('http://14.225.206.60:3000/api/users/reset-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            // Kiểm tra phản hồi của API
            console.log("Nhận phản hồi từ API: ", response);
            if (!response.ok) {
                throw new Error("Phản hồi không hợp lệ từ API.");
            }
            return response.json();
        })
        .then(data => {
            // Xử lý dữ liệu phản hồi từ API
            console.log("Dữ liệu nhận được từ API: ", data);
            // if (data.success) {
                alert("Đổi mật khẩu thành công!");
                console.log("Đổi mật khẩu thành công.");
            // } else {
            //     alert("Đã xảy ra lỗi khi đổi mật khẩu. Vui lòng thử lại.");
            //     console.log("Lỗi khi đổi mật khẩu: ", data.message);
            // }
        })
        .catch(error => {
            // Xử lý lỗi khi kết nối với API
            console.error('Lỗi:', error);
            alert("Đã xảy ra lỗi khi kết nối với máy chủ.");
            console.log("Lỗi kết nối API: ", error);
        });
});
