// Biến lưu trữ biểu đồ để có thể cập nhật sau này
let revenueChart;

// Biến lưu trữ thông tin phân trang
let currentPage = 1;
let pageSize = 10;
let totalPages = 1;
let totalItems = 0;
let currentTransactions = [];
let fromDateFilter = '';
let toDateFilter = '';

// Hàm định dạng số tiền thành chuỗi có định dạng tiền tệ VND
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// Hàm định dạng ngày tháng
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}

// Hàm lấy thông tin ví admin
async function getWalletInfo() {
    try {
        const response = await fetch('/admin-site/api/admin/wallet/info', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        if (!response.ok) {
            throw new Error('Không thể lấy thông tin ví admin');
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Lỗi khi lấy thông tin ví admin:', error);
        return null;
    }
}

// Hàm lấy lịch sử giao dịch theo khoảng thời gian
async function getTransactionHistory(fromDate, toDate, page = 1, limit = 10) {
    try {
        // Lưu lại các giá trị lọc
        fromDateFilter = fromDate || '';
        toDateFilter = toDate || '';
        
        let url = `/admin-site/api/admin/wallet/history?page=${page}&limit=${limit}`;
        
        if (fromDate) {
            url += `&fromDate=${fromDate}`;
        }
        
        if (toDate) {
            url += `&toDate=${toDate}`;
        }
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        if (!response.ok) {
            throw new Error('Không thể lấy lịch sử giao dịch');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Lỗi khi lấy lịch sử giao dịch:', error);
        return { data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } };
    }
}

// Hàm lấy tổng doanh thu theo khoảng thời gian
async function getRevenueSummary(fromDate, toDate) {
    try {
        let url = '/admin-site/api/admin/revenue/summary';
        
        if (fromDate || toDate) {
            url += '?';
            if (fromDate) {
                url += `fromDate=${fromDate}`;
            }
            
            if (toDate) {
                url += fromDate ? `&toDate=${toDate}` : `toDate=${toDate}`;
            }
        }
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        if (!response.ok) {
            throw new Error('Không thể lấy thông tin doanh thu');
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Lỗi khi lấy thông tin doanh thu:', error);
        return null;
    }
}

// Hàm cập nhật thông tin doanh thu trên giao diện
function updateRevenueInfo(data) {
    if (!data) return;
    
    document.getElementById('totalShopRevenue').textContent = formatCurrency(data.total_shop_revenue);
    document.getElementById('actualRevenue').textContent = formatCurrency(data.total_admin_revenue);
    // document.getElementById('totalRevenue').textContent = formatCurrency(data.total_revenue);
}

// Hàm cập nhật bảng lịch sử giao dịch
function updateTransactionTable(transactions, pagination) {
    const tableBody = document.getElementById('transactionTableBody');
    tableBody.innerHTML = '';
    
    // Lưu trữ dữ liệu giao dịch hiện tại
    currentTransactions = transactions || [];
    
    // Cập nhật thông tin phân trang nếu có
    if (pagination) {
        currentPage = pagination.page;
        pageSize = pagination.limit;
        totalPages = pagination.totalPages;
        totalItems = pagination.total;
    }
    
    if (!transactions || transactions.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="5" class="text-center">Không có dữ liệu giao dịch</td>';
        tableBody.appendChild(row);
    } else {
        transactions.forEach(transaction => {
            const row = document.createElement('tr');
            
            const typeClass = transaction.type === 'tiền của admin' ? 'income' : 'expense';
            const shopName = transaction.shop_info ? transaction.shop_info.ten_shop : 'N/A';
            
            row.innerHTML = `
                <td>${formatDate(transaction.thoi_gian)}</td>
                <td>${transaction.mo_ta}</td>
                <td>${shopName}</td>
                <td><span class="transaction-type ${typeClass}">${transaction.type}</span></td>
                <td>${formatCurrency(transaction.so_du_thay_doi)}</td>
            `;
            
            tableBody.appendChild(row);
        });
    }
    
    // Cập nhật UI phân trang
    updatePaginationUI();
}

// Hàm cập nhật UI phân trang
function updatePaginationUI() {
    // Cập nhật thông tin trang
    document.getElementById('pageInfo').textContent = `Trang ${currentPage} / ${totalPages}`;
    
    // Cập nhật trạng thái các nút điều hướng
    document.getElementById('firstPageBtn').disabled = currentPage <= 1;
    document.getElementById('prevPageBtn').disabled = currentPage <= 1;
    document.getElementById('nextPageBtn').disabled = currentPage >= totalPages;
    document.getElementById('lastPageBtn').disabled = currentPage >= totalPages;
    
    // Tạo các nút số trang
    const pageNumbersContainer = document.getElementById('pageNumbers');
    pageNumbersContainer.innerHTML = '';
    
    // Xác định phạm vi các số trang hiển thị
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    // Điều chỉnh lại startPage nếu endPage đã đạt giới hạn
    if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
    }
    
    // Tạo các nút số trang
    for (let i = startPage; i <= endPage; i++) {
        const pageNumber = document.createElement('div');
        pageNumber.classList.add('page-number');
        if (i === currentPage) {
            pageNumber.classList.add('active');
        }
        pageNumber.textContent = i;
        pageNumber.addEventListener('click', () => goToPage(i));
        pageNumbersContainer.appendChild(pageNumber);
    }
}

// Hàm chuyển đến trang cụ thể
async function goToPage(page) {
    if (page === currentPage) return;
    
    currentPage = page;
    const transactionHistory = await getTransactionHistory(fromDateFilter, toDateFilter, currentPage, pageSize);
    if (transactionHistory && transactionHistory.data) {
        updateTransactionTable(transactionHistory.data, transactionHistory.pagination);
    }
}

// Hàm tạo biểu đồ doanh thu
function createRevenueChart(data) {
    if (!data || !data.daily_revenue || data.daily_revenue.length === 0) return;
    
    // Chuẩn bị dữ liệu cho biểu đồ
    const dates = [...new Set(data.daily_revenue.map(item => item.date))].sort();
    
    const shopRevenueData = [];
    const adminRevenueData = [];
    
    dates.forEach(date => {
        const shopRevenue = data.daily_revenue.find(item => item.date === date && item.type === 'tiền của shop');
        const adminRevenue = data.daily_revenue.find(item => item.date === date && item.type === 'tiền của admin');
        
        shopRevenueData.push(shopRevenue ? shopRevenue.amount : 0);
        adminRevenueData.push(adminRevenue ? adminRevenue.amount : 0);
    });
    
    // Lấy canvas để vẽ biểu đồ
    const ctx = document.getElementById('revenueChart').getContext('2d');
    
    // Nếu biểu đồ đã tồn tại, hủy nó để tạo biểu đồ mới
    if (revenueChart) {
        revenueChart.destroy();
    }
    
    // Tạo biểu đồ mới
    revenueChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'Tổng tiền từ shop',
                    data: shopRevenueData,
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Doanh thu của admin',
                    data: adminRevenueData,
                    backgroundColor: 'rgba(255, 99, 132, 0.7)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Ngày'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Doanh thu (VND)'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Biểu đồ doanh thu theo ngày'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${formatCurrency(context.raw)}`;
                        }
                    }
                }
            }
        }
    });
}

// Hàm khởi tạo trang
async function initPage() {
    // Lấy thông tin ví admin
    const walletInfo = await getWalletInfo();
    if (walletInfo) {
        document.getElementById('totalShopRevenue').textContent = formatCurrency(walletInfo.tong_tien_shop);
        document.getElementById('actualRevenue').textContent = formatCurrency(walletInfo.tien_thu_duoc);
        // document.getElementById('totalRevenue').textContent = formatCurrency(walletInfo.tong_tien_shop + walletInfo.tien_thu_duoc);
    }
    
    // Lấy lịch sử giao dịch gần đây
    const transactionHistory = await getTransactionHistory();
    if (transactionHistory && transactionHistory.data) {
        updateTransactionTable(transactionHistory.data, transactionHistory.pagination);
    }
    
    // Lấy dữ liệu doanh thu để vẽ biểu đồ
    const revenueSummary = await getRevenueSummary();
    if (revenueSummary) {
        console.log(revenueSummary);
        createRevenueChart(revenueSummary);
    } else {
        alert('Doanh thu không có dữ liệu');
    }
    
    // Thiết lập sự kiện cho nút lọc
    document.getElementById('filterButton').addEventListener('click', async () => {
        const fromDate = document.getElementById('fromDate').value;
        const toDate = document.getElementById('toDate').value;
        
        if (!fromDate && !toDate) {
            alert('Vui lòng chọn ít nhất một ngày để lọc');
            return;
        }
        
        // Lấy dữ liệu doanh thu theo khoảng thời gian
        const revenueSummary = await getRevenueSummary(fromDate, toDate);
        if (revenueSummary) {
            updateRevenueInfo(revenueSummary);
            createRevenueChart(revenueSummary);
        }
        
        // Lấy lịch sử giao dịch theo khoảng thời gian
        const transactionHistory = await getTransactionHistory(fromDate, toDate);
        if (transactionHistory && transactionHistory.data) {
            updateTransactionTable(transactionHistory.data, transactionHistory.pagination);
        }
    });
    
    // Thiết lập sự kiện cho các tab biểu đồ
    document.getElementById('revenueTab').addEventListener('click', function() {
        this.classList.add('active');
        document.getElementById('transactionTab').classList.remove('active');
        // Hiển thị biểu đồ doanh thu
        // Có thể thêm logic để chuyển đổi loại biểu đồ ở đây
    });
    
    // document.getElementById('transactionTab').addEventListener('click', function() {
    //     this.classList.add('active');
    //     document.getElementById('revenueTab').classList.remove('active');
    //     // Hiển thị biểu đồ giao dịch
    //     // Có thể thêm logic để chuyển đổi loại biểu đồ ở đây
    // });
    
    // Thiết lập sự kiện cho các nút phân trang
    document.getElementById('firstPageBtn').addEventListener('click', () => goToPage(1));
    document.getElementById('prevPageBtn').addEventListener('click', () => goToPage(currentPage - 1));
    document.getElementById('nextPageBtn').addEventListener('click', () => goToPage(currentPage + 1));
    document.getElementById('lastPageBtn').addEventListener('click', () => goToPage(totalPages));
    
    // Thiết lập sự kiện cho dropdown chọn số mục trên mỗi trang
    document.getElementById('pageSizeSelect').addEventListener('change', async function() {
        pageSize = parseInt(this.value);
        currentPage = 1; // Reset về trang đầu tiên khi thay đổi số mục trên trang
        const transactionHistory = await getTransactionHistory(fromDateFilter, toDateFilter, currentPage, pageSize);
        if (transactionHistory && transactionHistory.data) {
            updateTransactionTable(transactionHistory.data, transactionHistory.pagination);
        }
    });
}

// Hàm điều hướng đến các trang khác
function user() {
    window.location.href = '/admin-site';
}

function product() {
    window.location.href = '/admin-site/products';
}

function revenue() {
    window.location.href = '/admin-site/revenue';
}

function revenue() {
    window.location.href = '/admin-site/revenue';
}

function announcement() {
    window.location.href = '/admin-site/announcements';
}

function reports() {
    window.location.href = '/admin-site/reports';
}

// Khởi tạo trang khi tài liệu đã sẵn sàng
document.addEventListener('DOMContentLoaded', initPage);