document.addEventListener('DOMContentLoaded', function () {
    const baseUrl = "http://14.225.206.60:3000/api";

    const userIdInput = document.getElementById("userIdInput");
    const searchBtn = document.querySelector(".search-btn");
    const roleButtons = document.querySelectorAll(".button-group button");
    const userIdContainer = document.querySelector(".input-field");
    const userNameDisplay = document.getElementById("userNameDisplay");
    const roleButtonsContainer = document.querySelector(".button-group");
    const notificationSection = document.querySelector(".notification-section");
    const sendNotificationBtn = document.querySelector(".submit-btn");
    const closeBtn = document.querySelector(".close-btn");

    let selectedRole = null;

    // Handle search by user ID
    searchBtn.addEventListener('click', function () {
        const userId = userIdInput.value.trim();

        if (userId) {
            fetch(`${baseUrl}/admin/users/${userId}`)
                .then(response => response.json())
                .then(data => {
                    if (data && data.data) {
                        userNameDisplay.textContent = `Tên người dùng: ${data.data.username}`;
                        userNameDisplay.style.display = 'block';
                    } else {
                        alert('User not found');
                    }
                })
                .catch(() => {
                    alert('Error fetching user data');
                });
        }
    });

    // Handle role selection
    roleButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Hide the user ID input field
            userIdContainer.style.display = 'none';

            // Highlight the selected role button
            roleButtons.forEach(btn => btn.style.backgroundColor = '#667eea');
            this.style.backgroundColor = '#5a67d8';

            selectedRole = this.textContent; // Store the selected role
        });
    });

    // Handle submit notification
    sendNotificationBtn.addEventListener('click', function () {
        let notificationData = {};

        if (selectedRole) {
            notificationData.role = selectedRole;
        } else {
            notificationData.id_user = userIdInput.value.trim(); // Only use user ID if role isn't selected
        }

        const messageContent = document.getElementById("messageInput").value.trim();

        if (messageContent) {
            notificationData.noi_dung_thong_bao = messageContent;

            // Send the notification
            fetch(`${baseUrl}/api/notifications/send-${selectedRole ? 'by-role' : 'to-user'}`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(notificationData)
            })
                .then(response => response.json())
                .then(data => {
                    if (data.message) {
                        alert(data.message);
                    }
                })
                .catch(() => {
                    alert('Error sending notification');
                });
        } else {
            alert("Vui lòng nhập nội dung thông báo.");
        }
    });


});
