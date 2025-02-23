function login() {
    // Lấy giá trị từ ô nhập liệu
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    // Kiểm tra tài khoản và mật khẩu
    if (username === "admin" && password === "admin123") {
        window.location.href = "admin.html";
        alert("Đăng nhập thành công!");
    } else {
        alert("Đăng nhập thất bại! Vui lòng kiểm tra lại tài khoản và mật khẩu.");
    }
}

function user() {
    window.location.href = "admin.html";
}

function product() {
    window.location.href = "product.html";
}

function order() {
    window.location.href = "order.html";
}

function turnover() {
    window.location.href = "turnover.html";
}

function history() {
    window.location.href = "history.html";
}

function announcement() {
    window.location.href = "announcement.html";
}

function reports() {
    window.location.href = "report.html";
}
