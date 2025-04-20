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
    // ... existing initialization code ...
});