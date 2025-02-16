// Lấy phần tử canvas
const ctx = document.getElementById('myChart').getContext('2d');

// Dữ liệu minh họa
const labels = [
    'Tháng 1', 'Tháng 2', 'Tháng 3',
    'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9',
    'Tháng 10'
];
const data = [100, 300, 150, 500, 250, 400, 550, 200, 600, 350];

// Tạo biểu đồ
const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: labels,
        datasets: [{
            label: 'Doanh thu (đ)',
            data: data,
            backgroundColor: [
                '#e67e22', '#9b59b6', '#3498db', '#f1c40f',
                '#e74c3c', '#2ecc71', '#d35400', '#8e44ad',
                '#2980b9', '#16a085'
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

// [MỚI] Bắt sự kiện khi bấm nút "Tìm kiếm" (lọc doanh thu theo ngày)
document.getElementById('filterButton').addEventListener('click', () => {
    const fromDate = document.getElementById('fromDate').value; // 2025-02-01
    const toDate = document.getElementById('toDate').value;     // 2025-02-10

    console.log(`Tính doanh thu từ ${fromDate} đến ${toDate}`);

    // Giả sử bạn gọi API hoặc tính toán doanh thu ở đây...
    // Ví dụ minh hoạ, ta random 1 con số:
    const randomRevenue = Math.floor(Math.random() * 1000) + 100;

    // Cập nhật text hiển thị doanh thu
    document.getElementById('totalRevenue').innerText = randomRevenue + '.000đ';

    // Nếu muốn thay đổi dữ liệu biểu đồ, ví dụ random:
    // (hoặc bạn có thể thay đổi theo dữ liệu thật)
    myChart.data.datasets[0].data = labels.map(() => Math.floor(Math.random() * 600) + 100);
    myChart.update();
});
