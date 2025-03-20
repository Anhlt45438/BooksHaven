// =========================================================
// XỬ LÝ KHI TRANG LOAD (KIỂM TRA LƯU TRỮ ĐĂNG NHẬP)
// =========================================================
document.addEventListener("DOMContentLoaded", function () {
    console.log("🚀 Trang đăng nhập đã tải xong, kiểm tra thông tin đăng nhập đã lưu...");

    const savedUsername = localStorage.getItem("savedUsername");
    const savedPassword = localStorage.getItem("savedPassword");
    const rememberMeCheckbox = document.getElementById("rememberMe");

    if (rememberMeCheckbox) {
        rememberMeCheckbox.checked = false; // Mặc định không chọn

        if (savedUsername && savedPassword) {
            console.log("🔹 Đã tìm thấy thông tin đăng nhập được lưu trước đó.");
            document.getElementById("username").value = savedUsername;
            document.getElementById("password").value = savedPassword;
            rememberMeCheckbox.checked = true; // Đánh dấu checkbox nếu đã chọn trước đó
        } else {
            console.log("⚠️ Không có thông tin đăng nhập nào được lưu.");
        }
    }
});

// =========================================================
// HÀM XỬ LÝ ĐĂNG NHẬP
// =========================================================
async function login() {
    console.log("🟢 Bắt đầu quá trình đăng nhập...");

    const emailInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const rememberMeCheckbox = document.getElementById("rememberMe");

    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password) {
        alert("Vui lòng nhập đầy đủ email và mật khẩu.");
        return;
    }

    console.log(`📡 Đang gửi yêu cầu đăng nhập với email: ${email}`);

    const payload = { email, password };

    try {
        const endpoint = "http://localhost:3000/api/users/login";
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (response.ok) {
            console.log("✅ Đăng nhập thành công!");

            // Lưu token vào localStorage
            localStorage.setItem("accessToken", data.accessToken);

            if (rememberMeCheckbox.checked) {
                localStorage.setItem("savedUsername", email);
                localStorage.setItem("savedPassword", password);
            } else {
                localStorage.removeItem("savedUsername");
                localStorage.removeItem("savedPassword");
            }

            showSuccessAndCountdown();
        } else {
            alert(data.message || "Đăng nhập thất bại!");
        }
    } catch (error) {
        console.error("🚨 Lỗi trong quá trình đăng nhập:", error);
        alert("Có lỗi xảy ra trong quá trình đăng nhập!");
    }
}


// =========================================================
// HÀM HIỂN THỊ THÔNG BÁO THÀNH CÔNG VÀ CHUYỂN HƯỚNG
// =========================================================
function showSuccessAndCountdown() {
    console.log("🎉 Hiển thị thông báo đăng nhập thành công và đếm ngược chuyển hướng...");

    let notification = document.getElementById("notification");
    if (!notification) {
        notification = document.createElement("div");
        notification.id = "notification";
        notification.style.fontSize = "18px";
        notification.style.marginTop = "20px";
        const loginBox = document.querySelector(".login-box");
        if (loginBox) {
            loginBox.appendChild(notification);
        } else {
            document.body.appendChild(notification);
        }
    }

    let countdown = 3;
    notification.innerHTML = `✅ Đăng nhập thành công! Sẽ tự động chuyển hướng trong ${countdown} giây...`;

    const intervalId = setInterval(() => {
        countdown--;
        if (countdown <= 0) {
            clearInterval(intervalId);
            console.log("➡️ Chuyển hướng đến trang admin...");
            window.location.href = "admin.html";
        } else {
            notification.innerHTML = `✅ Đăng nhập thành công! Sẽ tự động chuyển hướng trong ${countdown} giây...`;
        }
    }, 1000);
}

// =========================================================
// HÀM HIỂN THỊ LỖI DƯỚI Ô INPUT
// =========================================================
function showError(elementId, message) {
    console.warn(`⚠️ Hiển thị lỗi: ${message}`);

    let errorElement = document.getElementById(elementId);
    if (!errorElement) {
        errorElement = document.createElement("div");
        errorElement.id = elementId;
        errorElement.classList.add("error-message");

        if (elementId === "usernameError") {
            const usernameInput = document.getElementById("username");
            if (usernameInput.parentElement) {
                usernameInput.parentElement.appendChild(errorElement);
            }
        } else if (elementId === "passwordError") {
            const passwordInput = document.getElementById("password");
            if (passwordInput.parentElement) {
                passwordInput.parentElement.appendChild(errorElement);
            }
        }
    }

    errorElement.innerText = message;
}

// =========================================================
// HÀM XÓA THÔNG BÁO LỖI TRƯỚC ĐÓ
// =========================================================
function clearErrorMessages() {
    console.log("🔄 Xóa tất cả thông báo lỗi trước đó...");
    const errorIds = ["usernameError", "passwordError"];
    errorIds.forEach((id) => {
        const elem = document.getElementById(id);
        if (elem) {
            elem.innerText = "";
        }
    });
}

// =========================================================
// CÁC HÀM ĐIỀU HƯỚNG TRANG
// =========================================================
function user() {
    console.log("📂 Điều hướng đến trang Admin...");
    window.location.href = "admin.html";
}

function product() {
    console.log("📦 Điều hướng đến trang Sản phẩm...");
    window.location.href = "product.html";
}

function order() {
    console.log("📜 Điều hướng đến trang Đơn hàng...");
    window.location.href = "order.html";
}

function turnover() {
    console.log("📊 Điều hướng đến trang Doanh thu...");
    window.location.href = "turnover.html";
}

function history() {
    console.log("📖 Điều hướng đến trang Lịch sử giao dịch...");
    window.location.href = "history.html";
}

function announcement() {
    console.log("📢 Điều hướng đến trang Gửi thông báo...");
    window.location.href = "announcement.html";
}

function reports() {
    console.log("📈 Điều hướng đến trang Báo cáo...");
    window.location.href = "report.html";
}
