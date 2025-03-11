async function login() {
    console.log("Bắt đầu quá trình đăng nhập...");

    // Lấy dữ liệu từ input
    const emailInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const email = emailInput.value;
    const password = passwordInput.value;
    console.log("Dữ liệu lấy từ input:", { email, password });

    // Xóa thông báo lỗi cũ (nếu có)
    clearErrorMessages();

    if (!email || !password) {
        console.error("Email hoặc mật khẩu trống.");
        alert("Vui lòng nhập đầy đủ email và mật khẩu.");
        return;
    }

    const payload = { email, password };
    console.log("Payload gửi đến server:", payload);

    try {
        const endpoint = "http://localhost:3000/api/users/login";
        console.log("Đang gửi request POST đến server tại", endpoint);

        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
        console.log("Phản hồi từ server:", response);

        const text = await response.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch (error) {
            console.error("Không thể parse JSON, dữ liệu trả về:", text);
            data = {};
        }
        console.log("Dữ liệu JSON nhận được từ server:", data);

        if (response.ok) {
            console.log("Đăng nhập thành công!");
            showSuccessAndCountdown();
        } else {
            console.error("Đăng nhập thất bại. Lỗi:", data.error);
            if (data.error) {
                if (data.error.toLowerCase().includes("account") || data.error.toLowerCase().includes("username")) {
                    showError("usernameError", data.error);
                } else if (data.error.toLowerCase().includes("password")) {
                    showError("passwordError", data.error);
                } else {
                    showError("usernameError", data.error);
                    showError("passwordError", data.error);
                }
            } else {
                showError("usernameError", "Đăng nhập thất bại");
                showError("passwordError", "Đăng nhập thất bại");
            }
        }
    } catch (error) {
        console.error("Lỗi trong quá trình gửi request đăng nhập:", error);
        alert("Có lỗi xảy ra trong quá trình đăng nhập!");
    }
}

function clearErrorMessages() {
    const errorIds = ["usernameError", "passwordError"];
    errorIds.forEach((id) => {
        const elem = document.getElementById(id);
        if (elem) {
            elem.innerText = "";
        }
    });
}

function showSuccessAndCountdown() {
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
    notification.innerHTML = `Đăng nhập thành công, sẽ tự động chuyển hướng trang sau ${countdown} giây.`;

    const intervalId = setInterval(() => {
        countdown--;
        if (countdown <= 0) {
            clearInterval(intervalId);
            window.location.href = "admin.html";
        } else {
            notification.innerHTML = `Đăng nhập thành công, sẽ tự động chuyển hướng trang sau ${countdown} giây.`;
        }
    }, 1000);
}

function showError(elementId, message) {
    let errorElement = document.getElementById(elementId);
    if (!errorElement) {
        errorElement = document.createElement("div");
        errorElement.id = elementId;
        errorElement.classList.add("error-message");

        // Xác định vị trí chèn: nếu usernameError, chèn vào container của input username
        if (elementId === "usernameError") {
            const usernameInput = document.getElementById("username");
            // Đảm bảo container cha của input có position: relative
            if (usernameInput.parentElement) {
                usernameInput.parentElement.style.position = "relative";
                usernameInput.parentElement.appendChild(errorElement);
            }
        } else if (elementId === "passwordError") {
            const passwordInput = document.getElementById("password");
            if (passwordInput.parentElement) {
                passwordInput.parentElement.style.position = "relative";
                passwordInput.parentElement.appendChild(errorElement);
            }
        }
    }
    errorElement.innerText = message;
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
