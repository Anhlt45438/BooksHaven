// Lấy phần tử canvas để vẽ biểu đồ
const ctx = document.getElementById('myChart').getContext('2d');

// Dữ liệu minh họa cho biểu đồ
const labels = [
    'Tháng 1', 'Tháng 2', 'Tháng 3',
    'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9',
    'Tháng 10', 'Tháng 11', 'Tháng 12'
];
const data = [100, 300, 150, 500, 250, 400, 550, 200, 600, 350, 900, 232];

// Tạo biểu đồ sử dụng Chart.js
let myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: labels,
        datasets: [{
            label: 'Doanh thu (đ)',
            data: data,
            backgroundColor: [
                '#e67e22', '#9b59b6', '#3498db', '#f1c40f',
                '#e74c3c', '#2ecc71', '#d35400', '#8e44ad',
                '#2980b9', '#16a085', '#e74c3c', '#2ecc71'
            ],
            borderColor: '#fff',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Đơn vị (nghìn, triệu, ...)'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Các tháng trong năm'
                }
            }
        },
        plugins: {
            title: {
                display: true,
                text: 'Biểu đồ doanh thu theo tháng'
            },
            legend: {
                display: false
            }
        }
    }
});

// Log: Biểu đồ đã được tạo thành công với dữ liệu minh họa.

// [MỚI] Bắt sự kiện khi bấm nút "Tìm kiếm" (lọc doanh thu theo ngày)
document.getElementById('filterButton').addEventListener('click', () => {
    const fromDate = document.getElementById('fromDate').value; // Lấy ngày bắt đầu từ ô input
    const toDate = document.getElementById('toDate').value;     // Lấy ngày kết thúc từ ô input

    console.log(`Tính doanh thu từ ${fromDate} đến ${toDate}`); // Log sự kiện tìm kiếm

    const fromYear = new Date(fromDate).getFullYear();
    const toYear = new Date(toDate).getFullYear();
    const fromMonth = new Date(fromDate).getMonth() + 1;  // Tháng bắt đầu
    const toMonth = new Date(toDate).getMonth() + 1;      // Tháng kết thúc

    // Xử lý nếu khoảng thời gian tìm kiếm là từ 2 tháng đến 12 tháng (Biểu đồ cột theo tháng)
    if (toYear === fromYear && toMonth - fromMonth >= 2) {
        console.log("Hiển thị biểu đồ theo tháng...");
        // Cập nhật biểu đồ cột với dữ liệu tháng
        myChart.destroy();  // Xóa biểu đồ cũ
        myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels.slice(fromMonth - 1, toMonth),
                datasets: [{
                    label: 'Doanh thu (đ)',
                    data: data.slice(fromMonth - 1, toMonth),
                    backgroundColor: [
                        '#e67e22', '#9b59b6', '#3498db', '#f1c40f',
                        '#e74c3c', '#2ecc71', '#d35400', '#8e44ad',
                        '#2980b9', '#16a085', '#e74c3c', '#2ecc71'
                    ],
                    borderColor: '#fff',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Đơn vị (nghìn, triệu, ...)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Các tháng trong năm'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Biểu đồ doanh thu theo tháng'
                    },
                    legend: {
                        display: false
                    }
                }
            }
        });
        console.log("Biểu đồ theo tháng đã được hiển thị.");

    } else if (toYear - fromYear >= 1 && toYear - fromYear <= 10) {
        // Nếu khoảng thời gian là từ 2 năm trở lên và không quá 10 năm (Biểu đồ đường theo năm)
        console.log("Hiển thị biểu đồ theo năm...");
        // Cập nhật biểu đồ đường cho các năm
        myChart.destroy();  // Xóa biểu đồ cũ
        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({ length: toYear - fromYear + 1 }, (_, i) => fromYear + i),
                datasets: [{
                    label: 'Doanh thu theo năm (đ)',
                    data: Array.from({ length: toYear - fromYear + 1 }, () => Math.floor(Math.random() * 1000) + 100),  // Giả lập doanh thu ngẫu nhiên
                    fill: false,
                    borderColor: '#3498db',
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Doanh thu (đ)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Các năm'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Biểu đồ doanh thu theo năm'
                    },
                    legend: {
                        display: false
                    }
                }
            }
        });
        console.log("Biểu đồ theo năm đã được hiển thị.");

    } else {
        // Nếu khoảng thời gian tìm kiếm là 1 tháng (Biểu đồ đường theo ngày)
        console.log("Hiển thị biểu đồ theo ngày...");
        myChart.destroy();  // Xóa biểu đồ cũ
        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({ length: 30 }, (_, i) => `Ngày ${i + 1}`),  // 30 ngày trong tháng
                datasets: [{
                    label: 'Doanh thu theo ngày (đ)',
                    data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 1000) + 100),  // Giả lập doanh thu ngẫu nhiên cho từng ngày
                    fill: false,
                    borderColor: '#e74c3c',
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Doanh thu (đ)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Ngày trong tháng'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: `Biểu đồ doanh thu từ ${fromDate} đến ${toDate}`
                    },
                    legend: {
                        display: false
                    }
                }
            }
        });
        console.log("Biểu đồ theo ngày đã được hiển thị.");
    }

    // Giả sử bạn gọi API hoặc tính toán doanh thu ở đây...
    const randomRevenue = Math.floor(Math.random() * 1000) + 100;
    // Cập nhật doanh thu tổng
    document.getElementById('totalRevenue').innerText = randomRevenue + '.000đ';

    // Log: Doanh thu tính toán từ ngày bắt đầu đến ngày kết thúc được hiển thị
    console.log(`Doanh thu: ${randomRevenue}.000đ`);
});
